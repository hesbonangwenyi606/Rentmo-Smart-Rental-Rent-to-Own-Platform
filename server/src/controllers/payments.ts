import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import { initiateSTKPush, querySTKStatus } from "../services/mpesa";
import { calculateAndUpdateScore } from "../services/creditScore";
import * as R from "../utils/response";

const mpesaInitSchema = z.object({
  amount: z.number().positive(),
  phone: z.string().min(9),
  leaseId: z.string().optional(),
  description: z.string().default("Rent Payment"),
});

const recordPaymentSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(["CARD", "BANK"]),
  leaseId: z.string().optional(),
  description: z.string(),
  transactionRef: z.string().optional(),
});

export async function list(req: Request, res: Response) {
  const { page = "1", limit = "20" } = req.query as Record<string, string>;
  const p = parseInt(page, 10) || 1;
  const l = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (p - 1) * l;

  const where =
    req.user!.role === "ADMIN"
      ? {}
      : { tenantId: req.user!.userId };

  const [total, payments] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      include: {
        tenant: { select: { id: true, name: true, email: true } },
        lease: { include: { property: { select: { title: true } } } },
      },
    }),
  ]);

  R.paginated(res, payments, total, p, l);
}

export async function initiateMpesa(req: Request, res: Response) {
  const parsed = mpesaInitSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const { amount, phone, leaseId, description } = parsed.data;

  // Create pending payment record first
  const payment = await prisma.payment.create({
    data: {
      tenantId: req.user!.userId,
      leaseId,
      amount,
      method: "MPESA",
      status: "PENDING",
      description,
    },
  });

  try {
    const stk = await initiateSTKPush({
      phone,
      amount,
      accountRef: leaseId ? `Lease-${leaseId.slice(0, 8)}` : "Rentmo",
      description,
    });

    // Store the checkout ID so we can match the callback
    await prisma.payment.update({
      where: { id: payment.id },
      data: { checkoutId: stk.CheckoutRequestID },
    });

    R.success(res, {
      paymentId: payment.id,
      checkoutRequestId: stk.CheckoutRequestID,
      merchantRequestId: stk.MerchantRequestID,
      message: stk.CustomerMessage,
    });
  } catch (err) {
    // Mark payment as failed and report a clear error
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    const axiosErr = err as { response?: { data?: { errorMessage?: string } } };
    const msg =
      axiosErr?.response?.data?.errorMessage ||
      "M-Pesa request failed. Please check your credentials and try again.";

    R.error(res, msg, 502);
  }
}

/**
 * Safaricom calls this URL after the customer completes/rejects the STK push
 */
export async function mpesaCallback(req: Request, res: Response) {
  const body = req.body?.Body?.stkCallback;

  if (!body) {
    res.status(200).json({ ResultCode: 0, ResultDesc: "OK" });
    return;
  }

  const checkoutId: string = body.CheckoutRequestID;
  const resultCode: number = body.ResultCode;

  const payment = await prisma.payment.findFirst({
    where: { checkoutId },
  });

  if (!payment) {
    res.status(200).json({ ResultCode: 0, ResultDesc: "OK" });
    return;
  }

  if (resultCode === 0) {
    // Payment successful
    const meta: Record<string, string> = {};
    const items: { Name: string; Value: unknown }[] =
      body.CallbackMetadata?.Item || [];
    for (const item of items) {
      meta[item.Name] = String(item.Value);
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        mpesaReceiptNo: meta["MpesaReceiptNumber"] || null,
        transactionRef: meta["MpesaReceiptNumber"] || `MPESA-${Date.now()}`,
      },
    });

    // Update equity if it's a rent-to-own lease
    if (payment.leaseId) {
      const lease = await prisma.lease.findUnique({
        where: { id: payment.leaseId },
        include: { property: true },
      });
      if (lease?.property.type === "RENT_TO_OWN" && lease.property.propertyValue) {
        const equityPerPayment =
          (payment.amount / lease.property.propertyValue) * 100;
        await prisma.lease.update({
          where: { id: payment.leaseId },
          data: { equityBuilt: { increment: equityPerPayment } },
        });
      }
    }

    // Recalculate credit score
    await calculateAndUpdateScore(payment.tenantId);

    // Notify tenant
    await prisma.notification.create({
      data: {
        userId: payment.tenantId,
        title: "Payment confirmed",
        message: `KES ${payment.amount.toLocaleString()} received via M-Pesa`,
        type: "success",
      },
    });
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
  }

  res.status(200).json({ ResultCode: 0, ResultDesc: "OK" });
}

/** Simulate STK Push completion — for development/testing only */
export async function simulatePayment(req: Request, res: Response) {
  if (process.env.NODE_ENV === "production") {
    R.forbidden(res, "Not available in production");
    return;
  }

  const { paymentId } = req.params;
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment) {
    R.notFound(res, "Payment");
    return;
  }

  const receipt = `SIM${Date.now()}`;
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "COMPLETED",
      mpesaReceiptNo: receipt,
      transactionRef: receipt,
    },
  });

  if (payment.leaseId) {
    const lease = await prisma.lease.findUnique({
      where: { id: payment.leaseId },
      include: { property: true },
    });
    if (lease?.property.type === "RENT_TO_OWN" && lease.property.propertyValue) {
      const equityPerPayment =
        (payment.amount / lease.property.propertyValue) * 100;
      await prisma.lease.update({
        where: { id: payment.leaseId },
        data: { equityBuilt: { increment: equityPerPayment } },
      });
    }
  }

  await calculateAndUpdateScore(payment.tenantId);

  await prisma.notification.create({
    data: {
      userId: payment.tenantId,
      title: "Payment confirmed",
      message: `KES ${payment.amount.toLocaleString()} received (simulated)`,
      type: "success",
    },
  });

  R.success(res, { receipt }, "Payment simulated as completed");
}

export async function recordPayment(req: Request, res: Response) {
  const parsed = recordPaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const { amount, method, leaseId, description, transactionRef } = parsed.data;

  const payment = await prisma.payment.create({
    data: {
      tenantId: req.user!.userId,
      leaseId,
      amount,
      method,
      status: "COMPLETED",
      description,
      transactionRef: transactionRef || `${method}-${Date.now()}`,
    },
  });

  await calculateAndUpdateScore(req.user!.userId);

  R.created(res, payment);
}

export async function getById(req: Request, res: Response) {
  const payment = await prisma.payment.findUnique({
    where: { id: req.params.id },
  });

  if (!payment) {
    R.notFound(res, "Payment");
    return;
  }

  if (payment.tenantId !== req.user!.userId && req.user!.role !== "ADMIN") {
    R.forbidden(res);
    return;
  }

  R.success(res, {
    id: payment.id,
    status: payment.status,
    amount: payment.amount,
    method: payment.method,
    mpesaReceiptNo: payment.mpesaReceiptNo,
    transactionRef: payment.transactionRef,
    description: payment.description,
    createdAt: payment.createdAt,
  });
}

export async function queryStatus(req: Request, res: Response) {
  const { checkoutRequestId } = req.params;
  try {
    const result = await querySTKStatus(checkoutRequestId);
    R.success(res, result);
  } catch {
    R.error(res, "Could not query payment status", 502);
  }
}

export async function getReceipt(req: Request, res: Response) {
  const payment = await prisma.payment.findUnique({
    where: { id: req.params.id },
    include: {
      tenant: { select: { name: true, email: true, phone: true } },
      lease: {
        include: {
          property: { select: { title: true, location: true } },
        },
      },
    },
  });

  if (!payment) {
    R.notFound(res, "Payment");
    return;
  }

  // Ensure the requesting user owns this payment (or is admin)
  if (
    payment.tenantId !== req.user!.userId &&
    req.user!.role !== "ADMIN"
  ) {
    R.forbidden(res);
    return;
  }

  R.success(res, payment);
}

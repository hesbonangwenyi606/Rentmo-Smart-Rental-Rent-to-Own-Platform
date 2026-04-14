import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import * as R from "../utils/response";

const applySchema = z.object({
  amount: z.number().positive().max(500000, "Maximum loan amount is KES 500,000"),
  purpose: z.string().min(10, "Please provide more detail about the purpose"),
});

const statusSchema = z.object({
  status: z.enum(["APPROVED", "DISBURSED", "REJECTED", "REPAID"]),
  notes: z.string().optional(),
  monthlyRepayment: z.number().optional(),
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

  const [total, loans] = await Promise.all([
    prisma.loanApplication.count({ where }),
    prisma.loanApplication.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      include: {
        tenant: { select: { id: true, name: true, email: true, phone: true } },
      },
    }),
  ]);

  R.paginated(res, loans, total, p, l);
}

export async function apply(req: Request, res: Response) {
  const parsed = applySchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  // Check the user has a credit score ≥ 550 before allowing a loan
  const creditScore = await prisma.creditScore.findUnique({
    where: { userId: req.user!.userId },
  });
  if (!creditScore || creditScore.score < 550) {
    R.error(
      res,
      "Your credit score is too low for a rent loan. Make consistent on-time payments to improve it.",
      422
    );
    return;
  }

  // Check for an existing pending / approved loan
  const existingActive = await prisma.loanApplication.findFirst({
    where: {
      tenantId: req.user!.userId,
      status: { in: ["PENDING", "APPROVED", "DISBURSED"] },
    },
  });
  if (existingActive) {
    R.error(
      res,
      "You already have an active loan application. Please resolve it before applying again.",
      409
    );
    return;
  }

  const { amount, purpose } = parsed.data;

  // Simple interest calculation: 8.5% per annum, 3-month term
  const monthlyRepayment = Math.ceil((amount * 1.085) / 3);

  const loan = await prisma.loanApplication.create({
    data: {
      tenantId: req.user!.userId,
      amount,
      purpose,
      monthlyRepayment,
    },
  });

  // Notify user
  await prisma.notification.create({
    data: {
      userId: req.user!.userId,
      title: "Loan application received",
      message: `Your application for KES ${amount.toLocaleString()} is under review.`,
      type: "info",
    },
  });

  R.created(res, loan);
}

export async function getById(req: Request, res: Response) {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: req.params.id },
    include: {
      tenant: { select: { id: true, name: true, email: true } },
    },
  });

  if (!loan) {
    R.notFound(res, "Loan");
    return;
  }

  if (loan.tenantId !== req.user!.userId && req.user!.role !== "ADMIN") {
    R.forbidden(res);
    return;
  }

  R.success(res, loan);
}

export async function updateStatus(req: Request, res: Response) {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const loan = await prisma.loanApplication.findUnique({
    where: { id: req.params.id },
  });

  if (!loan) {
    R.notFound(res, "Loan");
    return;
  }

  const { status, notes, monthlyRepayment } = parsed.data;

  const updated = await prisma.loanApplication.update({
    where: { id: req.params.id },
    data: {
      status,
      notes,
      ...(monthlyRepayment && { monthlyRepayment }),
      ...(status === "DISBURSED" && { disbursedAt: new Date() }),
      ...(status === "REPAID" && { repaidAt: new Date() }),
    },
  });

  // Notify tenant
  const messages: Record<string, string> = {
    APPROVED: `Your loan of KES ${loan.amount.toLocaleString()} has been approved.`,
    DISBURSED: `KES ${loan.amount.toLocaleString()} has been disbursed to your M-Pesa.`,
    REJECTED: `Your loan application was not approved. ${notes || ""}`,
    REPAID: `Your loan of KES ${loan.amount.toLocaleString()} has been marked as repaid.`,
  };

  if (messages[status]) {
    await prisma.notification.create({
      data: {
        userId: loan.tenantId,
        title: `Loan ${status.toLowerCase()}`,
        message: messages[status],
        type: status === "REJECTED" ? "error" : "success",
      },
    });
  }

  R.success(res, updated);
}

import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import * as R from "../utils/response";

const updateUserSchema = z.object({
  role: z.enum(["TENANT", "LANDLORD", "ADMIN"]).optional(),
  kycStatus: z.enum(["PENDING", "VERIFIED", "REJECTED"]).optional(),
  name: z.string().optional(),
});

export async function getStats(_req: Request, res: Response) {
  const [
    totalUsers,
    totalProperties,
    totalPayments,
    totalPaymentAmount,
    pendingLoans,
    pendingClaims,
    activeLeases,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.payment.count({ where: { status: "COMPLETED" } }),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.loanApplication.count({ where: { status: "PENDING" } }),
    prisma.insuranceClaim.count({ where: { status: "PENDING" } }),
    prisma.lease.count({ where: { status: "ACTIVE" } }),
  ]);

  const byRole = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  R.success(res, {
    users: {
      total: totalUsers,
      byRole: Object.fromEntries(byRole.map((r) => [r.role, r._count])),
    },
    properties: { total: totalProperties, activeLeases },
    payments: {
      total: totalPayments,
      totalAmountKES: totalPaymentAmount._sum.amount || 0,
    },
    pendingLoans,
    pendingClaims,
  });
}

export async function getUsers(req: Request, res: Response) {
  const { page = "1", limit = "20", role = "", search = "" } = req.query as Record<string, string>;
  const p = parseInt(page, 10) || 1;
  const l = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (p - 1) * l;

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        kycStatus: true,
        createdAt: true,
        _count: { select: { leases: true, payments: true } },
      },
    }),
  ]);

  R.paginated(res, users, total, p, l);
}

export async function updateUser(req: Request, res: Response) {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: parsed.data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      kycStatus: true,
      updatedAt: true,
    },
  });

  if (parsed.data.kycStatus === "VERIFIED") {
    await prisma.notification.create({
      data: {
        userId: req.params.id,
        title: "KYC Verified!",
        message:
          "Your identity has been verified. You can now access all Rentmo features including rent loans.",
        type: "success",
      },
    });
  }

  R.success(res, user);
}

export async function getAllPayments(req: Request, res: Response) {
  const { page = "1", limit = "20", status = "" } = req.query as Record<string, string>;
  const p = parseInt(page, 10) || 1;
  const l = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (p - 1) * l;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

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

export async function getAllLoans(req: Request, res: Response) {
  const { page = "1", limit = "20", status = "" } = req.query as Record<string, string>;
  const p = parseInt(page, 10) || 1;
  const l = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (p - 1) * l;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [total, loans] = await Promise.all([
    prisma.loanApplication.count({ where }),
    prisma.loanApplication.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            creditScore: { select: { score: true } },
          },
        },
      },
    }),
  ]);

  R.paginated(res, loans, total, p, l);
}

export async function getAllClaims(req: Request, res: Response) {
  const { page = "1", limit = "20", status = "" } = req.query as Record<string, string>;
  const p = parseInt(page, 10) || 1;
  const l = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (p - 1) * l;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [total, claims] = await Promise.all([
    prisma.insuranceClaim.count({ where }),
    prisma.insuranceClaim.findMany({
      where,
      skip,
      take: l,
      orderBy: { filedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        subscription: { include: { plan: { select: { name: true } } } },
      },
    }),
  ]);

  R.paginated(res, claims, total, p, l);
}

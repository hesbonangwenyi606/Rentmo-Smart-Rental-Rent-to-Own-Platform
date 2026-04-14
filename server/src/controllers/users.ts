import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import * as R from "../utils/response";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function getProfile(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      kycStatus: true,
      avatar: true,
      createdAt: true,
      creditScore: true,
      leases: {
        where: { status: "ACTIVE" },
        include: { property: true },
        take: 1,
      },
      insuranceSubscription: { include: { plan: true } },
      _count: { select: { payments: true, notifications: true } },
    },
  });

  if (!user) {
    R.notFound(res, "User");
    return;
  }

  R.success(res, user);
}

export async function updateProfile(req: Request, res: Response) {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: parsed.data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      kycStatus: true,
      avatar: true,
      updatedAt: true,
    },
  });

  R.success(res, user, "Profile updated");
}

export async function changePassword(req: Request, res: Response) {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) {
    R.notFound(res, "User");
    return;
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    R.error(res, "Current password is incorrect", 400);
    return;
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: req.user!.userId },
    data: { password: hashed },
  });

  // Invalidate all refresh tokens
  await prisma.refreshToken.deleteMany({ where: { userId: req.user!.userId } });

  R.success(res, null, "Password changed. Please log in again.");
}

export async function getDashboard(req: Request, res: Response) {
  const userId = req.user!.userId;

  const [user, activeLease, recentPayments, unreadCount, creditScore] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, kycStatus: true },
      }),
      prisma.lease.findFirst({
        where: { tenantId: userId, status: "ACTIVE" },
        include: {
          property: true,
          payments: {
            where: { status: "COMPLETED" },
            orderBy: { createdAt: "desc" },
            take: 6,
          },
        },
      }),
      prisma.payment.findMany({
        where: { tenantId: userId },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
      prisma.creditScore.findUnique({ where: { userId } }),
    ]);

  let history: unknown[] = [];
  if (creditScore?.history) {
    try {
      history = JSON.parse(creditScore.history) as unknown[];
    } catch {
      history = [];
    }
  }

  R.success(res, {
    user,
    activeLease: activeLease
      ? {
          ...activeLease,
          property: {
            ...activeLease.property,
            images: JSON.parse(activeLease.property.images || "[]"),
            features: JSON.parse(activeLease.property.features || "[]"),
          },
        }
      : null,
    recentPayments,
    unreadNotifications: unreadCount,
    creditScore: creditScore
      ? { ...creditScore, history }
      : null,
  });
}

export async function getLandlordDashboard(req: Request, res: Response) {
  const userId = req.user!.userId;

  const [properties, totalRevenue, activeLeases] = await Promise.all([
    prisma.property.findMany({
      where: { ownerId: userId },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: { tenant: { select: { name: true, email: true } } },
        },
      },
    }),
    prisma.payment.aggregate({
      where: {
        lease: { property: { ownerId: userId } },
        status: "COMPLETED",
      },
      _sum: { amount: true },
    }),
    prisma.lease.count({
      where: { property: { ownerId: userId }, status: "ACTIVE" },
    }),
  ]);

  R.success(res, {
    properties: properties.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      features: JSON.parse(p.features || "[]"),
    })),
    stats: {
      totalProperties: properties.length,
      activeLeases,
      occupancyRate:
        properties.length > 0
          ? Math.round((activeLeases / properties.length) * 100)
          : 0,
      totalRevenue: totalRevenue._sum.amount || 0,
    },
  });
}

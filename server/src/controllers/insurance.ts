import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import * as R from "../utils/response";

function parseFeatures(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

const subscribeSchema = z.object({
  planId: z.string(),
});

const claimSchema = z.object({
  reason: z.enum(["income_disruption", "medical", "eviction", "other"]),
  amount: z.number().positive(),
  description: z.string().min(20, "Please provide more detail"),
});

const claimStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional(),
});

function nextClaimRef() {
  return `CLM-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

export async function getPlans(_req: Request, res: Response) {
  const plans = await prisma.insurancePlan.findMany();
  R.success(
    res,
    plans.map((p) => ({ ...p, features: parseFeatures(p.features) }))
  );
}

export async function getSubscription(req: Request, res: Response) {
  const sub = await prisma.insuranceSubscription.findUnique({
    where: { userId: req.user!.userId },
    include: {
      plan: true,
      claims: { orderBy: { filedAt: "desc" }, take: 10 },
    },
  });

  if (!sub) {
    R.success(res, null);
    return;
  }

  R.success(res, {
    ...sub,
    plan: { ...sub.plan, features: parseFeatures(sub.plan.features) },
  });
}

export async function subscribe(req: Request, res: Response) {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const plan = await prisma.insurancePlan.findUnique({
    where: { id: parsed.data.planId },
  });
  if (!plan) {
    R.notFound(res, "Insurance plan");
    return;
  }

  // Upsert — switching plans is allowed
  const renewsAt = new Date();
  renewsAt.setFullYear(renewsAt.getFullYear() + 1);

  const sub = await prisma.insuranceSubscription.upsert({
    where: { userId: req.user!.userId },
    create: {
      userId: req.user!.userId,
      planId: parsed.data.planId,
      renewsAt,
    },
    update: {
      planId: parsed.data.planId,
      status: "active",
      renewsAt,
    },
    include: { plan: true },
  });

  await prisma.notification.create({
    data: {
      userId: req.user!.userId,
      title: `${plan.name} activated`,
      message: `You are now covered under ${plan.name}. Your policy renews on ${renewsAt.toLocaleDateString("en-KE")}.`,
      type: "success",
    },
  });

  R.success(res, {
    ...sub,
    plan: { ...sub.plan, features: parseFeatures(sub.plan.features) },
  });
}

export async function cancelSubscription(req: Request, res: Response) {
  const sub = await prisma.insuranceSubscription.findUnique({
    where: { userId: req.user!.userId },
  });

  if (!sub) {
    R.notFound(res, "Subscription");
    return;
  }

  await prisma.insuranceSubscription.update({
    where: { userId: req.user!.userId },
    data: { status: "cancelled" },
  });

  R.success(res, null, "Subscription cancelled. Coverage continues until end of paid period.");
}

export async function getClaims(req: Request, res: Response) {
  const where =
    req.user!.role === "ADMIN"
      ? {}
      : { userId: req.user!.userId };

  const claims = await prisma.insuranceClaim.findMany({
    where,
    orderBy: { filedAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      subscription: { include: { plan: { select: { name: true } } } },
    },
  });

  R.success(res, claims);
}

export async function fileClaim(req: Request, res: Response) {
  const parsed = claimSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const sub = await prisma.insuranceSubscription.findUnique({
    where: { userId: req.user!.userId },
    include: { plan: true },
  });

  if (!sub || sub.status !== "active") {
    R.error(res, "You do not have an active insurance subscription", 422);
    return;
  }

  // Check claim limits
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const claimsThisYear = await prisma.insuranceClaim.count({
    where: {
      subscriptionId: sub.id,
      filedAt: { gte: oneYearAgo },
    },
  });

  const maxClaims = sub.plan.name.toLowerCase().includes("premium") ? 3 : 1;
  if (claimsThisYear >= maxClaims) {
    R.error(
      res,
      `You have reached the maximum of ${maxClaims} claim(s) per year for your plan.`,
      422
    );
    return;
  }

  const { reason, amount, description } = parsed.data;

  const claim = await prisma.insuranceClaim.create({
    data: {
      subscriptionId: sub.id,
      userId: req.user!.userId,
      reason: reason.replace("_", " "),
      amount,
      description,
      reference: nextClaimRef(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: req.user!.userId,
      title: "Claim submitted",
      message: `Claim ${claim.reference} for KES ${amount.toLocaleString()} is under review.`,
      type: "info",
    },
  });

  R.created(res, claim);
}

export async function updateClaimStatus(req: Request, res: Response) {
  const parsed = claimStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const claim = await prisma.insuranceClaim.findUnique({
    where: { id: req.params.id },
  });

  if (!claim) {
    R.notFound(res, "Claim");
    return;
  }

  const updated = await prisma.insuranceClaim.update({
    where: { id: req.params.id },
    data: {
      status: parsed.data.status,
      resolvedAt: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: claim.userId,
      title: `Claim ${parsed.data.status.toLowerCase()}`,
      message:
        parsed.data.status === "APPROVED"
          ? `Your claim ${claim.reference} for KES ${claim.amount.toLocaleString()} has been approved. Funds will be disbursed within 2 business days.`
          : `Your claim ${claim.reference} was not approved. ${parsed.data.notes || ""}`,
      type: parsed.data.status === "APPROVED" ? "success" : "error",
    },
  });

  R.success(res, updated);
}

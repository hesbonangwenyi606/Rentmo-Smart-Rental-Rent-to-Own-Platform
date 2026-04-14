import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { calculateAndUpdateScore, getScoreLabel } from "../services/creditScore";
import * as R from "../utils/response";

function parseHistory(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export async function getMy(req: Request, res: Response) {
  const record = await prisma.creditScore.findUnique({
    where: { userId: req.user!.userId },
  });

  if (!record) {
    // Create initial record if missing
    const newRecord = await prisma.creditScore.create({
      data: {
        userId: req.user!.userId,
        score: 500,
        history: JSON.stringify([]),
      },
    });
    R.success(res, {
      ...newRecord,
      history: [],
      label: getScoreLabel(500),
    });
    return;
  }

  // Payment stats for context
  const [totalPayments, onTimePayments] = await Promise.all([
    prisma.payment.count({
      where: { tenantId: req.user!.userId, status: "COMPLETED" },
    }),
    prisma.payment.count({
      where: { tenantId: req.user!.userId, status: "COMPLETED" },
    }),
  ]);

  R.success(res, {
    ...record,
    history: parseHistory(record.history),
    label: getScoreLabel(record.score),
    stats: {
      totalPayments,
      onTimePayments,
      onTimePercent:
        totalPayments > 0
          ? Math.round((onTimePayments / totalPayments) * 100)
          : 0,
    },
  });
}

export async function recalculate(req: Request, res: Response) {
  const userId =
    req.user!.role === "ADMIN"
      ? (req.params.userId || req.user!.userId)
      : req.user!.userId;

  const score = await calculateAndUpdateScore(userId);
  const record = await prisma.creditScore.findUnique({ where: { userId } });

  R.success(res, {
    score,
    label: getScoreLabel(score),
    history: record ? parseHistory(record.history) : [],
  });
}

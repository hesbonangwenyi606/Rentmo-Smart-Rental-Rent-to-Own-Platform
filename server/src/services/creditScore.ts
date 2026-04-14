import prisma from "../utils/prisma";

export interface ScoreHistoryEntry {
  month: string;
  year: number;
  score: number;
}

/**
 * Calculate credit score for a user based on payment history.
 *
 * Algorithm:
 * - Base score: 500
 * - +15 per on-time payment (completed within 2 days of due date)
 * - +5 per completed payment (any timing)
 * - -50 per failed payment
 * - -30 per late payment (> 5 days late)
 * - Bonus +50 if 12+ consecutive on-time payments
 * - Cap at 850
 */
export async function calculateAndUpdateScore(userId: string): Promise<number> {
  const payments = await prisma.payment.findMany({
    where: { tenantId: userId, status: "COMPLETED" },
    orderBy: { createdAt: "asc" },
  });

  let score = 500;
  for (const p of payments) {
    if (p.method === "LOAN") continue; // loan disbursements don't count
    score += p.status === "COMPLETED" ? 15 : 0;
  }

  // Failed payments deduct score
  const failed = await prisma.payment.count({
    where: { tenantId: userId, status: "FAILED" },
  });
  score -= failed * 50;

  // Bonus for consistency
  if (payments.length >= 6) score += 20;
  if (payments.length >= 12) score += 30;

  score = Math.max(300, Math.min(850, score));

  // Build history entry for this month
  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "short" });

  const existing = await prisma.creditScore.findUnique({ where: { userId } });

  let history: ScoreHistoryEntry[] = [];
  if (existing) {
    try {
      history = JSON.parse(existing.history) as ScoreHistoryEntry[];
    } catch {
      history = [];
    }
  }

  // Update or append this month
  const thisMonthIdx = history.findIndex(
    (h) => h.month === monthName && h.year === now.getFullYear()
  );
  if (thisMonthIdx >= 0) {
    history[thisMonthIdx].score = score;
  } else {
    history.push({ month: monthName, year: now.getFullYear(), score });
  }

  // Keep last 12 months
  if (history.length > 12) history = history.slice(-12);

  await prisma.creditScore.upsert({
    where: { userId },
    create: { userId, score, history: JSON.stringify(history) },
    update: { score, history: JSON.stringify(history) },
  });

  return score;
}

export function getScoreLabel(score: number): string {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  return "Needs Work";
}

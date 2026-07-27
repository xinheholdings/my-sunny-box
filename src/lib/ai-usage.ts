import "server-only";

import { getPrismaClient } from "@/lib/prisma";

export const PLAN_DAILY_LIMITS = {
  FREE: 10,
  PRO: 1000,
} as const;

function utcDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function reserveDailyAiUsage(
  userId: string,
  plan: keyof typeof PLAN_DAILY_LIMITS,
) {
  const date = utcDateKey();
  const limit = PLAN_DAILY_LIMITS[plan];
  const usage = await getPrismaClient().dailyAiUsage.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, count: 1 },
    update: { count: { increment: 1 } },
    select: { count: true },
  });

  if (usage.count > limit) {
    await getPrismaClient().dailyAiUsage.update({
      where: { userId_date: { userId, date } },
      data: { count: { decrement: 1 } },
    });
    return { allowed: false, date, limit, used: limit };
  }

  return { allowed: true, date, limit, used: usage.count };
}

export async function releaseDailyAiUsage(userId: string, date: string) {
  await getPrismaClient().dailyAiUsage.updateMany({
    where: { userId, date, count: { gt: 0 } },
    data: { count: { decrement: 1 } },
  });
}

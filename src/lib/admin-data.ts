import "server-only";

import { getPrismaClient } from "@/lib/prisma";

export async function getAdminDashboardData() {
  const prisma = getPrismaClient();
  const [totalUsers, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
        usageCount: true,
        role: true,
        plan: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
      },
    }),
  ]);

  return { totalUsers, users };
}

export async function getAdminUserDetails(id: string) {
  return getPrismaClient().user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      displayName: true,
      createdAt: true,
      usageCount: true,
      role: true,
      plan: true,
      subscriptionStatus: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      conversations: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });
}

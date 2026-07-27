import { getCurrentUser } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { getStripe, getStripePriceId } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return Response.json({ error: "请先登录后再升级。" }, { status: 401 });
  }

  try {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        plan: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      return Response.json({ error: "用户不存在。" }, { status: 401 });
    }
    if (user.plan === "PRO" && user.subscriptionStatus === "ACTIVE") {
      return Response.json({ error: "当前账户已经是 Pro 套餐。" }, { status: 409 });
    }

    const stripe = getStripe();
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName || undefined,
        metadata: { sunnyboxUserId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const origin = new URL(request.url).origin;
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: getStripePriceId(), quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      client_reference_id: user.id,
      metadata: { sunnyboxUserId: user.id },
      subscription_data: {
        metadata: { sunnyboxUserId: user.id },
      },
      allow_promotion_codes: true,
    });

    if (!checkoutSession.url) {
      throw new Error("STRIPE_CHECKOUT_URL_MISSING");
    }

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message === "STRIPE_SECRET_KEY_MISSING" ||
      message === "STRIPE_PRICE_ID_MISSING"
    ) {
      return Response.json(
        { error: "Stripe 服务尚未完成配置。" },
        { status: 503 },
      );
    }

    console.error("Stripe Checkout error", error);
    return Response.json({ error: "暂时无法创建支付页面。" }, { status: 500 });
  }
}

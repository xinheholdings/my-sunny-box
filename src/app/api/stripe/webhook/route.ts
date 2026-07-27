import type Stripe from "stripe";
import { getPrismaClient } from "@/lib/prisma";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

function objectId(
  value:
    | string
    | { id: string }
    | null
    | undefined,
) {
  return typeof value === "string" ? value : value?.id ?? null;
}

async function activateSubscription(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.sunnyboxUserId || session.client_reference_id;
  const customerId = objectId(session.customer);
  const subscriptionId = objectId(session.subscription);

  if (!userId || !customerId || !subscriptionId || session.mode !== "subscription") {
    throw new Error("STRIPE_CHECKOUT_METADATA_MISSING");
  }

  await getPrismaClient().user.update({
    where: { id: userId },
    data: {
      plan: "PRO",
      subscriptionStatus: "ACTIVE",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
  });
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  const customerId = objectId(invoice.customer);
  if (!customerId) return;

  await getPrismaClient().user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      plan: "FREE",
      subscriptionStatus: "NONE",
    },
  });
}

async function cancelSubscription(subscription: Stripe.Subscription) {
  const customerId = objectId(subscription.customer);

  await getPrismaClient().user.updateMany({
    where: {
      OR: [
        { stripeSubscriptionId: subscription.id },
        ...(customerId ? [{ stripeCustomerId: customerId }] : []),
      ],
    },
    data: {
      plan: "FREE",
      subscriptionStatus: "CANCELED",
    },
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "缺少 Stripe 签名。" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      getStripeWebhookSecret(),
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return Response.json({ error: "Webhook 签名无效。" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await activateSubscription(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailure(event.data.object);
        break;
      case "customer.subscription.deleted":
        await cancelSubscription(event.data.object);
        break;
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error(`Stripe webhook processing failed (${event.type})`, error);
    return Response.json({ error: "Webhook 处理失败。" }, { status: 500 });
  }
}

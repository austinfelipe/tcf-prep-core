import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

// Use service role client for admin operations (bypasses RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getPeriodEnd(subscription: Stripe.Subscription): string | null {
  const item = subscription.items?.data?.[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000).toISOString();
  }
  return null;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id;
  if (!userId) return;

  const supabase = getAdminClient();
  const subscription = await getStripe().subscriptions.retrieve(
    session.subscription as string
  );

  await supabase
    .from('profiles')
    .update({
      is_pro: true,
      pro_until: getPeriodEnd(subscription),
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const sub = invoice.parent?.subscription_details?.subscription;
  const subscriptionId = typeof sub === 'string' ? sub : sub?.id;
  if (!subscriptionId) return;

  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  const supabase = getAdminClient();

  await supabase
    .from('profiles')
    .update({
      is_pro: true,
      pro_until: getPeriodEnd(subscription),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const supabase = getAdminClient();

  await supabase
    .from('profiles')
    .update({
      is_pro: false,
      pro_until: null,
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;
    case 'invoice.payment_succeeded':
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(
        event.data.object as Stripe.Subscription
      );
      break;
  }

  return NextResponse.json({ received: true });
}

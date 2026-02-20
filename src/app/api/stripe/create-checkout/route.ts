import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Authentification requise' },
      { status: 401 }
    );
  }

  // Check if already PRO
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro, stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (profile?.is_pro) {
    return NextResponse.json(
      { error: 'Vous êtes déjà PRO' },
      { status: 400 }
    );
  }

  // Reuse existing Stripe customer if available
  const customerParams: Record<string, string> = {};
  if (profile?.stripe_customer_id) {
    customerParams.customer = profile.stripe_customer_id;
  } else {
    customerParams.customer_email = user.email!;
  }

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    ...customerParams,
    metadata: {
      supabase_user_id: user.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro`,
  });

  return NextResponse.json({ url: session.url });
}

'use server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function createCheckoutSession(priceId: string): Promise<{ url?: string; error?: string }> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    })

    if (session.url) {
      return { url: session.url };
    } else {
      return { error: 'Failed to create checkout session' };
    }
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create checkout session' };
  }
}

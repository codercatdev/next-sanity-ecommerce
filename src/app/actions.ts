'use server'

import { createClient } from '@sanity/client'
import Stripe from 'stripe'
import { SanityCart } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const sanityClient = createClient({
  projectId: 'fpjavumg',
  dataset: 'production',
  apiVersion: '2025-09-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
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

export async function addToCart(productId: string, sessionId: string): Promise<{ error?: string }> {
  try {
    const cart = await sanityClient.fetch('*[_type == "cart" && sessionId == $sessionId][0]', { sessionId })

    if (cart) {
      const productIndex = cart.items.findIndex((item: { product: { _ref: string } }) => item.product._ref === productId)

      if (productIndex > -1) {
        await sanityClient
          .patch(cart._id)
          .inc({ [`items[${productIndex}].quantity`]: 1 })
          .commit()
      } else {
        await sanityClient
          .patch(cart._id)
          .append('items', [{ product: { _type: 'reference', _ref: productId }, quantity: 1 }])
          .commit()
      }
    } else {
      await sanityClient.create({
        _type: 'cart',
        sessionId,
        items: [{ product: { _type: 'reference', _ref: productId }, quantity: 1 }],
      })
    }

    return {}
  } catch (error) {
    console.error(error)
    return { error: 'Failed to add to cart' }
  }
}

export async function updateCartItemQuantity(cartId: string, itemId: string, quantity: number): Promise<{ error?: string }> {
  try {
    await sanityClient
      .patch(cartId)
      .set({ [`items[_key=="${itemId}"].quantity`]: quantity })
      .commit()
    return {}
  } catch (error) {
    console.error(error)
    return { error: 'Failed to update cart item quantity' }
  }
}

export async function removeCartItem(cartId: string, itemId: string): Promise<{ error?: string }> {
  try {
    await sanityClient
      .patch(cartId)
      .unset([`items[_key=="${itemId}"]`])
      .commit()
    return {}
  } catch (error) {
    console.error(error)
    return { error: 'Failed to remove cart item' }
  }
}

export async function getCart(sessionId: string): Promise<SanityCart | null> {
  try {
    const cart = await sanityClient.fetch(
      `*[_type == "cart" && sessionId == $sessionId][0]{
        ...,
        items[]{
          ...,
          product->{
            _id,
            name,
            description,
            "slug": slug.current,
            "price": default_price->.unit_amount,
            "image": images[0].asset->,
          }
        }
      }`,
      { sessionId }
    );
    return cart;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createCheckoutSessionFromCart(cartId: string): Promise<{ url?: string; error?: string }> {
  try {
    const cart = await sanityClient.fetch(
      `*[_type == "cart" && _id == $cartId][0]{
        items[]{
          quantity,
          product->{
            "priceId": default_price->.stripePriceId
          }
        }
      }`,
      { cartId }
    )

    if (!cart || !cart.items || cart.items.length === 0) {
      return { error: 'Cart is empty' }
    }

    const lineItems = cart.items.map((item: { product: { priceId: string }; quantity: number }) => ({
      price: item.product.priceId,
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
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

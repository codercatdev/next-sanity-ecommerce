'use client'

import { Suspense, useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getCart } from '@/lib/sanity.queries'
import { SanityCart } from '@/types'
import { CartItem } from '@/components/CartItem'
import { createCheckoutSessionFromCart } from '@/app/actions'
import { toast } from 'sonner'

function CartDetailsSkeleton() {
  return <div>Loading...</div>
}

function CartDetails() {
  const [cart, setCart] = useState<SanityCart | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    let sid = localStorage.getItem('sessionId')
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('sessionId', sid)
    }
    setSessionId(sid)
  }, [])

  useEffect(() => {
    if (sessionId) {
      getCart(sessionId).then((cart) => setCart(cart))
    }
  }, [sessionId])

  const handleCheckout = async () => {
    if (cart) {
      const result = await createCheckoutSessionFromCart(cart._id)
      if (result.error) {
        toast.error(result.error)
      } else if (result.url) {
        window.location.href = result.url
      }
    }
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div>Your cart is empty</div>
  }

  const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cart.items.map((item) => (
                <CartItem key={item._key} item={item} cartId={cart._id} />
              ))}
            </ul>
          </section>

          {/* Cart summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">${total / 100}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<CartDetailsSkeleton />}>
          <CartDetails />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

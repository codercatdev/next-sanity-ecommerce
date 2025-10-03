'use client'

import { createCheckoutSession } from '@/app/actions'
import { SanityProduct } from '@/types'
import { toast } from 'sonner'

export function AddToCartForm({ product }: { product: SanityProduct }) {
  const handleFormAction = async () => {
    if (product.priceId) {
      const result = await createCheckoutSession(product.priceId)
      if (result.error) {
        console.error(result.error)
        toast.error(result.error)
      } else if (result.url) {
        window.location.href = result.url
      }
    } else {
      toast.error('Product information is missing.')
    }
  }

  return (
    <form action={handleFormAction}>
      <button
        type="submit"
        className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add to bag
      </button>
    </form>
  )
}

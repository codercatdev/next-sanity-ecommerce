'use client'

import { addToCart } from '@/app/actions'
import { SanityProduct } from '@/types'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { useAuth, SignInButton } from '@clerk/nextjs'

export function AddToCart({ product }: { product: SanityProduct }) {
  const { userId, sessionId } = useAuth()

  const handleFormAction = async () => {
    if (product._id && sessionId) {
      const result = await addToCart(product._id, sessionId)
      if (result.error) {
        console.error(result.error)
        toast.error(result.error)
      } else {
        toast.success('Added to cart')
      }
    } else {
      toast.error('Product information is missing.')
    }
  }

  if (!userId) {
    return (
      <SignInButton mode="modal">
        <Button>Add to Cart</Button>
      </SignInButton>
    )
  }

  return (
    <form action={handleFormAction}>
      <Button
        type="submit"
      >
        Add to Cart
      </Button>
    </form>
  )
}

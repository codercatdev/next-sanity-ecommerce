'use client'

import { addToCart } from '@/app/actions'
import { SanityProduct } from '@/types'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'

export function AddToCart({ product }: { product: SanityProduct }) {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    let sid = localStorage.getItem('sessionId')
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('sessionId', sid)
    }
    setSessionId(sid)
  }, [])

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

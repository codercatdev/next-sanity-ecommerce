'use client'

import { SanityCart } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { updateCartItemQuantity, removeCartItem } from '@/app/actions'
import { useRouter } from 'next/navigation'

type CartItemProps = {
  item: SanityCart['items'][0];
  cartId: string;
}

export function CartItem({ item, cartId }: CartItemProps) {
  const router = useRouter()
  const handleQuantityChange = async (quantity: number) => {
    if (quantity === 0) {
      await handleRemoveItem()
      return
    }
    const result = await updateCartItemQuantity(cartId, item._key, quantity)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Quantity updated')
      router.refresh()
    }
  }

  const handleRemoveItem = async () => {
    const result = await removeCartItem(cartId, item._key)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Item removed')
      router.refresh()
    }
  }

  return (
    <li key={item._key} className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          src={item.product.image.url}
          alt={item.product.name}
          width={200}
          height={200}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <Link href={`/product/${item.product.slug}`} className="font-medium text-gray-700 hover:text-gray-800">
                  {item.product.name}
                </Link>
              </h3>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">${item.product.price / 100}</p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <label htmlFor={`quantity-${item._key}`} className="sr-only">
              Quantity, {item.product.name}
            </label>
            <input
              id={`quantity-${item._key}`}
              name={`quantity-${item._key}`}
              type="number"
              className="w-16 rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            />
            <button onClick={handleRemoveItem} className="text-red-500 ml-4">Remove</button>
          </div>
        </div>
      </div>
    </li>
  )
}

import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getProductBySlug } from '@/lib/sanity.queries'
import { SanityProduct } from '@/types'
import { createCheckoutSession } from '@/app/actions'
import { ProductImage } from '@/components/ProductImage'

async function ProductDetails({ slug }: { slug: string }) {
  const product: SanityProduct = await getProductBySlug(slug)

  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:gap-x-8 lg:px-8 flex">
          <div className='max-w-1/3'>
            <ProductImage product={product} />
          </div>
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="lg:col-span-2 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
              <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-b lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                {/* Description and details */}
                <div>
                  <h3 className="sr-only">Description</h3>

                  <div className="space-y-6">
                    <p className="text-base text-gray-900">{product.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">${product.price / 100}</p>

              <form action={async () => {
                'use server'
                if (product.stripeProductId && product.priceId) {
                  await createCheckoutSession(product.stripeProductId, product.priceId)
                }
              }}>
                <button
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to bag
                </button>
              </form>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductDetails slug={slug} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { ProductHero } from '@/components/ProductHero'
import { getFeaturedProducts } from '@/lib/sanity.queries'
import { FeaturedProduct } from '@/types'

async function FeaturedProducts() {
  const products = await getFeaturedProducts()
  return (
    <>
      <div>
        <ProductHero key={products.at(0)._id} product={products.at(0)} />
      </div>
      <div className="">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product: FeaturedProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <FeaturedProducts />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
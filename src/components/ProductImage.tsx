"use client"

import { SanityProduct } from '@/types'
import { sanityClient } from '@/lib/sanity';
import { useNextSanityImage } from 'next-sanity-image';
import Img from 'next/image';

export function ProductImage({ product }: { product: SanityProduct }) {
  const imageProps = useNextSanityImage(sanityClient, product.image, {
    imageBuilder: (builder, { width, quality }) => builder.width(width || 400).height(width || 400).fit('crop').crop('center').quality(quality || 80)
  });

  return (
    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-8">
      <Img
        {...imageProps}
        alt={product.name}
        style={{ width: '100%', height: 'auto' }} // layout="responsive" prior to Next 13.0.0
        sizes="(max-width: 1200px) 100vw, 1200px"
        placeholder="blur"
        blurDataURL={product.image.metadata.lqip}
      />
    </div>
  )
}

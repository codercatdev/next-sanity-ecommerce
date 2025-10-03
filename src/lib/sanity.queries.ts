import { createClient, } from '@sanity/client';

const client = createClient({
  projectId: 'fpjavumg',
  dataset: 'production',
  apiVersion: '2025-09-30',
  useCdn: true,
})

export async function getProducts() {
  return client.fetch(
    `*[_type == "product"]{
      _id,
      name,
      description,
      "slug": slug.current,
      "price": default_price->.unit_amount,
      "image": images[0].asset->,
    }`,
    {},
    {
      next: {
        tags: ['products'],
      },
    }
  )
}

export async function getProductBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      description,
      "slug": slug.current,
      "price": default_price->.unit_amount,
      "image": images[0].asset->,
      "priceId": default_price->.stripePriceId,
    }
    `,
    { slug },
    {
      next: {
        tags: [`product_${slug}`],
      },
    }
  )
}

export async function getFeaturedProducts() {
  return client.fetch(
    `*[_type == "product"] | order(_createdAt asc)[0...8]{
  _id,
  name,
  "slug": slug.current,
  "price": default_price->.unit_amount,
  "image": images[0].asset->,
}`,
    {},
    {
      next: {
        tags: ['products', 'featured-products'],
      },
    }
  )
}

export async function getCart(sessionId: string) {
  return client.fetch(
    `*[_type == "cart" && sessionId == $sessionId][0]{
      _id,
      items[]{
        _key,
        quantity,
        product->{
          _id,
          name,
          "slug": slug.current,
          "price": default_price->.unit_amount,
          "image": images[0].asset->,
          "priceId": default_price->.stripePriceId
        }
      }
    }`,
    { sessionId },
    {
      cache: 'no-store',
    }
  )
}

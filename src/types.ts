export interface SanityProduct {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description: string;
  image: {
    metadata: {
      lqip: string;
    },
    url: string;
  };
  price: number;
  priceId: string;
  stripeProductId: string;
  featured: boolean;
}

export interface FeaturedProduct {
  _id: string;
  image: {
    metadata: {
      lqip: string;
    },
    url: string;
  };
  name: string;
  price: number;
  slug: string;
}
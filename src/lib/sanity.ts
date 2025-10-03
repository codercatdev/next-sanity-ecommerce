import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'fpjavumg',
  dataset: 'production',
  apiVersion: '2024-03-14',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

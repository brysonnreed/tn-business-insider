import { createClient } from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_WEBHOOK_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

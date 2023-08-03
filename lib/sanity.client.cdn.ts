import imageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_WEBHOOK_TOKEN

export const getClient = () => {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token,
  })
}

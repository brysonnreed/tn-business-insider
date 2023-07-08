import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET // "production"
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION // "2022-15-16"

export const getClient = () => {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  })
}

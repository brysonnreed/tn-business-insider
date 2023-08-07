import { createClient } from 'next-sanity'

import { getClient } from './sanity.client.cdn'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
export const token = process.env.NEXT_PUBLIC_SANITY_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: token,
  useCdn: true,
})

export const uploadImageToSanity = async (file) => {
  try {
    // Upload the image asset to Sanity
    const imageAsset = await client.assets.upload('image', file, {
      filename: file.name,
    })

    // Return the image asset ID or URL, or any other data you need
    return imageAsset._id // or return imageAsset.url; if you want the URL
  } catch (error) {
    console.error('Error uploading image asset: ', error)
    throw error
  }
}

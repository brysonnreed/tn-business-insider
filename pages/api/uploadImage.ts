import sanityClient from '@sanity/client'
import { getClient } from 'lib/sanity.client.cdn'
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WEBHOOK_TOKEN

const client = createClient({
  projectId,
  dataset,
  token, // Optional, if your dataset requires authentication
  useCdn: true, // Set this to true if you want to use the CDN
})

export default async function handleImageUpload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      console.log('uploadImage API is hit')
      const { file } = req.body

      // Upload the image to Sanity
      // const result = await client.assets.upload('image', file)
      // const assetId = result._id

      return res.status(200).json({ asset: { _id: file } })
    } catch (error) {
      console.error('Error uploading image: ', error)
      return res.status(500).json({ error: 'Failed to upload the image' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

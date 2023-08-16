import axios from 'axios'
import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.NEXT_PUBLIC_SANITY_TOKEN

export const getClient = () => {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token,
  })
}

export const uploadImageToSanity = async (file) => {
  try {
    const client = getClient()
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

const generateRandomFilename = () => {
  const randomString = Math.random().toString(36).substring(2, 15)
  return `${randomString}-${Date.now()}.jpg`
}

export const uploadImageUrlToSanity = async (imageUrl) => {
  try {
    const client = getClient()

    // Fetch the image from the provided URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const imageBuffer = response.data
    const filename = generateRandomFilename()
    // Upload the image asset to Sanity
    const imageAsset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
    })

    // Return the image asset ID or URL, or any other data you need
    return imageAsset._id // or return imageAsset.url; if you want the URL
  } catch (error) {
    console.error('Error uploading image asset: ', error)
    throw error
  }
}

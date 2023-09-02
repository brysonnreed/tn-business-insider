import { getClient } from './sanity.client.cdn'

const client = getClient()

export const uploadImageToSanity = async (file) => {
  try {
    // Upload the image asset to Sanity
    const imageAsset = await client.assets.upload('image', file, {
      filename: file.name,
    })

    // Return the image asset ID or URL, or any other data you need
    return imageAsset // or return imageAsset.url; if you want the URL
  } catch (error) {
    console.error('Error uploading image asset: ', error)
    throw error
  }
}

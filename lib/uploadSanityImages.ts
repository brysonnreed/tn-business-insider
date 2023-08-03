import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_WEBHOOK_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token:
    'skaFVIkPxxGQ0CqSc9s9g8r7LfahwBUHsqs728VUyrgicKW5pC5eYvLaUx2gtSp4bCoH3DbK8HlwZfrT8xBY3aGCEMDRZrjyTHCLXrXUNZOGZdOEAwboY3QIatCOjTGO3mcZ6wv1awSfbdVwbWEDgwmAcQwSEeR43tn3obnsfrF8eqvaJyXX',
  useCdn: true,
})

export const uploadImageToSanity = async (file) => {
  try {
    // Upload the image asset to Sanity
    const imageAsset = await client.assets.upload('image', file, {
      filename: file.name,
    })

    // If you want to link the uploaded image asset to a specific field in a document,
    // you can do that here. For example:
    // return client
    //   .patch('some-document-id')
    //   .set({
    //     theImageField: {
    //       _type: 'image',
    //       asset: {
    //         _type: 'reference',
    //         _ref: imageAsset._id
    //       }
    //     }
    //   })
    //   .commit();

    // Return the image asset ID or URL, or any other data you need
    return imageAsset._id // or return imageAsset.url; if you want the URL
  } catch (error) {
    console.error('Error uploading image asset: ', error)
    throw error
  }
}

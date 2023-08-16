import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

import { getClient } from '../../lib/sanity.client.cdn'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log(JSON.parse(req.body))
    const { businessId, changes, logo, images, removedImages, oldImage } =
      JSON.parse(req.body)
    // Fetch user based on email from Sanity

    const client = getClient()

    const updateFields = {}

    if (changes.name) {
      let slug = slugify(changes.name, { lower: true })
      const existingSlug = await client.fetch(
        `*[_type == "businessProfile" && slug.current == $slug][0]`,
        { slug }
      )

      // If slug exists, append a random number
      if (existingSlug) {
        slug = `${slug}-${Math.floor(Math.random() * 10000)}` // append a random number between 0-9999
      }
      updateFields.name = changes.name
      updateFields.slug = slug
    }
    if (logo) {
      updateFields.logo = logo
    }
    if (changes.description) {
      updateFields.description = changes.description
    }
    if (changes.address) {
      updateFields.address = changes.address
    }
    if (changes.city) {
      const cityDoc = await client.fetch(
        `*[_type == "city" && name == $city][0]._id`,
        { city: changes.city }
      )
      updateFields.city = cityDoc
    }
    if (changes.category) {
      const categoryDoc = await client.fetch(
        `*[_type == "businessProfileCategory" && name == $category][0]._id`,
        { category: changes.category }
      )
      updateFields.category = categoryDoc
    }
    if (changes.services) {
      updateFields.services = changes.services
    }
    if (changes.amenities) {
      updateFields.amenities = changes.amenities
    }
    if (changes.website) {
      updateFields.website = changes.website
    }
    if (changes.hours) {
      updateFields.hours = Object.keys(changes.hours).reduce((prev, day) => {
        return {
          ...prev,
          [day.toLowerCase()]: {
            _type: 'object',
            isOpen: changes.hours[day].isOpen,
            hours: changes.hours[day].isOpen
              ? {
                  _type: 'object',
                  open: changes.hours[day]?.open,
                  close: changes.hours[day]?.close,
                }
              : {
                  _type: 'object',
                  open: '',
                  close: '',
                },
          },
        }
      }, {})
    }

    if (images) {
      // Generate a unique key for each image object
      const imagesWithKeys = images.map((image) => ({
        _type: 'image',
        _key: uuidv4(), // Generate a unique key for each image object
        asset: { _type: 'reference', _ref: image },
      }))
      updateFields.images = imagesWithKeys
    }
    if (changes.socialMedia) {
      const platformDocs = await Promise.all(
        changes.socialMedia.map(async (changes) => {
          const platformDoc = await client.fetch(
            `*[_type == "socialMediaPlatform" && platform == $platform][0]._id`,
            { platform: changes.platform }
          )
          return platformDoc
        })
      )

      // Map socialMedia data to objects with _type and _ref properties
      const socialMediaRefs = changes.socialMedia.map((changes, index) => ({
        platform: { _type: 'reference', _ref: platformDocs[index] },
        url: changes.url,
        _key: uuidv4(),
      }))

      updateFields.socialMedia = socialMediaRefs
      console.log(socialMediaRefs)
    }

    if (Object.keys(updateFields).length > 0) {
      // Update specific fields of business in Sanity
      const patch = client.patch(businessId).set({
        name: updateFields.name,
        slug: updateFields.slug,
        description: updateFields.description,
        address: updateFields.address,
        services: updateFields.services,
        amenities: updateFields.amenities,
        website: updateFields.website,
        hours: updateFields.hours,
        socialMedia: updateFields.socialMedia,
      })

      if (updateFields.logo) {
        patch.set({
          logo: {
            _type: 'image',
            asset: { _type: 'reference', _ref: updateFields.logo },
          },
        })
      }
      if (updateFields.images) {
        patch.set({
          images: updateFields.images,
        })
      }
      if (updateFields.city) {
        patch.set({
          city: { _type: 'reference', _ref: updateFields.city },
        })
      }
      if (updateFields.category) {
        patch.set({
          category: { _type: 'reference', _ref: updateFields.category },
        })
      }
      await patch.commit()
    }

    if (removedImages && removedImages.length) {
      for (const assetId of removedImages) {
        console.log('assetId: ', assetId)
        // Check if the asset has any references
        const assetReferences = await client.fetch(`*[references($assetId)]`, {
          assetId,
        })

        console.log('assetReferences: ', assetReferences)

        if (assetReferences.length === 0) {
          // Delete the asset if it's not referenced by any document
          await client.delete(assetId)
        }
      }
    }
    if (logo && oldImage && oldImage.asset && oldImage.asset._ref) {
      const assetId = oldImage.asset._ref

      // Check if the asset has any references
      // const assetReferences = asset.refs || []
      const assetReferences = await client.fetch(`*[references($assetId)]`, {
        assetId,
      })

      if (assetReferences.length === 0) {
        // Delete the asset if it's not referenced by any document
        await client.delete(assetId)
      }
    }

    return res.status(200).json({ message: 'Business updated successfully' })
  } catch (error) {
    console.error('Error updating Business information:', error)
    return res.status(500).json({
      message: 'An error occurred while updating business information',
    })
  }
}

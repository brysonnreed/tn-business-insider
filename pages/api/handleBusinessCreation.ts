import { getClient } from 'lib/sanity.client.cdn'
import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'

const client = getClient()

export default async function createBusinessProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('JSON.parse(req.body): ', JSON.parse(req.body))
  const {
    name,
    logo,
    city,
    description,
    category,
    services,
    images,
    amenities,
    address,
    openAllDay,
    hours,
    website,
  } = JSON.parse(req.body)
  // Generate slug from name
  let slug = slugify(name, { lower: true })

  try {
    // Check if slug already exists
    const existingSlug = await client.fetch(
      `*[_type == "businessProfile" && slug.current == $slug][0]`,
      { slug }
    )

    // If slug exists, append a random number
    if (existingSlug) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}` // append a random number between 0-9999
    }
    // Fetch the city _id using the city name
    const cityDoc = await client.fetch(
      `*[_type == "city" && name == $city][0]._id`,
      { city }
    )

    // Fetch the category _id using the category name
    const categoryDoc = await client.fetch(
      `*[_type == "businessProfileCategory" && name == $category][0]._id`,
      { category }
    )

    // If city or category not found, return error
    if (!cityDoc || !categoryDoc) {
      return res.status(400).json({
        message: `Couldn't find city or category with provided names`,
      })
    }

    // 1. Create Assets
    const logoAssetPromise = client.assets.upload('image', logo[0])
    const imagesAssetsPromise = images.map((image) =>
      client.assets.upload('image', image)
    )

    // 2. Resolve Promises
    const [logoAsset, ...imagesAssets] = await Promise.all([
      logoAssetPromise,
      ...imagesAssetsPromise,
    ])

    await client.create({
      _type: 'businessProfile',
      name,
      slug: { _type: 'slug', current: slug },
      logo: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: logoAsset._id,
        },
      },
      city: { _type: 'reference', _ref: cityDoc },
      description,
      category: { _type: 'reference', _ref: categoryDoc },
      services,
      images: imagesAssets.map((imgAsset) => ({
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imgAsset._id,
        },
      })),
      amenities,
      address: {
        _type: 'address',
        ...address,
      },
      openAllDay,
      hours: {
        _type: 'hours',
        ...Object.keys(hours).reduce((prev, day) => {
          return {
            ...prev,
            [day.toLowerCase()]: {
              // Make sure day matches schema (lowercase)
              _type: 'object',
              isOpen: hours[day].isOpen,
              hours: hours[day].isOpen
                ? {
                    _type: 'object',
                    open: hours[day].open,
                    close: hours[day].close,
                  }
                : undefined,
            },
          }
        }, {}),
      },
      website,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Couldn&apos;t submit business profile', error })
  }

  res.status(200).json({ message: 'Business Profile Submitted' })
}

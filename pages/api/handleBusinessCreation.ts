import { getClient } from 'lib/sanity.client.cdn'
import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

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
    socialMedia,
    user,
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

    // Generate a unique key for each image object
    const imagesWithKeys = images.map((image) => ({
      _type: 'image',
      _key: uuidv4(), // Generate a unique key for each image object
      asset: { _type: 'reference', _ref: image },
    }))

    // Fetch the socialMediaPlatform documents based on platform names
    const platformDocs = await Promise.all(
      socialMedia.map(async (data) => {
        const platformDoc = await client.fetch(
          `*[_type == "socialMediaPlatform" && platform == $platform][0]._id`,
          { platform: data.platform }
        )
        return platformDoc
      })
    )

    // Map socialMedia data to objects with _type and _ref properties
    const socialMediaRefs = socialMedia.map((data, index) => ({
      platform: { _type: 'reference', _ref: platformDocs[index] },
      url: data.url,
      _key: uuidv4(),
    }))

    const businessProfile = await client.create({
      _type: 'businessProfile',
      name,
      slug: { _type: 'slug', current: slug },
      logo: {
        _type: 'image',
        asset: { _type: 'reference', _ref: logo },
      },
      city: { _type: 'reference', _ref: cityDoc },
      description,
      category: { _type: 'reference', _ref: categoryDoc },
      services,
      images: imagesWithKeys,
      amenities,
      address: {
        _type: 'address',
        ...address,
      },
      openAllDay,
      socialMedia: socialMediaRefs,
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

    const matchedUser = await client.fetch(
      '*[_type == "users" && email == $email][0]',
      {
        email: user,
      }
    )

    // Step 5: Handle the case when the user is not found
    if (!matchedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const businessProfileId = businessProfile._id

    await client
      .patch(matchedUser._id)
      .append('businesses', [
        { _type: 'reference', _ref: businessProfileId, _key: uuidv4() },
      ])
      .commit()
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Couldn&apos;t submit business profile', error })
  }

  res.status(200).json({ message: 'Business Profile Submitted' })
}

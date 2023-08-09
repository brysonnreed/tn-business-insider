import argon2 from 'argon2'

import { getClient } from '../../../lib/sanity.client.cdn'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, data } = req.body

    // Fetch user based on email from Sanity
    const client = getClient()
    const user = await client.fetch(
      '*[_type == "user" && email == $email][0]',
      { email }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    let name = ''
    let password = ''
    let image = ''
    let oldImage = ''
    // Check if any changes were made before updating
    const updateFields = {}
    // Update user information if provided
    if (data.name && data.name !== user.name) {
      name = data.name
    }

    if (data.logo) {
      image = data.logo
      if (user.mainImage) {
        oldImage = user.mainImage
      }
      updateFields.mainImage = image._id
    }

    if (data.password) {
      const hashedPassword = await argon2.hash(data.password)
      password = hashedPassword
    }

    if (user.name !== data.name) {
      updateFields.name = name
    }
    if (user.image !== image.url) {
      updateFields.image = image.url
    }
    if (data.password) {
      updateFields.password = user.password
    }

    if (Object.keys(updateFields).length > 0) {
      // Update specific fields of user in Sanity
      await client
        .patch(user._id)
        .set({
          name: updateFields.name,
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: updateFields.mainImage },
          },
          image: updateFields.image,
          password: updateFields.password,
        })
        .commit()
    }

    return res
      .status(200)
      .json({ message: 'User information updated successfully' })
  } catch (error) {
    console.error('Error updating user information:', error)
    return res
      .status(500)
      .json({ message: 'An error occurred while updating user information' })
  }
}

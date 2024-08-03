import argon2 from 'argon2'
import { getClient } from 'lib/sanity/sanity.client.cdn'

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
    if (user.mainImage) {
      oldImage = user.mainImage
    }
    // Check if any changes were made before updating
    const updateFields = {}
    // Update user information if provided
    if (data.name && data.name !== user.name) {
      name = data.name
    }

    if (data.logo) {
      const results = await client.fetch(`*[_id == "${data.logo}"]{url}`)
      const assetURL = results[0]?.url
      image = assetURL

      updateFields.mainImage = data.logo
    }

    if (data.password) {
      const hashedPassword = await argon2.hash(data.password)
      password = hashedPassword
    }

    if (user.name !== data.name) {
      updateFields.name = name
    }
    if (user.image !== image) {
      updateFields.image = image
    }
    if (data.password) {
      updateFields.password = user.password
    }

    if (Object.keys(updateFields).length > 0) {
      // Update specific fields of user in Sanity
      const patch = client.patch(user._id).set({
        name: updateFields.name,
      })

      if (updateFields.mainImage) {
        patch.set({
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: updateFields.mainImage },
          },
        })
      }
      if (updateFields.image) {
        patch.set({
          image: updateFields.image,
        })
      }
      if (updateFields.password) {
        patch.set({
          password: updateFields.password,
        })
      }

      await patch.commit()
    }
    // TODO: make sure it deletes image
    if (data.logo && oldImage && oldImage.asset && oldImage.asset._ref) {
      const assetId = oldImage.asset._ref

      // Check if the asset has any references
      // const assetReferences = asset.refs || []
      const assetReferences = await client.fetch(`*[references($assetId)]`, {
        assetId,
      })

      if (assetReferences.length === 0) {
        // Delete the asset if it's not referenced by any document
        if (
          assetId !==
          'image-08232b0e5971e6f5a4e7a6fe2f8bdd6dd472f7e7-150x151-png'
        ) {
          await client.delete(assetId)
        }
      }
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

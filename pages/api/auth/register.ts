import { hash } from 'argon2'
import { getClient, uploadImageUrlToSanity } from 'lib/sanity.client.cdn'
import { NextApiHandler } from 'next'

const client = getClient()

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, password } = req.body
    try {
      const hashedPassword = await hash(password)

      const blankUser =
        'image-08232b0e5971e6f5a4e7a6fe2f8bdd6dd472f7e7-150x151-png'
      // Call the Sanity client function to create the user with the password
      const newUser = await client.create({
        _type: 'user', // Use the name of your Sanity schema for users
        name,
        email,
        password: hashedPassword, // Save the password to Sanity
        admin: false,
        image:
          'https://cdn.sanity.io/images/yuy7c73l/production/08232b0e5971e6f5a4e7a6fe2f8bdd6dd472f7e7-150x151.png',
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: blankUser },
        },
      })

      // Send a success response
      return res.status(200).json({ success: true, user: newUser })
    } catch (error) {
      // Handle any errors during user creation
      console.error('Error creating user:', error)
      return res.status(500).json({ error: 'Error creating user' })
    }
  } else {
    // Return an error for other HTTP methods
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

export default handler

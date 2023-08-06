import { hash } from 'argon2'
import { getClient } from 'lib/sanity.client.cdn'
import { NextApiHandler } from 'next'

const client = getClient()

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, password } = req.body
    try {
      const hashedPassword = await hash(password)

      // Call the Sanity client function to create the user with the password
      const newUser = await client.create({
        _type: 'user', // Use the name of your Sanity schema for users
        name,
        email,
        password: hashedPassword, // Save the password to Sanity
        // Add other fields as needed (e.g., isAdmin, etc.)
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

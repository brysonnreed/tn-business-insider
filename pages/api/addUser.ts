import { getClient } from 'lib/sanity.client.cdn'
import { NextApiRequest, NextApiResponse } from 'next'

const client = getClient()

export default async function addUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Retrieve the user information from the request headers
    const { name, email, image } = req.body

    // Check if the user already exists in Sanity
    const existingUser = await client.fetch(
      '*[_type == "user" && email == $email]',
      {
        email: email,
      }
    )

    if (existingUser.length === 0) {
      // User does not exist, create a new user document in Sanity
      await client.create({
        _type: 'user',
        name: name,
        email: email,
        image: image,
        // Add any other relevant user information here
      })
    }

    // Return a success response
    res.status(200).json({ message: 'User added/updated successfully' })
  } catch (error) {
    // Handle any errors
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}

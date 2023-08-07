import { hash } from 'argon2'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
export const token = process.env.NEXT_PUBLIC_SANITY_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: token,
  useCdn: false,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, token, password } = req.body

  try {
    const existingUser = await client.fetch(
      '*[_type == "user" && email == $email]',
      {
        email: email,
      }
    )

    if (existingUser.length === 0) {
      // If the user doesn't exist, return an error
      return res.status(404).json({ error: 'User not found' })
    }
    const user = existingUser[0]
    // Hash the new password
    const hashedPassword = await hash(password)

    // Update the user's password and clear the resetToken
    await client
      .patch(user._id)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      })
      .commit()

    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error updating password' })
  }
}

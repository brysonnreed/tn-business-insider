import { getClient } from 'lib/sanity.client.cdn'

const client = getClient()

export async function handleSignIn(user) {
  try {
    const name = user.user.name
    const email = user.user.email
    const image = user.user.image
    // Check if the user is signing in with Google
    // Check if the user is signing in with Google
    if (user.account.provider === 'google') {
      // Check if the user's email exists in your Sanity database
      const existingUser = await client.fetch(
        '*[_type == "user" && email == $email]',
        {
          email: user.user.email,
        }
      )

      // If the user doesn't exist, create a new user in your Sanity database
      if (!existingUser || existingUser.length === 0) {
        try {
          await client.create({
            _type: 'user',
            name: name,
            email: email,
            image: image,
            // Add any other relevant user information here
          })
        } catch (error) {
          console.error(error)
        }
      }
    }

    return true // Allow sign-in
  } catch (error) {
    console.error(error)
    return false
  }
}

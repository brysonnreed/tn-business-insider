import { getClient } from 'lib/sanity.client.cdn'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import React from 'react'

function BusinessId() {
  return <div>BusinessId</div>
}

export default BusinessId

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions)
  // const session = await getSession({ req })

  if (!session) {
    // If the session is not active, redirect to the login page with a callback URL
    const currentUrl = req.url
    const loginUrl = `/account/login?callbackUrl=${encodeURIComponent(
      currentUrl
    )}&protectedPageCallback=true`

    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    }
  }
  const client = getClient()

  try {
    const userEmail = session.user?.email
    // Fetch the user document based on the email
    let user = await client.fetch('*[_type == "user" && email == $email][0]', {
      email: userEmail,
    })

    return {
      props: {},
    }
  } catch (error) {
    console.error(error)
    return {
      props: {},
    }
  }
}

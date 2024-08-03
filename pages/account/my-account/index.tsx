import LikedPosts from 'components/Features/User/MyAccount/LikedPosts'
import MyReviews from 'components/Features/User/MyAccount/MyReviews'
import OwnedBusinesses from 'components/Features/User/MyAccount/OwnedBusinesses'
import UpdateProfileInformation from 'components/Features/User/MyAccount/UpdateProfileInformation'
import UserDetails from 'components/Features/User/MyAccount/UserDetails'
import { getClient } from 'lib/sanity/sanity.client'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useState } from 'react'

function MyAccount({ businesses, user, posts }) {
  const router = useRouter()

  // Use the page query as the initial state or default to 'dashboard'
  const [showPage, setShowPage] = useState(router.query.showPage || 'profile')
  return (
    <section className="mx-auto min-h-[80vh] max-w-5xl  pt-10 sm:flex">
      <UserDetails user={user} setShowPage={setShowPage} showPage={showPage} />

      <div className="boxContainer">
        <div className="">
          {showPage == 'profile' && <UpdateProfileInformation user={user} />}
          {showPage == 'businesses' && (
            <div
              className={`${
                businesses.length > 4 &&
                'max-h-[70vh] min-h-[50vh] overflow-y-scroll'
              } px-2 scrollbar scrollbar-track-gray-100 scrollbar-thumb-slate-300`}
            >
              <OwnedBusinesses businesses={businesses} />
            </div>
          )}
          {showPage == 'posts' && (
            <div
              className={`${
                posts &&
                posts.length > 4 &&
                'max-h-[70vh] min-h-[50vh] overflow-y-scroll'
              } px-2 scrollbar scrollbar-track-gray-100 scrollbar-thumb-slate-300`}
            >
              <LikedPosts posts={posts} />
            </div>
          )}
          {showPage == 'reviews' && <MyReviews />}
        </div>
      </div>
    </section>
  )
}

export default MyAccount

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions)

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

  const userEmail = session.user?.email
  let user = await client.fetch(
    '*[_type == "user" && email == $email][0]{image, _createdAt, _type, name, _id, mainImage, _rev, email, businesses, likedBlogPosts}',
    {
      email: userEmail,
    }
  )

  try {
    // Fetch the user document based on the email

    // Extract the business references from the user document
    const businessReferences = user.businesses.map((business) => business._ref)

    // Fetch the business profiles based on the references
    const businesses = await client.fetch(
      '*[_type == "businessProfile" && _id in $businessReferences]',
      {
        businessReferences,
      }
    )

    // Fetch the blog posts referenced in the likedBlogPosts field
    const likedPostReferences = user.likedBlogPosts.map((post) => post._ref)
    const posts = await client.fetch(
      '*[_type == "post" && _id in $likedPostReferences] | order(_createdAt asc)',
      {
        likedPostReferences,
      }
    )

    return {
      props: {
        businesses,
        user,
        posts,
      },
    }
  } catch (error) {
    // Handle any errors
    console.error(error)
    return {
      props: {
        businesses: [],
        user,
        post: [],
      },
    }
  }
}

import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BlogContainer from 'components/Blog/BlogContainer'
import Footer from 'components/Footer'
import Header from 'components/Header'
import LikedPosts from 'components/User/MyAccount/LikedPosts'
import OwnedBusinesses from 'components/User/MyAccount/OwnedBusinesses'
import UpdateProfileInformation from 'components/User/MyAccount/UpdateProfileInformation'
import UserDetails from 'components/User/MyAccount/UserDetails'
import { AnimatePresence, motion } from 'framer-motion'
import { getClient } from 'lib/sanity.client'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useState } from 'react'

function MyAccount({ businesses, user, posts }) {
  const [showPage, setShowPage] = useState('profile')
  return (
    <>
      <Header />

      <section className="mx-auto min-h-[80vh] max-w-5xl  pt-10 sm:flex">
        <UserDetails
          user={user}
          setShowPage={setShowPage}
          showPage={showPage}
        />

        <BlogContainer>
          <div className="">
            {showPage == 'profile' && <UpdateProfileInformation user={user} />}
            <div className="max-h-[79vh] overflow-y-scroll scrollbar scrollbar-track-gray-100 scrollbar-thumb-slate-300">
              {showPage == 'businesses' && (
                <OwnedBusinesses businesses={businesses} />
              )}
            </div>
            <div className="max-h-[79vh] overflow-y-scroll scrollbar scrollbar-track-gray-100 scrollbar-thumb-slate-300">
              {showPage == 'posts' && <LikedPosts posts={posts} />}
            </div>
          </div>
        </BlogContainer>
      </section>
      <Footer />
    </>
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
  let user = await client.fetch('*[_type == "user" && email == $email][0]', {
    email: userEmail,
  })
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

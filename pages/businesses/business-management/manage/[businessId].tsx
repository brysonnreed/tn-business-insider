import BusinessDashboard from 'components/Features/BusinessProfile/EditBusiness/BusinessDashboard'
import BusinessDetails from 'components/Features/BusinessProfile/EditBusiness/BusinessDetails'
import BusinessEmail from 'components/Features/BusinessProfile/EditBusiness/BusinessEmail'
import BusinessSubscription from 'components/Features/BusinessProfile/EditBusiness/BusinessSubscription'
import EditBusiness from 'components/Features/User/EditBusiness'
import {
  getAllBusinessProfileCategories,
  getAllCities,
  getSocialMedias,
} from 'lib/sanity/sanity.client'
import { getClient } from 'lib/sanity/sanity.client'
import { businessProfileFields } from 'lib/sanity/sanity.queries'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useState } from 'react'

function BusinessId({ businessProfile, cities, categories, socials }) {
  const router = useRouter()

  // Use the page query as the initial state or default to 'dashboard'
  const [showPage, setShowPage] = useState(router.query.showPage || 'dashboard')

  return (
    <section className="mx-auto min-h-[80vh] max-w-5xl pt-10 sm:flex">
      <BusinessDetails
        business={businessProfile}
        setShowPage={setShowPage}
        showPage={showPage}
      />
      <div className="boxContainer min-h-[80vh]">
        {showPage == 'dashboard' && (
          <BusinessDashboard business={businessProfile} />
        )}

        {showPage == 'update' && (
          <EditBusiness
            business={businessProfile}
            socials={socials}
            categories={categories}
            cities={cities}
          />
        )}
        {showPage == 'subscription' && <BusinessSubscription />}
        {showPage == 'email' && <BusinessEmail business={businessProfile} />}
      </div>
    </section>
  )
}

export default BusinessId

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  const businessId = context.query.businessId

  if (!session) {
    // If the session is not active, redirect to the login page with a callback URL
    const currentUrl = context.req.url
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
  // Fetch the user document based on the email
  let user
  try {
    const user = await client.fetch(
      '*[_type == "user" && email == $email][0]',
      {
        email: userEmail,
      }
    )

    // Check if the user owns the requested business
    const ownsBusiness = user.businesses.some(
      (business) => business._ref === businessId
    )

    if (!ownsBusiness) {
      // Redirect to business-management with a query parameter indicating no ownership
      const redirectUrl = `/businesses/business-management?ownership=false`
      return {
        redirect: {
          destination: redirectUrl,
          permanent: false,
        },
      }
    }

    // Fetch the business profile based on the businessId
    const businessProfile = await client.fetch(
      `*[_type == "businessProfile" && _id == $businessId][0]{${businessProfileFields}}`,
      {
        businessId,
      }
    )

    const cities = await getAllCities(client)
    const categories = await getAllBusinessProfileCategories(client)
    const socials = await getSocialMedias(client)

    return {
      props: { user, businessProfile, cities, categories, socials },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        user,
        businessProfile: [],
        cities: [],
        categories: [],
        socials: [],
      },
    }
  }
}

import CreateBusiness from 'components/Features/User/CreateBusiness'
import {
  getAllBusinessProfileCategories,
  getAllCities,
  getSocialMedias,
} from 'lib/sanity/sanity.client'
import { getClient } from 'lib/sanity/sanity.client'
import { getServerSession } from 'next-auth'

import { authOptions } from '../../../api/auth/[...nextauth]'

const BusinessManagementAddForm = ({ cities, categories, socials, user }) => {
  return (
    <>
      <section className="boxSection">
        <div className="boxContainer">
          <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
            <h1 className="text-2xl font-semibold text-orange-500 sm:text-3xl">
              Interested in growing your business?
            </h1>
            <p className="text-5xl font-bold capitalize text-black sm:text-6xl">
              Add your Business here
            </p>
          </div>
          <div className="pt-5">
            <CreateBusiness
              cities={cities}
              categories={categories}
              socials={socials}
              user={user}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default BusinessManagementAddForm

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    // If the session is not active, redirect to the login page with a callback URL
    const currentUrl = '/businesses/business-management/add'
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

  try {
    const cities = await getAllCities(client)
    const categories = await getAllBusinessProfileCategories(client)
    const socials = await getSocialMedias(client)

    const user = await client.fetch(
      '*[_type == "user" && email == $email][0]',
      {
        email: userEmail,
      }
    )

    return {
      props: {
        cities,
        categories,
        socials,
        user,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        cities: [],
        categories: [],
        socials: [],
      },
    }
  }
}

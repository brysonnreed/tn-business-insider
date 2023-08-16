import BlogContainer from 'components/Blog/BlogContainer'
import Footer from 'components/Footer'
import Header from 'components/Header'
import CreateBusiness from 'components/User/CreateBusiness'
import {
  getAllBusinessProfileCategories,
  getAllCities,
  getSocialMedias,
} from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import { getServerSession } from 'next-auth'

import { authOptions } from '../../../api/auth/[...nextauth]'

const BusinessManagementAddForm = ({ cities, categories, socials }) => {
  return (
    <>
      <Header />
      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
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
            />
          </div>
        </BlogContainer>
      </section>
      <Footer />
    </>
  )
}

export default BusinessManagementAddForm

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

  try {
    const cities = await getAllCities(client)
    const categories = await getAllBusinessProfileCategories(client)
    const socials = await getSocialMedias(client)

    return {
      props: {
        cities,
        categories,
        socials,
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

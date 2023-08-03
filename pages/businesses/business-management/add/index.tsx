import BlogContainer from 'components/Blog/BlogContainer'
import Header from 'components/Header'
import CreateBusiness from 'components/User/CreateBusiness'
import {
  getAllBusinessProfileCategories,
  getAllCities,
  getSocialMedias,
} from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import { getSession, useSession } from 'next-auth/react'

const BusinessManagementAddForm = ({ cities, categories, socials }) => {
  return (
    <>
      <Header />
      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
            <p className="text-2xl font-semibold text-orange-500 sm:text-3xl">
              Interested in growing your business?
            </p>
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
    </>
  )
}

export default BusinessManagementAddForm

export async function getServerSideProps(req) {
  const session = await getSession({ req })

  if (!session) {
    // If the session is not active, redirect to the login page
    return {
      redirect: {
        destination: '/login',
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

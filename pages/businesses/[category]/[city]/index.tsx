import Button from 'components/Common/Button'
import BusinessProfileItem from 'components/Features/BusinessProfile/BusinessProfileItem'
import CategorizedBusinessesMeta from 'components/Pages/Businesses/CategorizedBusinesses/CategorizedBusinessesMeta'
import FeaturedBlogPosts from 'components/UI/FeaturedBlogPosts'
import {
  getAllBusinessProfileCategories,
  getAllCities,
  getAllPosts,
  getBusinessCategoryBySlug,
  getBusinessProfilesByCityAndCategory,
  getCityBySlug,
} from 'lib/sanity/sanity.client'
import { getClient } from 'lib/sanity/sanity.client.cdn'

export default function BusinessPage({
  category,
  city,
  businessProfiles,
  posts,
}) {
  return (
    <>
      <CategorizedBusinessesMeta category={category} city={city} />

      <section className="boxSection">
        <div className="boxContainer">
          <div className="border-b border-gray-300 pb-10">
            <h1 className="py-10 text-center text-3xl font-bold capitalize sm:text-5xl">
              Best {category.name} Businesses in{' '}
              <span className="xs:truncate">
                <span className=" text-orange-500">{city.name}</span>,
                <span className=" text-orange-500"> Tennessee</span>
              </span>
            </h1>
          </div>
          {businessProfiles.length >= 1 ? (
            businessProfiles.map((businessProfile) => (
              <BusinessProfileItem
                key={businessProfile.slug}
                businessProfile={businessProfile}
              />
            ))
          ) : (
            <div className="my-10 min-h-[30vh]">
              <p className="text-center">
                There are no businesses listed yet! Click below to add your
                business.
              </p>
              <div className="mt-10 flex justify-center">
                <Button
                  href="/businesses/business-management/add"
                  styleType="secondary"
                >
                  Add a Business
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export async function getStaticProps({ params }) {
  const client = getClient()
  const { category, city } = params

  const categoryData = await getBusinessCategoryBySlug(client, category)
  const cityData = await getCityBySlug(client, city)
  const posts = await getAllPosts(client)

  if (!categoryData || !cityData) {
    return {
      notFound: true,
    }
  }
  const businessProfiles = await getBusinessProfilesByCityAndCategory(
    client,
    cityData.slug,
    categoryData.slug
  )

  return {
    props: {
      businessProfiles,
      category: categoryData,
      city: cityData,
      posts,
    },
  }
}

export async function getStaticPaths() {
  const client = getClient()
  const categories = await getAllBusinessProfileCategories(client)
  const cities = await getAllCities(client)

  const paths = []

  for (const category of categories) {
    for (const city of cities) {
      const businessProfiles = await getBusinessProfilesByCityAndCategory(
        client,
        city.slug,
        category.slug
      )

      if (businessProfiles.length > 0) {
        paths.push({
          params: {
            category: category.slug,
            city: city.slug,
          },
        })
      }
    }
  }

  return {
    paths,
    fallback: 'blocking',
  }
}

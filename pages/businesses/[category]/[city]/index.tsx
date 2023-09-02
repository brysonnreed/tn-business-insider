import Avatar from 'components/AuthorAvatar'
import BlogContainer from 'components/Blog/BlogContainer'
import BusinessListingMeta from 'components/Businesses/BusinessListingMeta'
import BusinessProfile from 'components/BusinessProfile/BusinessProfile'
import CoverImage from 'components/CoverImage'
import Header from 'components/Header/Header'
import Date from 'components/Post/PostDate'
import SectionSeparator from 'components/SectionSeparator'
import ShowcaseSlider from 'components/ShowcaseSlider'
import {
  getAllBusinessProfileCategories,
  getAllCities,
  getAllPosts,
  getBusinessCategoryBySlug,
  getBusinessProfilesByCityAndCategory,
  getCityBySlug,
} from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import Router from 'next/router'
import Carousel from 'react-multi-carousel'

export default function BusinessPage({
  category,
  city,
  businessProfiles,
  posts,
}) {
  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 3,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 1,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464,
      },
      items: 2,
      partialVisibilityGutter: 30,
    },
  }
  return (
    <>
      <BusinessListingMeta category={category} city={city} />
      {/* <Header /> */}
      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <div className="border-b border-gray-300 pb-10">
            <h1 className="py-10 text-center text-3xl font-bold capitalize sm:text-5xl">
              Best {category.name} Businesses in{' '}
              <span className="border-b-4 border-black xs:truncate">
                <span className=" text-orange-500">{city.name}</span>,
                <span className=" text-orange-500"> Tennessee</span>
              </span>
            </h1>
          </div>
          {businessProfiles.length >= 1 ? (
            businessProfiles.map((businessProfile) => (
              <BusinessProfile
                key={businessProfile.slug}
                businessProfile={businessProfile}
              />
            ))
          ) : (
            <div className="my-10 min-h-[30vh]">
              <p className="text-center">
                There are no businesses listed yet! Contact us to get your
                business listed.
              </p>
            </div>
          )}

          <h3
            className={`py-10 text-center text-3xl font-bold capitalize sm:text-5xl ${
              businessProfiles < 1 && `border-t border-gray-300`
            }`}
          >
            Trending{' '}
            <span className="border-b-4 border-black text-orange-500">
              Business
            </span>{' '}
            Information
          </h3>
          <ShowcaseSlider posts={posts} />
        </BlogContainer>
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

import { getAllCitiesSlugs, getCityBySlug } from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'

export default function City({ city }) {
  return (
    <div className="bg-red-600 text-white">
      <h1>City</h1>
      <p>{city.name}</p>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const client = getClient()
  const city = await getCityBySlug(client, params.slug)

  if (!city) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      city,
    },
  }
}

export async function getStaticPaths() {
  const slugs = await getAllCitiesSlugs()

  return {
    paths: slugs?.map(({ slug }) => `/businesses/tn/${slug}`) || [],
    fallback: 'blocking',
  }
}

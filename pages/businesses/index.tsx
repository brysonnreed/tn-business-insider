import BusinessProfileIndexPage from 'components/BusinessProfile/BusinessProfileIndexPage'
import PreviewBusinessProfileIndexPage from 'components/PreviewPages/PreviewBusinessProfileIndexPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllBusinessProfileCategories,
  getAllBusinessProfiles,
  getAllCities,
  getBusinessCategoryBySlug,
  getCityBySlug,
  getClient,
  getSettings,
} from 'lib/sanity.client'
import { BusinessProfile, Category, Cities, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  businessProfiles: BusinessProfile[]
  settings: Settings
  cities: Cities[]
  categories: Category[]
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  const { businessProfiles, settings, draftMode, cities, categories } = props

  if (draftMode) {
    return (
      <PreviewBusinessProfileIndexPage
        businessProfiles={businessProfiles}
        settings={settings}
      />
    )
  }

  return (
    <BusinessProfileIndexPage
      businessProfiles={businessProfiles}
      settings={settings}
      cities={cities}
      categories={categories}
    />
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, businessProfiles = []] = await Promise.all([
    getSettings(client),
    getAllBusinessProfiles(client),
  ])

  const categories = await getAllBusinessProfileCategories(client)
  const cities = await getAllCities(client)

  console.log(cities)
  console.log(categories)

  return {
    props: {
      businessProfiles,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
      cities,
      categories,
    },
  }
}

import BusinessProfilePage from 'components/BusinessProfile/BusinessProfilePage'
import PreviewBusinessProfilePage from 'components/PreviewPages/PreviewBusinessProfilePage'
import { readToken } from 'lib/sanity.api'
import {
  getAllBusinessProfileSlugs,
  getBusinessProfileBySlug,
  getClient,
  getSettings,
} from 'lib/sanity.client'
import { BusinessProfile, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  businessProfile: BusinessProfile
  settings?: Settings
}

interface Query {
  [key: string]: string
}

export default function BusinessProfileSlugRoute(props: PageProps) {
  const { settings, businessProfile, draftMode } = props

  if (draftMode) {
    return (
      <PreviewBusinessProfilePage
        businessProfile={businessProfile}
        settings={settings}
      />
    )
  }

  return (
    <BusinessProfilePage
      businessProfile={businessProfile}
      settings={settings}
    />
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async ({
  params,
  preview = false,
}) => {
  const client = getClient(preview ? { token: readToken } : undefined)

  const [settings, businessProfile] = await Promise.all([
    getSettings(client),
    getBusinessProfileBySlug(client, params?.slug), // Use params?.slug to access the slug value
  ])

  if (!businessProfile) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      businessProfile,
      settings,
      draftMode: preview,
      token: preview ? readToken : '',
    },
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllBusinessProfileSlugs()

  return {
    paths:
      slugs?.map(({ slug }) => ({
        params: { slug }, // Provide the slug value as params
      })) || [],
    fallback: 'blocking',
  }
}

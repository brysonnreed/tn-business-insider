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
import { useEffect } from 'react'
import {
  hasBusinessBeenViewed,
  markBusinessAsViewed,
} from 'utils/sessionStorage.js'

interface PageProps extends SharedPageProps {
  businessProfile: BusinessProfile
  settings?: Settings
}

interface Query {
  [key: string]: string
}

export default function BusinessProfileSlugRoute(props: PageProps) {
  const { settings, businessProfile, draftMode } = props

  console.log(businessProfile)

  useEffect(() => {
    if (!hasBusinessBeenViewed(businessProfile._id)) {
      // Increment view count for this business profile
      // You'd probably want to do this with an API call that updates your database
      incrementViewCount(businessProfile._id)

      // Mark this business profile as viewed in this session
      markBusinessAsViewed(businessProfile._id)
    }
  }, [businessProfile])

  const incrementViewCount = async (businessId) => {
    try {
      const response = await fetch('/api/handleBusinessView', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId }),
      })

      if (!response.ok) {
        throw new Error('Failed to record view.')
      }

      const data = await response.json()
      console.log(data.message) // Business view recorded successfully.
    } catch (error) {
      console.error('Error:', error)
    }
  }

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

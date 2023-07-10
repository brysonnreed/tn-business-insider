import BusinessProfileIndexPage from 'components/BusinessProfileIndexPage'
import PreviewBusinessProfileIndexPage from 'components/PreviewBusinessProfileIndexPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllBusinessProfiles,
  getClient,
  getSettings,
} from 'lib/sanity.client'
import { BusinessProfile, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  businessProfiles: BusinessProfile[]
  settings: Settings
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  const { businessProfiles, settings, draftMode } = props

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

  return {
    props: {
      businessProfiles,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

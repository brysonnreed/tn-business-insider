import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import BusinessProfile from 'components/BusinessProfile'
import BusinessProfileIndexPageHead from 'components/IndexPageHead'
import {
  getAllBusinessProfiles,
  getClient,
  getSettings,
} from 'lib/sanity.client'
import {
  BusinessProfile as BusinessProfileType,
  Settings,
} from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

interface BusinessProfileIndexPageProps {
  businessProfiles: BusinessProfileType[]
  settings: Settings
  preview?: boolean
  loading?: boolean
}

export default function BusinessProfileIndexPage(
  props: BusinessProfileIndexPageProps
) {
  const { preview, loading, businessProfiles, settings } = props

  return (
    <>
      <BusinessProfileIndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          {businessProfiles.map((businessProfile) => (
            <BusinessProfile
              key={businessProfile._id}
              businessProfile={businessProfile}
            />
          ))}
        </Container>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps<
  BusinessProfileIndexPageProps
> = async () => {
  const client = getClient()
  const [settings, businessProfiles] = await Promise.all([
    getSettings(client),
    getAllBusinessProfiles(client),
  ])

  return {
    props: {
      businessProfiles,
      settings,
    },
  }
}

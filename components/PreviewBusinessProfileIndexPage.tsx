import BusinessProfileIndexPage from 'components/BusinessProfileIndexPage'
import {
  BusinessProfile,
  businessProfilesQuery,
  Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'

interface BusinessProfileIndexPageProps {
  preview?: boolean
  loading?: boolean
  businessProfiles: BusinessProfile[]
  settings: Settings
}

export default function BusinessProfileIndexPagePreview(
  props: BusinessProfileIndexPageProps
) {
  const [businessProfiles, loadingBusinessProfiles] = useLiveQuery<
    BusinessProfile[]
  >(props.businessProfiles, businessProfilesQuery)
  const [settings, loadingSettings] = useLiveQuery<Settings>(
    props.settings,
    settingsQuery
  )

  return (
    <BusinessProfileIndexPage
      preview
      loading={loadingBusinessProfiles || loadingSettings}
      businessProfiles={businessProfiles || []}
      settings={settings || {}}
    />
  )
}

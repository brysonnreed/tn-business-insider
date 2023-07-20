import BusinessProfilePage, {
  BusinessProfilePageProps,
} from 'components/BusinessProfile/BusinessProfilePage'
import {
  type BusinessProfile,
  businessProfileBySlugQuery,
  Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'

export default function PreviewBusinessProfilePage(
  props: BusinessProfilePageProps
) {
  const [{ businessProfile: businessProfilePreview }, loadingBusinessProfile] =
    useLiveQuery<{
      businessProfile: BusinessProfile
    }>({ businessProfile: props.businessProfile }, businessProfileBySlugQuery, {
      slug: props.businessProfile.slug,
    })
  const [settings, loadingSettings] = useLiveQuery<Settings>(
    props.settings,
    settingsQuery
  )

  return (
    <BusinessProfilePage
      preview
      loading={loadingBusinessProfile || loadingSettings}
      businessProfile={businessProfilePreview}
      settings={settings}
    />
  )
}

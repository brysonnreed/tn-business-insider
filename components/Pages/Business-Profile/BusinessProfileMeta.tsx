import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity/sanity.image'
import { BusinessProfile, Settings } from 'lib/sanity/sanity.queries'
import Head from 'next/head'

import DefaultMeta from '../DefaultMeta'

export interface BusinessProfileMetaProps {
  settings: Settings
  businessProfile: BusinessProfile
}

export default function BusinessProfileMeta({
  settings,
  businessProfile,
}: BusinessProfileMetaProps) {
  return (
    <Head>
      <DefaultMeta />
      <title>
        {`${businessProfile?.name} - ${businessProfile?.city}, Tennessee`}
      </title>
      <meta name="description" content={`${businessProfile.description}`} />
      <meta
        name="keywords"
        content={`${businessProfile.name}, ${businessProfile.city}, Tennessee`}
      />
      <meta
        name="news_keywords"
        content={`${businessProfile.name}, ${businessProfile.city}, Tennessee`}
      />
      <meta property="og:url" content={`${businessProfile.slug}`} />
      <meta
        property="og:title"
        content={`${businessProfile.name} - ${businessProfile.city}, Tennessee`}
      />
      <meta
        property="og:description"
        content={`${businessProfile.description}`}
      />
      <meta property="og:site_name" content={`${settings.title}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${businessProfile.name}`} />
      <meta
        name="twitter:description"
        content={`${businessProfile.description}`}
      />
      {businessProfile.logo && (
        <meta
          name="twitter:image"
          content={urlForImage(businessProfile.logo).url()}
        />
      )}
      <meta
        name="twitter:image:alt"
        content={`Logo for ${businessProfile.name}`}
      />

      {businessProfile.logo?.asset?._ref && (
        <meta
          property="og:image"
          content={urlForImage(businessProfile.logo).url()}
        />
      )}
    </Head>
  )
}

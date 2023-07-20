import BlogMeta from 'components/Blog/BlogMeta'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import { BusinessProfileCategory, Cities, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import og from 'pages/api/og'
import ogImage from 'public/images/logo.jpg'

export interface BusinessListingMetaProps {
  category: BusinessProfileCategory
  city: Cities
}

export default function BusinessListingMeta({
  category,
  city,
}: BusinessListingMetaProps) {
  const ogImageUrl = '/images/logo.jpg'

  return (
    <Head>
      <title>{`Best ${category.name} in ${city.name}, Tennessee`}</title>
      <meta
        name="description"
        content={`Discover the best ${category?.name} in ${city?.name}, Tennessee. Find top-rated ${category?.name} businesses, services, and professionals near you.`}
      />
      <meta
        name="keywords"
        content={`${city.name}, Tennessee, ${category.name}`}
      />
      <meta
        name="news_keywords"
        content={`${city.name}, Tennessee, ${category.name}`}
      />

      <meta
        property="og:title"
        content={`Best ${category.name} in ${city.name}, Tennessee`}
      />
      <meta
        property="og:description"
        content={`Discover the best ${category?.name} in ${city?.name}, Tennessee. Find top-rated ${category?.name} businesses, services, and professionals near you.`}
      />
      <meta
        property="og:site_name"
        content={`Best ${category.name} in ${city.name}, Tennessee`}
      />
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:title"
        content={`Best ${category.name} in ${city.name}, Tennessee`}
      />
      <meta
        name="twitter:description"
        content={`Discover the best ${category?.name} in ${city?.name}, Tennessee. Find top-rated ${category?.name} businesses, services, and professionals near you.`}
      />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta
        name="twitter:image:alt"
        content={`Best ${category.name} in ${city.name}, Tennessee`}
      />

      <BlogMeta />
      <meta property="og:image" content={ogImageUrl} />
    </Head>
  )
}

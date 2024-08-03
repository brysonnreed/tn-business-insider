import { toPlainText } from '@portabletext/react'
import * as demo from 'lib/demo.data'
import { Settings } from 'lib/sanity/sanity.queries'
import Head from 'next/head'

import DefaultMeta from '../DefaultMeta'

export interface HomeMetaProps {
  settings: Settings
}

export default function HomeMeta({ settings }: HomeMetaProps) {
  const {
    title = demo.title,
    description = demo.description,
    ogImage = {},
  } = settings
  const ogImageTitle = ogImage?.title || demo.ogImageTitle

  return (
    <Head>
      <title>{title}</title>
      <DefaultMeta />
      <meta
        key="description"
        name="description"
        content={toPlainText(description)}
      />
      <meta
        name="keywords"
        content="Businesses in Tennessee, Business Trends, Business Resources"
      />
      <meta
        name="news_keywords"
        content="Businesses in Tennessee, Business Trends, Business Resources"
      />
      <meta property="og:title" content={`${title}`} />
      <meta property="og:description" content={toPlainText(description)} />
      <meta property="og:site_name" content={`${title}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${title}`} />
      <meta name="twitter:description" content={toPlainText(description)} />
      <meta
        name="twitter:image"
        content={`${
          process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
        }/api/og?${new URLSearchParams({ title: ogImageTitle })}`}
      />
      <meta
        property="og:image"
        // Because OG images must have a absolute URL, we use the
        // `VERCEL_URL` environment variable to get the deployment’s URL.
        // More info:
        // https://vercel.com/docs/concepts/projects/environment-variables
        content={`${
          process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
        }/api/og?${new URLSearchParams({ title: ogImageTitle })}`}
      />
    </Head>
  )
}

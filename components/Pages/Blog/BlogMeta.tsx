import DefaultMeta from 'components/Pages/DefaultMeta'
import Head from 'next/head'

export default function BlogMeta() {
  const title = `Insights, Tips, and Advice for your business`
  const description = `Looking for valuable information for your business? Explore our collection of blog posts to gain valuable Insights, Tips, and Advice for your business.`

  return (
    <Head>
      <title>{title}</title>
      <DefaultMeta />
      <meta key="description" name="description" content={description} />
      <meta name="keywords" content="Businesses in Tennessee" />
      <meta name="news_keywords" content="Businesses in Tennessee" />
      <meta property="og:title" content={`${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={`${title}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${title}`} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={`${
          process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
        }/images/logo.jpg`}
      />
      <meta
        property="og:image"
        // Because OG images must have a absolute URL, we use the
        // `VERCEL_URL` environment variable to get the deployment’s URL.
        // More info:
        // https://vercel.com/docs/concepts/projects/environment-variables
        content={`${
          process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
        }/images/logo.jpg`}
      />
    </Head>
  )
}

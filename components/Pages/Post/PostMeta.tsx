import DefaultMeta from 'components/Pages/DefaultMeta'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity/sanity.image'
import { Post, Settings } from 'lib/sanity/sanity.queries'
import Head from 'next/head'

export interface PostMetaProps {
  settings: Settings
  post: Post
}

export default function PostMeta({ settings, post }: PostMetaProps) {
  const title = settings.title ?? demo.title
  return (
    <Head>
      <title>{post.title}</title>
      <meta name="description" content={`${post?.metaDescription}`} />
      <meta name="keywords" content={`${post.keywords}`} />
      <meta name="news_keywords" content={`${post.keywords}`} />
      <meta property="og:url" content={`${post.slug}`} />
      <meta property="og:title" content={`${post.title}`} />
      <meta property="og:description" content={`${post?.metaDescription}`} />
      <meta property="og:site_name" content={`${settings.title}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${post.title}`} />
      <meta name="twitter:description" content={`${post.title}`} />
      <meta name="twitter:image" content={urlForImage(post.coverImage).url()} />
      <meta
        name="twitter:image:alt"
        content={`Cover image for ${post.title}`}
      />

      <DefaultMeta />
      {post.coverImage?.asset?._ref && (
        <meta
          property="og:image"
          content={urlForImage(post.coverImage)
            .width(1200)
            .height(627)
            .fit('crop')
            .url()}
        />
      )}
    </Head>
  )
}

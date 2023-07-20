import PostPage from 'components/Post/PostPage'
import PreviewPostPage from 'components/PreviewPages/PreviewPostPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllCategories,
  getAllCategoriesSlugs,
  getAllPostsSlugs,
  getClient,
  getPostAndMoreStories,
  getSettings,
} from 'lib/sanity.client'
import { Category, Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  post: Post
  morePosts: Post[]
  settings?: Settings
}

interface Query {
  [key: string]: string
}

export default function BlogPostRoute(props: PageProps) {
  const { settings, post, morePosts, draftMode } = props

  if (draftMode) {
    return (
      <PreviewPostPage post={post} morePosts={morePosts} settings={settings} />
    )
  }

  return <PostPage post={post} morePosts={morePosts} settings={settings} />
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const { category, post } = params // Use category and post slugs from params

  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, { post: postData, morePosts }] = await Promise.all([
    getSettings(client),
    getPostAndMoreStories(client, post), // Use post slug here
  ])

  console.log('params.slug:', params.slug)

  if (!postData) {
    return {
      notFound: true,
    }
  }
  console.log('post:', post)
  console.log('morePosts:', morePosts)

  return {
    props: {
      post: postData,
      morePosts,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

export const getStaticPaths = async () => {
  const [categories, postSlugs] = await Promise.all([
    getAllCategoriesSlugs(),
    getAllPostsSlugs(),
  ])

  const paths = postSlugs.flatMap(({ slug }) =>
    categories.map(({ slug: categorySlug }) => ({
      params: {
        category: categorySlug,
        post: slug,
      },
    }))
  )

  return {
    paths,
    fallback: 'blocking',
  }
}

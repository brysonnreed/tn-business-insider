import IndexPage from 'components/IndexPage'
import PreviewIndexPage from 'components/PreviewPages/PreviewIndexPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllCategories,
  getAllCities,
  getAllPosts,
  getClient,
  getSettings,
} from 'lib/sanity.client'
import { Category, Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  posts: Post[]
  settings: Settings
  categories: Category[]
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  const { posts, settings, draftMode, categories } = props
  const { data: session } = useSession()

  if (draftMode) {
    return (
      <PreviewIndexPage
        posts={posts}
        settings={settings}
        categories={categories}
      />
    )
  }

  return <IndexPage posts={posts} settings={settings} categories={categories} />
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, posts = [], categories = []] = await Promise.all([
    getSettings(client),
    getAllPosts(client),
    getAllCategories(client),
    // Fetch all categories
  ])
  const city = await getAllCities(client)

  return {
    props: {
      posts,
      categories,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
      city,
    },
  }
}

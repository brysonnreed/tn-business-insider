import IndexPage from 'components/IndexPage'
import PreviewIndexPage from 'components/PreviewPages/PreviewIndexPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllBusinessCategoriesSlugs,
  getAllBusinessProfileCategories,
  getAllCategories,
  getAllCategoriesSlugs,
  getAllCities,
  getAllCitiesSlugs,
  getAllPosts,
  getClient,
  getSettings,
} from 'lib/sanity.client'
import { Category, Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import type { SharedPageProps } from 'pages/_app'
import { useEffect } from 'react'

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
  useEffect(() => {
    // When the session changes from "loading" to "authenticated",
    // it means the user just logged in successfully.
    if (session) {
      const userAdded = sessionStorage.getItem('userAdded')
      if (userAdded !== 'true') {
        // Make a POST request to your addUser API route
        fetch('/api/addUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Include any other relevant user information
            name: session.user.name,
            email: session.user.email,
          }),
        }).then((response) => {
          if (response.status === 200) {
            // Set the userAdded flag in sessionStorage
            sessionStorage.setItem('userAdded', 'true')
          }
        })
      }
    }
  }, [session])

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

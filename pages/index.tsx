import HomePage from 'components/Pages/Home/HomePage'
import { readToken } from 'lib/sanity/sanity.api'
import { getAllPosts, getClient, getSettings } from 'lib/sanity/sanity.client'
import { Post, Settings } from 'lib/sanity/sanity.queries'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import type { SharedPageProps } from 'pages/_app'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface PageProps extends SharedPageProps {
  posts: Post[]
  settings: Settings
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  const { posts, settings } = props
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Check if the 'protectedPageCallback' query parameter is present in the URL
    const loggedIn = router.query.loggedIn === 'true'
    if (loggedIn) {
      // Display a toast message informing the user to log out to access the page
      toast.error('Sign out to access this page')
    }
  }, [router.query.loggedIn])

  return <HomePage posts={posts} settings={settings} />
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, posts = []] = await Promise.all([
    getSettings(client),
    getAllPosts(client),
  ])

  return {
    props: {
      posts,
      settings,
      token: draftMode ? readToken : '',
    },
  }
}

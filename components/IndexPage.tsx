import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import MoreStories from 'components/MoreStories'
import type { Category, Post, Settings } from 'lib/sanity.queries'

import SectionSeparator from './SectionSeparator'
import ShowcaseSlider from './ShowcaseSlider'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  categories: Category[]
  settings: Settings
}

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, settings, categories } = props
  const [heroPost, ...morePosts] = posts || []

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          {/* Change to ShowcaseSlider */}
          {/* <h1 className="py-10 text-center text-3xl font-bold capitalize text-orange-500 sm:text-5xl">
            Trending{' '}
            <span className="border-b-4 border-black text-black">Business</span>{' '}
            Information <span className="text-6xl text-black">.</span>
          </h1> */}
          <h1 className="py-10 text-center text-3xl font-bold capitalize sm:text-5xl">
            Trending{' '}
            <span className="border-b-4 border-black text-orange-500">
              Business
            </span>{' '}
            Information
          </h1>
          <ShowcaseSlider posts={posts} />
          {/* {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )} */}
          <SectionSeparator />
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

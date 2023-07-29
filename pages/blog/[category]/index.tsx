import BlogContainer from 'components/Blog/BlogContainer'
import Event from 'components/Events/Event'
import Header from 'components/Header'
import PostPreview from 'components/Post/PostPreview'
import {
  getAllCategories,
  getAllEvents,
  getAllPosts,
  getCategoryBySlug,
  getPostsByCategory,
} from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'

export default function CategoryIndexPage({ category, blogPosts, events }) {
  return (
    <>
      <Header />
      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <h1 className="py-10 text-center text-3xl font-bold capitalize sm:text-5xl">
            {category.name}
          </h1>
          {blogPosts.length > 0 && ( // Check if blogPosts exists and is not empty
            <main className="mb-32 grid grid-cols-1 gap-y-10  sm:grid-cols-2 sm:gap-10 md:gap-x-8 md:gap-y-[50px] xl:grid-cols-3">
              {blogPosts.map((blogPost) => (
                <PostPreview
                  key={blogPost._id}
                  title={blogPost.title}
                  coverImage={blogPost.coverImage}
                  date={blogPost.date}
                  author={blogPost.author}
                  slug={blogPost.slug}
                  excerpt={blogPost.excerpt}
                />
              ))}
            </main>
          )}

          {blogPosts.length === 0 && events.length > 0 && (
            // Check if events exist and blogPosts is empty
            <main className="flex flex-col gap-5">
              {events.map((event) => (
                <Event
                  key={event._id}
                  name={event.name}
                  date={event.date}
                  description={event.description}
                  dateEstimate={event.dateEstimate}
                  link={event.link}
                />
              ))}
            </main>
          )}
        </BlogContainer>
      </section>
    </>
  )
}

export async function getStaticProps({ params }) {
  const { category } = params
  const client = getClient()
  const categoryData = await getCategoryBySlug(client, category)

  // Check if the category is 'events'
  if (categoryData.slug === 'events') {
    const events = await getAllEvents(client)
    return {
      props: {
        category: categoryData,
        blogPosts: [], // Empty array for blogPosts since we are on the events page
        events,
      },
    }
  } else {
    const blogPosts = await getPostsByCategory(client, categoryData.slug)
    return {
      props: {
        category: categoryData,
        blogPosts,
        events: [], // Empty array for events since we are not on the events page
      },
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = await getClient()
  const categories = await getAllCategories(client)

  const paths = categories.map((category) => ({
    params: { category: category.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

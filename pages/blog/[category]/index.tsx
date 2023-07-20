import BlogContainer from 'components/Blog/BlogContainer'
import Header from 'components/Header'
import PostPreview from 'components/Post/PostPreview'
import {
  getAllCategories,
  getAllPosts,
  getCategoryBySlug,
  getPostsByCategory,
} from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'

export default function CategoryIndexPage({ category, blogPosts }) {
  return (
    <>
      <Header />
      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <h1 className="py-10 text-center text-3xl font-bold capitalize sm:text-5xl">
            {category.name}
          </h1>
          <article className="mb-32 grid grid-cols-1 gap-y-10  sm:grid-cols-2 sm:gap-10 md:gap-x-8 md:gap-y-[50px] xl:grid-cols-3">
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
          </article>
        </BlogContainer>
      </section>
    </>
  )
}

export async function getStaticProps({ params }) {
  const { category } = params
  const client = getClient()
  const categoryData = await getCategoryBySlug(client, category)
  const blogPosts = await getPostsByCategory(client, categoryData.slug)

  return {
    props: {
      category: categoryData,
      blogPosts,
    },
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

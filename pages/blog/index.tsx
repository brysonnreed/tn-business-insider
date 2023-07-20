import BlogContainer from 'components/Blog/BlogContainer'
import Header from 'components/Header'
import { getAllCategories } from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import { GetStaticProps } from 'next'
import Link from 'next/link'

export default function BlogPage({ categories }) {
  return (
    <>
      <Header />
      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <h1 className="pb-5 text-center">Browse our categories</h1>
          <ul className="flex flex-row items-center justify-center gap-4">
            {categories.map((category) => (
              <li className="bg-black p-2 text-white" key={category.slug}>
                <Link href={`/blog/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </BlogContainer>
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getClient()
  const categories = await getAllCategories(client)

  return {
    props: {
      categories,
    },
  }
}

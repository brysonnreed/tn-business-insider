import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BlogContainer from 'components/Blog/BlogContainer'
import BlogListContainer from 'components/Blog/BlogListContainer'
import Footer from 'components/Footer'
import Header from 'components/Header'
import { motion } from 'framer-motion'
import {
  getAllCategories,
  getAllPosts,
  getPostsByCategory,
} from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function BlogPage({ categories, posts }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadedPostSlugs, setLoadedPostSlugs] = useState([])
  const client = getClient()

  const loadMorePosts = async (category) => {
    setLoadingMore(true)
    const newPosts = await getPostsByCategory(client, category, 20, 'desc')
    setLoadingMore(false)
    return newPosts
  }

  const handleLoadMoreClick = async () => {
    if (loadingMore) return // Prevent multiple clicks while loading

    let newPosts = []
    if (selectedCategory === 'All') {
      newPosts = await loadMorePostsAll()
    } else {
      newPosts = await loadMorePostsByCategory(selectedCategory)
    }
    newPosts = newPosts.filter(
      (post) => !filteredPosts.some((p) => p.slug === post.slug)
    )

    if (newPosts.length === 0) {
      toast.error('No more posts to display.')
    } else {
      const uniqueNewPosts = newPosts.filter(
        (post) => !filteredPosts.some((p) => p.slug === post.slug)
      )
      setLoadedPostSlugs((prevSlugs) => [
        ...prevSlugs,
        ...uniqueNewPosts.map((post) => post.slug),
      ])
      setFilteredPosts((prevPosts) => [...prevPosts, ...uniqueNewPosts])
    }
  }

  useEffect(() => {
    filterPostsByCategory()
    setLoadedPostSlugs([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  const filterPostsByCategory = async () => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts)
    } else {
      const postsByCategory = await getPostsByCategory(
        client,
        selectedCategory,
        20
      )
      setFilteredPosts(postsByCategory)
    }
  }

  const loadMorePostsAll = async () => {
    const newPosts = await loadMorePostsForAll()
    const filteredNewPosts = newPosts.filter(
      (post) =>
        !loadedPostSlugs.includes(post.slug) &&
        !posts.some((p) => p.slug === post.slug)
    )

    return filteredNewPosts
  }

  const loadMorePostsByCategory = async (category) => {
    if (!loadedPostSlugs.includes(category)) {
      const newPosts = await loadMorePosts(category)
      const filteredNewPosts = newPosts.filter(
        (post) =>
          !loadedPostSlugs.includes(post.slug) &&
          !posts.some((p) => p.slug === post.slug)
      )
      return filteredNewPosts
    }
    return []
  }

  const loadMorePostsForAll = async () => {
    setLoadingMore(true)
    const newPosts = await getAllPosts(client, 20, 'desc')
    setLoadingMore(false)
    return newPosts
  }

  return (
    <>
      <Header />
      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <div className="mb-4 border-b border-black pb-4">
            <h1 className="mb-2 text-4xl font-semibold">Blog Posts</h1>
            <p className="text-gray-700">
              Browse all of our blog posts or select a category to easier find
              what you&apos;re looking for.
            </p>
          </div>
          <div className="mb-10 pt-2">
            <ul className="flex flex-row flex-wrap justify-center gap-4 font-semibold text-gray-600">
              <li className="capitalize">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  key="all"
                  onClick={() => setSelectedCategory('All')}
                  className={` ${
                    selectedCategory === 'All'
                      ? 'blogCategory'
                      : 'px-[10px] py-[5px]'
                  }`}
                  type="button"
                >
                  All
                </motion.button>
              </li>
              {categories.map((category, i) => (
                <li key={category.name} className="capitalize">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`px-[10px] py-[5px] ${
                      selectedCategory === category.slug ? 'blogCategory' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.slug)}
                    type="button"
                  >
                    {category.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            {filteredPosts.map((post) => (
              <div key={post._id} className="border-b pb-5">
                <BlogListContainer
                  author={post.author}
                  title={post.title}
                  slug={post.slug}
                  coverImage={post.coverImage}
                  excerpt={post.excerpt}
                  date={post._createdAt}
                />
              </div>
            ))}
            <div className="mt-5 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className=" flex flex-row items-center justify-center gap-1 bg-orange-500 px-4 py-2 text-white"
                onClick={handleLoadMoreClick}
                type="button"
              >
                Load More{' '}
                <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </BlogContainer>
      </section>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getClient()
  const categories = await getAllCategories(client)
  const posts = await getAllPosts(client, 20, 'desc')

  return {
    props: {
      categories,
      posts,
    },
  }
}

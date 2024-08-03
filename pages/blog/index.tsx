import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Heading from 'components/Common/Heading'
import Text from 'components/Common/Text'
import BlogListContainer from 'components/Layout/BlogListContainer'
import BlogMeta from 'components/Pages/Blog/BlogMeta'
import { AnimatePresence, motion } from 'framer-motion'
import {
  getAllCategories,
  getAllPosts,
  getPostsByCategory,
} from 'lib/sanity/sanity.client'
import { getClient } from 'lib/sanity/sanity.client.cdn'
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
      <BlogMeta />
      <section className="boxSection">
        <div className="boxContainer">
          <div className="mb-4 border-b border-black pb-4">
            <Heading level={1}>Blog Posts</Heading>
            <Text>
              Browse all of our blog posts or select a category to easier find
              what you&apos;re looking for.
            </Text>
          </div>
          <div className="mb-10 pt-2">
            <ul className="flex flex-row flex-wrap justify-center  gap-2 font-semibold text-gray-600 sm:gap-4">
              <li className="capitalize">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  key="all"
                  onClick={() => setSelectedCategory('All')}
                  className={` ${
                    selectedCategory === 'All'
                      ? 'blogCategory'
                      : 'px-[5px] py-[5px] text-sm text-gray-500  sm:px-[10px] sm:text-base'
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
                    className={`px-[5px] py-[5px] text-sm sm:px-[10px]  sm:text-base ${
                      selectedCategory === category.slug
                        ? 'blogCategory'
                        : 'text-gray-500'
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
            <motion.div layout>
              {filteredPosts.map((post) => (
                <AnimatePresence key={post._id}>
                  <BlogListContainer
                    author={post.author}
                    title={post.title}
                    slug={post.slug}
                    coverImage={post.coverImage}
                    excerpt={post.excerpt}
                    date={post._createdAt}
                  />
                </AnimatePresence>
              ))}
            </motion.div>
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
        </div>
      </section>
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

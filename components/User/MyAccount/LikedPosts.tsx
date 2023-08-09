import BlogListContainer from 'components/Blog/BlogListContainer'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

function LikedPosts({ posts }) {
  return (
    <motion.div
      initial={{ y: 150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      layout
    >
      {posts.map((post) => (
        <AnimatePresence key={post._id}>
          <BlogListContainer
            author={post.author}
            title={post.title}
            slug={post.slug.current}
            coverImage={post.coverImage}
            excerpt={post.excerpt}
            date={post._createdAt}
          />
        </AnimatePresence>
      ))}
    </motion.div>
  )
}

export default LikedPosts

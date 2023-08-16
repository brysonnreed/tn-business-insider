import BlogListContainer from 'components/Blog/BlogListContainer'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

function LikedPosts({ posts }) {
  return (
    <motion.div
      initial={{ y: 150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
    >
      <h3 className="mb-2 text-2xl  font-semibold sm:text-4xl">
        My{' '}
        <span className="text-2xl font-bold text-orange-500 sm:text-4xl">
          Liked Posts
        </span>
      </h3>
      {posts ? (
        posts.map((post) => (
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
        ))
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center rounded-md border-t bg-slate-200 transition-all duration-200 hover:shadow-lg">
          <p className="text-center text-base font-thin text-gray-800 sm:text-xl">
            It doesnt look like you have liked any posts. <br></br>
            <Link href={`/blog`} className="underline">
              Click here
            </Link>{' '}
            to browse our posts.
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default LikedPosts

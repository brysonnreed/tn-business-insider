import type { Post } from 'lib/sanity.queries'

import PostPreview from './Post/PostPreview'

export default function MoreStories({ posts }: { posts: Post[] }) {
  return (
    <section>
      <h2 className="mb-8 text-center text-4xl font-bold leading-tight tracking-tighter md:text-left md:text-5xl">
        More Stories
      </h2>
      <div className="mb-32 grid grid-cols-1 gap-y-10  sm:grid-cols-2 sm:gap-10 md:gap-x-8 md:gap-y-[50px] xl:grid-cols-3">
        {posts.map((post) => (
          <PostPreview
            key={post._id}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  )
}

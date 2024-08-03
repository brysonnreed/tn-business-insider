import Avatar from 'components/Features/Blog/AuthorAvatar'
import type { Post } from 'lib/sanity/sanity.queries'
import Router from 'next/router'

import CoverImage from './Post/CoverImage'
import Date from './Post/PostDate'

export default function BlogPostCard({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  comments,
}: Omit<Post, '_id'>) {
  return (
    <article
      className="flex min-h-[450px] flex-col justify-between rounded-lg border border-gray-200 p-2 shadow-2xl transition-all hover:scale-105 md:p-4"
      onClick={() => {
        Router.push(`/posts/${slug}`)
      }}
    >
      <div className="mb-5">
        <CoverImage
          slug={slug}
          title={title}
          image={coverImage}
          priority={false}
        />
      </div>

      <div className="flex h-full flex-col justify-between">
        <div className="mb-3 text-2xl font-semibold leading-snug">
          <a className="hover:underline" href={`/posts/${slug}`}>
            {title}
          </a>
          <div className="mb-3 text-lg font-normal text-gray-500">
            <Date dateString={date} />
          </div>
          {excerpt && (
            <p className="mb-4 line-clamp-2 overflow-hidden text-lg font-normal leading-relaxed md:line-clamp-3">
              {excerpt}
            </p>
          )}
        </div>

        {author && <Avatar name={author.name} picture={author.picture} />}
      </div>
    </article>
  )
}

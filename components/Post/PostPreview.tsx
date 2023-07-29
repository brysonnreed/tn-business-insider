import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import Router from 'next/router'

import Date from './PostDate'

export default function PostPreview({
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
      <h3 className="mb-3 text-2xl font-semibold leading-snug">
        <a className="hover:underline" href={`/posts/${slug}`}>
          {title}
        </a>
      </h3>
      <div className="mb-4 text-lg">
        <Date dateString={date} />
      </div>
      {excerpt && (
        <p className="mb-4 line-clamp-4 overflow-hidden text-lg leading-relaxed">
          {excerpt}
        </p>
      )}
      {author && <Avatar name={author.name} picture={author.picture} />}
    </article>
  )
}

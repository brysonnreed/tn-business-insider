import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Omit<Post, '_id'>) {
  return (
    <div className="flex min-h-[450px] flex-col justify-between rounded-lg border border-gray-200 p-2 shadow-2xl transition-all hover:scale-105 md:p-4">
      <Link href={`/posts/${slug}`}>
        <div className="mb-5">
          <CoverImage
            slug={slug}
            title={title}
            image={coverImage}
            priority={false}
          />
        </div>
      </Link>
      <h3 className="mb-3 text-2xl font-semibold leading-snug">
        <Link className=" hover:underline" href={`/posts/${slug}`}>
          {title}
        </Link>
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
    </div>
  )
}

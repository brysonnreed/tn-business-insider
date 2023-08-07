import AuthorAvatar from 'components/AuthorAvatar'
import { formatDistanceToNow } from 'date-fns'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BlogListContainer({ coverImage, title, author, excerpt, slug, date }) {
  const formatTimeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      includeSeconds: false,
    })
  }
  return (
    <article className="flex h-28 flex-row bg-white md:h-48">
      <Link href={`/posts/${slug}`} className="mr-4 h-full w-2/6 sm:w-1/3">
        <div className="relative h-full w-full">
          <Image
            src={urlForImage(coverImage).url()}
            fill
            sizes="max-width: 200px"
            className="object-cover"
            alt={`Cover Image for ${title}`}
            priority
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/posts/${slug}`}
            className="line-clamp-2 overflow-hidden text-base font-semibold hover:underline sm:text-xl"
          >
            {title}
          </Link>
          <p className="hidden overflow-hidden text-sm text-gray-500 sm:text-base md:line-clamp-2 lg:line-clamp-3">
            {excerpt}
          </p>
        </div>
        <div className="flex items-center">
          <div className="relative hidden items-center justify-center xs:mr-2 sm:flex">
            <Image
              src={
                author.picture?.asset?._ref
                  ? urlForImage(author.picture)
                      .height(96)
                      .width(96)
                      .fit('crop')
                      .url()
                  : 'https://source.unsplash.com/96x96/?face'
              }
              className="h-[28px] w-[28px] rounded-full"
              height={96}
              width={96}
              alt={author.name}
            />
          </div>
          <div className="text-[12px] text-[#222222]">
            <p>{author.name}</p>
            <p className="italic text-[#757575]">{formatTimeAgo(date)}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogListContainer

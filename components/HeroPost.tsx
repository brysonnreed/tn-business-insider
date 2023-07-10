import 'react-multi-carousel/lib/styles.css'

import AuthorAvatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import Carousel from 'react-multi-carousel'

export default function HeroPost(
  props: Pick<
    Post,
    'title' | 'coverImage' | 'date' | 'excerpt' | 'author' | 'slug'
  >
) {
  const { title, coverImage, date, excerpt, author, slug } = props

  return (
    <section className="mb-5 border-b-2 border-black">
      <div className="mb-8 md:mb-16">
        <CoverImage slug={slug} title={title} image={coverImage} priority />
      </div>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title || 'Untitled'}
            </Link>
          </h3>
          <div className="mb-4 flex flex-col gap-5 text-lg md:mb-0">
            <Date dateString={date} />

            {author && (
              <AuthorAvatar name={author.name} picture={author.picture} />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4">
          <p className=" overflow-hidden text-lg">{excerpt}</p>
        </div>
      </div>
    </section>
  )
}

import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import type { Post } from 'lib/sanity.queries'
import { useRouter } from 'next/router'

export default function PostHeader(
  props: Pick<Post, 'title' | 'coverImage' | 'date' | 'author' | 'slug'>
) {
  const { title, coverImage, date, author, slug } = props
  const router = useRouter()

  const shareToSocialMedia = (platform) => {
    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          router.asPath
        )}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          router.asPath
        )}&text=${encodeURIComponent(title)}`
        break
      case 'instagram':
        shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(
          router.asPath
        )}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          router.asPath
        )}&title=${encodeURIComponent(title)}`
        break
      default:
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  return (
    <section className="mb-10">
      <PostTitle>{title}</PostTitle>
      <div className="hidden justify-between md:mb-10 md:flex">
        <div className="flex flex-col items-end justify-end">
          {author && <Avatar name={author.name} picture={author.picture} />}
          <Date dateString={date} />
        </div>

        <div className="flex flex-row items-center justify-center space-x-4">
          <FontAwesomeIcon
            icon={faFacebook}
            className="h-8 w-8 cursor-pointer text-blue-500 transition-all hover:scale-105"
            onClick={() => shareToSocialMedia('facebook')}
          />
          <FontAwesomeIcon
            icon={faTwitter}
            className="h-8 w-8 cursor-pointer text-blue-400 transition-all hover:scale-105"
            onClick={() => shareToSocialMedia('twitter')}
          />
          <FontAwesomeIcon
            icon={faInstagram}
            className="h-8 w-8 cursor-pointer text-pink-700 transition-all hover:scale-105"
            onClick={() => shareToSocialMedia('instagram')}
          />
          <FontAwesomeIcon
            icon={faLinkedin}
            className="h-8 w-8 cursor-pointer text-blue-900 transition-all hover:scale-105 "
            onClick={() => shareToSocialMedia('linkedin')}
          />
        </div>
      </div>
      <div className="mb-8 sm:mx-0 md:mb-16">
        <CoverImage title={title} image={coverImage} priority slug={slug} />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="flex justify-between md:mb-10 md:hidden">
          <div className="flex flex-col items-end justify-end">
            {author && <Avatar name={author.name} picture={author.picture} />}
            <Date dateString={date} />
          </div>

          <div className="flex flex-row flex-wrap items-center justify-center gap-2 sm:flex-nowrap sm:space-x-4">
            <FontAwesomeIcon
              icon={faFacebook}
              className="h-5 w-5 cursor-pointer text-blue-500 transition-all hover:scale-105"
              onClick={shareToSocialMedia}
            />
            <FontAwesomeIcon
              icon={faTwitter}
              className="h-5 w-5 cursor-pointer text-blue-400 transition-all hover:scale-105"
              onClick={shareToSocialMedia}
            />
            <FontAwesomeIcon
              icon={faInstagram}
              className="h-5 w-5 cursor-pointer text-pink-700 transition-all hover:scale-105"
              onClick={shareToSocialMedia}
            />
            <FontAwesomeIcon
              icon={faLinkedin}
              className="h-5 w-5 cursor-pointer text-blue-900 transition-all hover:scale-105 "
              onClick={shareToSocialMedia}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

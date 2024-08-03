import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { faCalendar, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Avatar from 'components/Features/Blog/AuthorAvatar'
import { getClient } from 'lib/sanity/sanity.client.cdn'
import type { Post } from 'lib/sanity/sanity.queries'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

import CoverImage from './CoverImage'
// import { updatePostLikes } from '../../pages/api/likes'
// import LikeElement from './LikeElement'
import Date from './PostDate'
import PostTitle from './PostTitle'
type user = {
  name: string
  image: any
  likedBlogPosts: any
  _id: any
}

export default function PostHeader(
  props: Pick<Post, 'title' | 'coverImage' | 'date' | 'author' | 'slug' | '_id'>
) {
  const { title, coverImage, date, author, slug /*likes*/ } = props
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const client = getClient()
  const [user, setUser] = useState<user>({
    name: '',
    image: null,
    likedBlogPosts: null,
    _id: '',
  })
  const { data: session } = useSession()
  const getUser = async (userEmail) => {
    const client = getClient()
    let user = await client.fetch('*[_type == "user" && email == $email][0]', {
      email: userEmail,
    })
    setUser(user)
    return user
  }
  const fetchUserData = async () => {
    try {
      const userEmail = session?.user?.email
      const userData = await getUser(userEmail)
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  if (session) {
    fetchUserData()
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = session?.user?.email
        const userData = await getUser(userEmail)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])
  useEffect(() => {
    const checkLikedStatus = async () => {
      try {
        const user = await getUser(session?.user?.email)

        // Check if the post's ID is in the user's likedBlogPosts
        setIsLiked(user.likedBlogPosts.some((post) => post._ref === props._id))
      } catch (error) {
        console.error('Error checking liked status:', error)
      }
    }

    if (session) {
      checkLikedStatus()
    }
  }, [props._id, session])

  const handleLike = async () => {
    if (!session) {
      toast.error('You must be logged in to like a post!')
      return
    }

    try {
      if (isLiked) {
        // Unlike logic: Remove the post from likedBlogPosts
        const updatedLikedPosts = user.likedBlogPosts.filter(
          (post) => post._ref !== props._id
        )

        await client
          .patch(user._id)
          .set({ likedBlogPosts: updatedLikedPosts })
          .commit()
        toast.success('Post unliked!')
      } else {
        await client
          .patch(user._id)
          .append('likedBlogPosts', [
            {
              _type: 'reference',
              _ref: props._id,
              _key: uuidv4(),
            },
          ])
          .commit()
        toast.success('Post liked!')
      }

      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error updating liked status:', error)
    }
  }

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
          <div className="flex flex-row items-center justify-center gap-2">
            <FontAwesomeIcon
              icon={faCalendar}
              className="h-4 w-4 text-orange-500"
            />
            <Date dateString={date} />
          </div>
        </div>

        <div className="flex flex-row items-center justify-center space-x-4">
          <FontAwesomeIcon
            icon={faThumbsUp}
            className={`h-8 w-8 cursor-pointer transition-all ${
              isLiked
                ? 'text-orange-500 hover:scale-105'
                : 'text-gray-500 hover:text-orange-500'
            }`}
            onClick={() => handleLike()}
          />

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
        <div className="flex flex-col justify-between gap-2 sm:flex-row md:mb-10 md:hidden">
          <div className="flex flex-col items-center justify-center sm:items-start sm:justify-center">
            {author && <Avatar name={author.name} picture={author.picture} />}
            <div className="flex flex-row items-center justify-center gap-2">
              <FontAwesomeIcon
                icon={faCalendar}
                className="h-4 w-4 text-orange-500"
              />
              <Date dateString={date} />
            </div>
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

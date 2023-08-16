import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating } from '@mui/material'
import UserAvatar from 'components/User/UserAvatar'
import { formatDistanceToNow } from 'date-fns'
import { getClient as getuserClient } from 'lib/sanity.client'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import BlankUser from 'public/images/blank-user-image.png'
import { useEffect, useState } from 'react'

import ReviewPopup from './ReviewPopup'

type user = {
  name: string
  image: any
  email: string
  _id: string
}

function ReviewSection({ business }) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [review, setReview] = useState({ review: business.reviews })
  const { data: session } = useSession()
  const [user, setUser] = useState<user>({
    name: '',
    image:
      'https://cdn.sanity.io/images/yuy7c73l/production/08232b0e5971e6f5a4e7a6fe2f8bdd6dd472f7e7-150x151.png',
    email: '',
    _id: '',
  })

  const getUser = async (userEmail) => {
    const client = getuserClient()
    let user = await client.fetch('*[_type == "user" && email == $email][0]', {
      email: userEmail,
    })
    setUser(user)
    return user
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = session?.user?.email
        if (userEmail) {
          const userData = await getUser(userEmail)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  const formatTimeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      includeSeconds: false,
    })
  }

  return (
    <div className="mt-10">
      <section className="flex min-h-[20vh] flex-col rounded-md border p-5 shadow-xl sm:flex-row">
        <div className="flex items-center justify-center gap-4 pb-4 sm:w-2/3 sm:justify-start sm:pb-0">
          <div className=" flex flex-col gap-2 ">
            <div className="h-24 w-24 sm:h-32 sm:w-32">
              {business.logo && (
                <Image
                  src={urlForImage(business.logo).url()}
                  alt={`${business.name} Logo`}
                  width={500}
                  height={500}
                  className="rounded-full"
                />
              )}
            </div>
            <p className="text-center text-lg font-semibold">{business.name}</p>
          </div>
          <div className="h-[5rem] w-[1px] bg-gray-300 sm:h-[10rem]"></div>
          <div className="flex flex-col items-center justify-center gap-1 ">
            <p className="text-center text-lg font-bold sm:text-2xl">
              {parseFloat(business.averageRating).toFixed(2)}
            </p>
            <Rating
              name="half-rating-read"
              value={business.averageRating}
              precision={0.1}
              readOnly
            />
            <p className="text-center text-lg text-gray-500  sm:text-xl">
              {business.totalReviews}{' '}
              {business.totalReviews == 1 ? 'rating' : 'ratings'}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-wrap gap-4 ">
          <div className="flex w-full flex-col items-center justify-center gap-1 ">
            <div className="flex w-full flex-col gap-2">
              {[5, 4, 3, 2, 1].map((starCount) => {
                const ratingData = business.ratingsDistribution.find(
                  (r) => r.rating === starCount
                ) || { count: 0 }
                const widthPercentage =
                  (ratingData.count / business.totalReviews) * 100

                let barColor
                switch (starCount) {
                  case 5:
                    barColor = 'bg-green-500'
                    break
                  case 4:
                    barColor = 'bg-green-300'
                    break
                  case 3:
                    barColor = 'bg-yellow-400'
                    break
                  case 2:
                    barColor = 'bg-orange-400'
                    break
                  case 1:
                  default:
                    barColor = 'bg-red-500'
                    break
                }

                return (
                  <div key={starCount} className="flex items-center gap-2">
                    <p className="whitespace-nowrap font-semibold text-gray-500">
                      {starCount} stars:
                    </p>
                    <div className="relative h-5 w-full rounded-full bg-gray-200">
                      <div
                        style={{ width: `${widthPercentage}%` }}
                        className={`absolute left-0 h-5 ${barColor} rounded-full`}
                        title={`${starCount} star: ${ratingData.count} reviews`}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="w-full">
            <button
              className="flex w-full items-center justify-center gap-2 rounded bg-orange-500 px-5 py-2 text-xl text-white transition-all duration-300 hover:scale-[1.01] hover:bg-amber-600"
              onClick={() => setIsModalVisible(true)}
            >
              Write a review{' '}
              <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {isModalVisible && (
        <ReviewPopup
          user={user}
          session={session}
          business={business}
          setIsModalVisible={setIsModalVisible}
          setReview={setReview}
          review={review}
        />
      )}

      <div className="mt-10">
        <h3 className="mb-4 border-b pb-4 text-center text-3xl font-medium">
          Reviews & Ratings
        </h3>
        {review.review.length === 0 ? (
          <p className="py-10 text-center text-base font-normal text-gray-500 sm:text-xl">
            It doesn&apos;t look like there are any reviews at the moment. Be
            the first to review this business!
          </p>
        ) : (
          review.review
            .slice()
            .sort(
              (a, b) =>
                new Date(b._createdAt).valueOf() -
                new Date(a._createdAt).valueOf()
            )
            .map((review) => (
              <div
                key={review._id}
                className="mb-4 flex flex-row justify-between border-b pb-4"
              >
                <div className=" flex flex-row  pb-4">
                  <UserAvatar image={review.image || BlankUser} />
                  <div className="ml-2 flex flex-col items-start justify-start gap-2">
                    <div className="">
                      <p className="text-lg font-semibold capitalize">
                        {review.author}
                      </p>
                      <p className="text-sm capitalize italic text-gray-400">
                        {formatTimeAgo(review._createdAt)}
                      </p>
                    </div>
                    <p>{review.text}</p>
                  </div>
                </div>
                <div>
                  <Rating
                    name="half-rating-read"
                    value={review.rating}
                    precision={0.5}
                    readOnly
                  />
                  <p className="text-end text-gray-400">
                    {review.rating} Stars
                  </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

export default ReviewSection

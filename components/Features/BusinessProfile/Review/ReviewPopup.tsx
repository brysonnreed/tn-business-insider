import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'
import {
  faCheckCircle,
  faPaperPlane,
  faPenToSquare,
  faX,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UserAvatar from 'components/Features/User/UserAvatar'
import { motion } from 'framer-motion'
import { validateAndSanitizeInput } from 'lib/sanitizeUserInput'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import BlankUser from 'public/images/blank-user-image.png'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import styles from 'styles/Form.module.css'

function ReviewPopup({
  user,
  session,
  business,
  setIsModalVisible,
  setReview,
  review,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [ratingError, setRatingError] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [userErr, setUserErr] = useState('')

  const handleStarClick = (index) => {
    setRating(index)
    setRatingError(false)
  }

  const handleStarHover = (index) => {
    setHoverRating(index)
    setRatingError(false)
  }

  const handleStarHoverLeave = () => {
    setHoverRating(0)
  }

  const notifySuccess = () =>
    toast.success('Review successfully added!', {
      icon: (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="h-6 w-6 text-green-500"
        />
      ),
    })
  const notifyError = () => toast.error('Failed to add review')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    if (rating === 0) {
      toast.error('Please select a rating')
      setRatingError(true)
      return // Prevent form submission
    }
    // Call API route to submit the review
    const formData = {
      text: data.text,
      rating: rating,
      business: business._id,
      author: user.name,
      email: user.email,
      image: user.image || '',
    }

    try {
      const response = await fetch('/api/review', {
        method: 'POST',

        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      } else {
        notifySuccess()
        reset()
        setIsModalVisible(false)
        setIsLoading(false)
        setReview((prevReview) => ({
          ...prevReview,
          review: [
            ...prevReview.review,
            {
              ...data,
              _createdAt: new Date().toISOString(),
              image:
                user.image ||
                session.image ||
                'https://cdn.sanity.io/images/yuy7c73l/production/08232b0e5971e6f5a4e7a6fe2f8bdd6dd472f7e7-150x151.png',
              author: user.name,
            },
          ],
        }))
      }
    } catch (error) {
      notifyError()
      console.error('There was an error submitting the review:', error)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    setValue('rating', rating)
  }, [rating, setValue])

  const handleUserErr = () => {
    if (!session) {
      setUserErr('You need to be logged in to comment')
      toast.error('You need to be logged in to comment')
    } else {
      setUserErr('')
    }
  }
  return (
    <motion.div
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative z-50 mx-4 w-full sm:mx-0 sm:w-2/3 lg:w-1/2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-md bg-white shadow-xl"
        >
          <div className="flex items-start justify-start gap-4 rounded-t bg-orange-500 p-5 text-white">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="mt-2 h-5 w-5 sm:h-7 sm:w-7"
            />
            <div>
              <p className="text-xl sm:text-3xl">Rate and Review</p>
              <p className="text-lg font-thin sm:text-xl">{business.name}</p>
            </div>
          </div>
          <div className="mb-5 flex flex-col gap-4 px-5">
            <div className="flex flex-col gap-4">
              {session && user && (
                <div className="flex gap-4">
                  <UserAvatar image={user ? user.image : BlankUser} />
                  <div>
                    <p className="text-xl">{user.name}</p>
                    <p className="text-gray-400">
                      Your review will be posted publicly
                    </p>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={
                        (hoverRating || rating) > index
                          ? solidStar
                          : regularStar
                      }
                      onClick={() => {
                        handleStarClick(index + 1)
                        setRatingError(false) // Reset the error when a star is clicked
                      }}
                      onMouseEnter={() => handleStarHover(index + 1)}
                      onMouseLeave={handleStarHoverLeave}
                      color={
                        (hoverRating || rating) > index ? '#F97316' : '#cccccc'
                      }
                      className={`h-8 w-8 cursor-pointer ${
                        ratingError ? 'text-red-500' : ''
                      }`}
                    />
                  ))}
                </div>

                <div
                  className={`${styles.input_group} ${
                    errors.text?.type === 'required' ||
                    errors.text?.type == 'minLength'
                      ? 'border-rose-600'
                      : ''
                  }`}
                >
                  <textarea
                    {...register('text', {
                      required: true,
                      validate: validateAndSanitizeInput,
                    })}
                    aria-invalid={errors.description ? 'true' : 'false'}
                    className={styles.input_text}
                    placeholder="Describe your experience"
                    rows={6}
                    maxLength={1200}
                  />
                </div>
              </div>
            </div>

            {/* TODO: Rating should be a star system */}
            <label>
              <input
                type="hidden"
                {...register('rating', { required: true })}
                value={rating}
              />
            </label>

            {session && (
              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-orange-500 px-5 py-2 text-xl text-white transition-all duration-300 hover:scale-[1.01] hover:bg-amber-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <>
                    Submit{' '}
                    <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                  </>
                )}
              </button>
            )}

            {!session && (
              <>
                <button
                  type="button"
                  onClick={handleUserErr}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-orange-500 px-5 py-2 text-xl text-white transition-all duration-300 hover:scale-[1.01] hover:bg-amber-600"
                >
                  Submit{' '}
                  <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                </button>
                {userErr !== '' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-400"
                  >
                    {' '}
                    Have a account or want to create one?{' '}
                    <button
                      onClick={() => signIn()}
                      className="text-blue-400 transition-all duration-200 hover:underline"
                    >
                      Sign-in
                    </button>{' '}
                    /{' '}
                    <Link
                      href={`/account/register`}
                      className="text-blue-400 transition-all duration-200 hover:underline"
                    >
                      Sign up
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </form>
        <button
          className="absolute right-0 top-0 m-4 text-white"
          onClick={() => setIsModalVisible(false)}
        >
          <FontAwesomeIcon icon={faX} className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}

export default ReviewPopup

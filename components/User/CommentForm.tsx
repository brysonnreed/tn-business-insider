import { faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import BlankUser from 'public/images/blank-user-image.png'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import UserAvatar from './UserAvatar'

type Inputs = {
  _id: string
  name: string
  email: string
  comment: string
  image: any
}

function CommentForm({ post: initialPost }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userErr, setUserErr] = useState('')
  const [hideForm, setHideForm] = useState(false)
  const [post, setPost] = useState(initialPost)

  const formatTimeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      includeSeconds: false,
    })
  }

  const notifySuccess = () =>
    toast.success('Comment successfully added!', {
      icon: (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="h-6 w-6 text-green-500"
        />
      ),
    })
  const notifyError = () => toast.error('Failed to add comment')

  if (errors.comment?.type === 'required') {
    toast.error('Please enter a comment.')
  }
  // On submit function for Form
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true)

    const { user } = session
    data.name = user.name
    data.email = user.email
    data.image = user.image || ''

    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true)
        notifySuccess()
        reset()
        setHideForm(true)
        setPost((prevPost) => ({
          ...prevPost,
          comments: [
            ...prevPost.comments,
            { ...data, _createdAt: new Date().toISOString() },
          ],
        }))
      })
      .catch((err) => {
        setSubmitted(false)
        notifyError()
        setHideForm(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  useEffect(() => {
    if (submitted) {
      setIsLoading(false)
      setSubmitted(false)
    }
  }, [submitted])

  const { data: session } = useSession()

  const handleUserErr = () => {
    if (!session) {
      setUserErr('You need to be logged in to comment')
      toast.error('You need to be logged in to comment')
    } else {
      setUserErr('')
    }
  }

  return (
    <section className="-mt-16">
      {hideForm == true ? (
        <p className="flex flex-col rounded bg-orange-500 py-8 text-center text-xl font-medium text-white shadow-2xl sm:text-3xl">
          Thank you for sharing your comment!
          <span className="mt-1 text-xl font-normal">
            Your comment will appear below!
          </span>
        </p>
      ) : (
        <div>
          <div className=" mb-5 flex flex-col leading-8">
            <p className="text-2xl font-semibold text-orange-500 sm:text-3xl">
              Enjoyed this Post?
            </p>
            <p className="text-5xl font-bold text-black sm:text-6xl">
              Leave a comment
            </p>
          </div>
          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <input
            {...register('name')}
            type="hidden"
            name="name"
            value={session?.user?.name || ''}
          />
          <input
            {...register('email')}
            type="hidden"
            name="email"
            value={session?.user?.email || ''}
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="flex flex-col gap-5">
              <div className="flex flex-col">
                <textarea
                  {...register('comment', { required: true })}
                  aria-invalid={errors.comment ? 'true' : 'false'}
                  className="rounded-md border-b border-slate-400 bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
                  placeholder="Enter your comment"
                  rows={8}
                />
                {/* {errors.comment?.type === 'required' &&
                  toast.error('Please enter a comment.')} */}
              </div>
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
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </form>

          {!session && (
            <>
              <button
                onClick={handleUserErr}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-orange-500 px-5 py-2 text-xl text-white transition-all duration-300 hover:scale-[1.01] hover:bg-amber-600"
              >
                Submit{' '}
                <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
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
      )}

      <div className="mt-10">
        <h3 className="mb-4 border-b pb-4 text-center text-3xl font-medium">
          Comments
        </h3>
        {post.comments.length === 0 ? (
          <p className="py-10 text-center text-base font-normal text-gray-500 sm:text-xl">
            It doesn&apos;t look like there are any comments at the moment. Be
            the first to comment!
          </p>
        ) : (
          post.comments
            .slice()
            .sort(
              (a, b) =>
                new Date(b._createdAt).valueOf() -
                new Date(a._createdAt).valueOf()
            )
            .map((comment) => (
              <div
                key={comment._id}
                className="mb-4 flex flex-row border-b pb-4"
              >
                <UserAvatar image={comment.image || BlankUser} />
                <div className="ml-2 flex flex-col items-start justify-start gap-2">
                  <div className="">
                    <p className="text-lg font-semibold capitalize">
                      {comment.name}
                    </p>
                    <p className="text-sm capitalize italic text-gray-400">
                      {formatTimeAgo(comment._createdAt)}
                    </p>
                  </div>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))
        )}
      </div>
    </section>
  )
}

export default CommentForm

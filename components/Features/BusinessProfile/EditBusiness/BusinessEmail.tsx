import { faAt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { emailRegex } from 'lib/sanitizeUserInput'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import styles from 'styles/Form.module.css'

type EmailFormData = {
  email: string
}

function BusinessEmail({ business }) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<EmailFormData>()

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const businessId = business._id

  const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
    try {
      setIsLoading(true)
      console.log(data.email)

      const response = await fetch('/api/handleBusinessUpdate', {
        method: 'POST',
        body: JSON.stringify({ email: data.email, businessId }),
      })
      if (!response.ok) {
        throw new Error('Failed to add Business')
      } else {
        notifySuccess()
        reset()
        setTimeout(() => {
          window.location.reload()
        }, 3000) // 3000 milliseconds (i.e., 3 seconds)
      }
    } catch (error) {
      setSubmitted(false)
      notifyError()
      console.log('Error updating business: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (business && business.email) {
      setValue('email', business.email)
    }
  }, [business, setValue])

  const notifySuccess = () =>
    toast.success('Business was successfully updated!', {
      icon: (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="h-6 w-6 text-green-500"
        />
      ),
    })
  const notifyError = () => toast.error('Failed to update Business')
  return (
    <motion.div
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
        <h1 className="text-xl font-semibold text-orange-500 sm:text-2xl">
          Want us to send you Leads?
        </h1>
        <p className="text-4xl font-bold capitalize text-black sm:text-5xl">
          We can do that.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 py-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-3">
          <div>
            <p className="pb-2">
              Enter the email Address that you would like us to send your leads
              to and we&apos;ll handle the rest for you.
            </p>
            <div
              className={`${styles.input_group} ${
                errors.email?.type === 'required' ? 'border-rose-600' : ''
              }`}
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input_text}
                {...register('email', {
                  required: true,
                  pattern: emailRegex,
                })}
              />
              <span className=" flex items-center px-3">
                <FontAwesomeIcon icon={faAt} className="h-4 w-4" />
              </span>
            </div>

            {errors.email?.type === 'pattern' && (
              <p className="text-red-500">
                Please enter a valid email address.
              </p>
            )}
          </div>
        </div>

        <div className=" border-gray-300 ">
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            type="submit"
            className={styles.button}
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? `Loading...` : 'Update Information'}
          </motion.button>
        </div>
      </form>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between rounded-md border p-2 shadow-xl sm:p-5">
          <div>
            <p className="text-xl font-bold">17</p>
            <p className="text-gray-400">Emails Sent</p>
          </div>
          <div className="rounded-sm bg-green-600/70 p-2 text-white sm:p-4">
            +8%
          </div>
        </div>
        <div className="flex items-center justify-between rounded-md border p-2 shadow-xl sm:p-5">
          <div>
            <p className="text-xl font-bold">52</p>
            <p className="text-gray-400">Website Clicks</p>
          </div>
          <div className="rounded-sm bg-green-600/70 p-2 text-white sm:p-4">
            +12%
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BusinessEmail

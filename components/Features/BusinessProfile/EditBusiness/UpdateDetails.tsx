import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import AmenitiesSection from '../BusinessFormComponents/AmenitiesSection'
import CategorySection from '../BusinessFormComponents/CategorySection'
import ServiceSection from '../BusinessFormComponents/ServiceSection'
import WebsiteSection from '../BusinessFormComponents/WebsiteSection'

type BusinessFormData = {
  category: string
  services: string[]
  amenities: string[]
  website: string
}

function UpdateDetails({ business, categories }) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<BusinessFormData>()

  const businessId = business._id

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<BusinessFormData> = async (data) => {
    if (!data.category) {
      toast.error('Category is required.')
    } else {
      try {
        setIsLoading(true)

        const getChangedFields = (original, newData) => {
          return Object.keys(newData).reduce((acc, key) => {
            if (typeof newData[key] === 'object' && newData[key] !== null) {
              if (Array.isArray(newData[key])) {
                if (!_.isEqual(original[key], newData[key])) {
                  // lodash's isEqual function to compare arrays
                  acc[key] = newData[key]
                }
              } else {
                const nestedChanges = getChangedFields(
                  original[key] || {},
                  newData[key]
                )
                if (Object.keys(nestedChanges).length > 0) {
                  acc[key] = nestedChanges
                }
              }
            } else if (original[key] !== newData[key]) {
              acc[key] = newData[key]
            }
            return acc
          }, {})
        }

        const changedFields = getChangedFields(business, data)

        const formData = {
          changes: changedFields,
          businessId,
        }
        const response = await fetch('/api/handleBusinessUpdate', {
          method: 'POST',
          body: JSON.stringify(formData),
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
  }
  useEffect(() => {
    if (submitted) {
      setIsLoading(false)
      setSubmitted(false)
    }
  }, [submitted])

  useEffect(() => {
    if (business && business.website) {
      setValue('website', business.website)
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
    <motion.form
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <CategorySection
        setValue={setValue}
        categories={categories}
        business={business}
      />

      <ServiceSection setValue={setValue} business={business} />
      <AmenitiesSection setValue={setValue} business={business} />

      <WebsiteSection register={register} errors={errors} />

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 rounded bg-orange-500 py-2 text-xl font-light text-white transition-all duration-200 hover:bg-orange-600"
      >
        {isLoading ? 'Loading...' : 'Submit'}{' '}
        <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
      </button>
    </motion.form>
  )
}

export default UpdateDetails

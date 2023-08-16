import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { uploadImageToSanity } from 'lib/sanity.client.cdn'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import DescriptionSection from '../BusinessFormComponents/DescriptionSection'
import LogoSection from '../BusinessFormComponents/LogoSection'
import NameSection from '../BusinessFormComponents/NameSection'

type BusinessFormData = {
  name: string
  logo: File
  description: string
}

function UpdateBasicDetails({ business }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BusinessFormData>()

  const businessId = business._id
  const oldImage = business.logo
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (errors.name?.type === 'required') {
    toast.error('Please enter a Business Name.')
  } else if (errors.description?.type === 'required') {
    toast.error('Please enter a Business Description.')
  }

  const onSubmit: SubmitHandler<BusinessFormData> = async (data) => {
    if (!data.logo) {
      toast.error('Logo is required')
    } else {
      try {
        data.description = data.description.replace(/\n/g, ' ')
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

        const logoId =
          data.logo && data.logo && data.logo instanceof File
            ? await uploadImageToSanity(data.logo)
            : null

        const formData = {
          changes: changedFields,
          logo: logoId,
          oldImage,
          businessId,
        }
        const response = await fetch('/api/handleBusinessUpdate', {
          method: 'POST',
          body: JSON.stringify(formData),
        })
        if (!response.ok) {
          throw new Error('Failed to update Business')
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

  useEffect(() => {
    if (business && business.name) {
      setValue('name', business.name)
    }
    if (business && business.description) {
      setValue('description', business.description)
    }
  }, [business, setValue])

  return (
    <motion.form
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <NameSection register={register} errors={errors} />
      <LogoSection
        setValue={setValue}
        title={'Business Logo'}
        user={null}
        required={true}
        business={business}
      />

      <DescriptionSection register={register} errors={errors} />

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

export default UpdateBasicDetails

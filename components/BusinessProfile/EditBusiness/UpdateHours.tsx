import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import BusinessHoursSection from '../BusinessFormComponents/BusinessHoursSection '

type BusinessFormData = {
  openAllDay: boolean
  hours: {
    [key: string]: {
      isOpen: boolean
      open?: string
      close?: string
    }
  }
}
function UpdateHours({ business }) {
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

      const formData = {
        changes: data,
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
  useEffect(() => {
    if (submitted) {
      setIsLoading(false)
      setSubmitted(false)
    }
  }, [submitted])

  const [businessHours, setBusinessHours] = useState({})
  const [open247, setOpen247] = useState(false)

  const handleHoursChange = (day, field, value) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [field]: value,
      },
    })
  }

  const handleIsOpenChange = (day, value) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        isOpen: value,
        open: value ? '9:00 AM' : '',
        close: value ? '5:00 PM' : '',
      },
    })
  }

  useEffect(() => {
    if (business && business.hours) {
      const updatedBusinessHours = {}

      for (const day in business.hours) {
        const dayInfo = business.hours[day]

        if (dayInfo.isOpen) {
          updatedBusinessHours[day] = {
            isOpen: true,
            open: dayInfo.hours?.open,
            close: dayInfo.hours?.close,
          }
        } else {
          updatedBusinessHours[day] = {
            isOpen: false,
          }
        }
      }

      setBusinessHours(updatedBusinessHours)
    }
  }, [business])

  useEffect(() => {
    setValue('openAllDay', open247)
  }, [open247, setValue])

  useEffect(() => {
    setValue('hours', businessHours)
  }, [businessHours, setValue])

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
      <BusinessHoursSection
        open247={open247}
        setOpen247={setOpen247}
        businessHours={businessHours}
        handleHoursChange={handleHoursChange}
        handleIsOpenChange={handleIsOpenChange}
      />

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

export default UpdateHours

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import BusinessHoursSection from '../BusinessFormComponents/BusinessHoursSection '

function CreateHours({ onSubmit, defaultValues }) {
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
        open: value ? '09:00 AM' : '',
        close: value ? '05:00 PM' : '',
      },
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const internalSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      onSubmit(data)
    }
  }
  useEffect(() => {
    if (defaultValues.hours) {
      const updatedBusinessHours = {}

      for (const day in defaultValues.hours) {
        const dayInfo = defaultValues.hours[day]

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
  }, [defaultValues, setBusinessHours])

  useEffect(() => {
    setValue('openAllDay', open247)
  }, [open247, setValue])

  useEffect(() => {
    setValue('hours', businessHours)
  }, [businessHours, setValue])

  return (
    <>
      <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
        <p className="text-3xl font-bold capitalize text-black sm:text-4xl">
          When are you open?
        </p>
      </div>
      <motion.form
        layout
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(internalSubmit)}
      >
        <BusinessHoursSection setValue={setValue} business={null} />
        <button type="submit">Next</button>
      </motion.form>
    </>
  )
}

export default CreateHours

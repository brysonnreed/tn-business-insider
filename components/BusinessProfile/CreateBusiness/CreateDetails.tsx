import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import AmenitiesSection from '../BusinessFormComponents/AmenitiesSection'
import CategorySection from '../BusinessFormComponents/CategorySection'
import ServiceSection from '../BusinessFormComponents/ServiceSection'
import WebsiteSection from '../BusinessFormComponents/WebsiteSection'

function CreateDetails({ onSubmit, defaultValues, categories }) {
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
    if (defaultValues.category) {
      setValue('category', defaultValues.category)
    }
    if (defaultValues.services) {
      setValue('services', defaultValues.services)
    }
    if (defaultValues.amenities) {
      setValue('amenities', defaultValues.amenities)
    }
    if (defaultValues.website) {
      setValue('website', defaultValues.website)
    }
  }, [defaultValues, setValue])

  return (
    <>
      <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
        <p className="text-3xl font-bold capitalize text-black sm:text-4xl">
          Additional information
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
        <CategorySection
          setValue={setValue}
          categories={categories}
          business={null}
          defaultCategory={defaultValues.category}
        />

        <ServiceSection
          setValue={setValue}
          business={null}
          defaultService={defaultValues.services}
        />
        <AmenitiesSection
          setValue={setValue}
          business={null}
          defaultAmenities={defaultValues.amenities}
        />

        <WebsiteSection register={register} errors={errors} />
        <button type="submit">Next</button>
      </motion.form>
    </>
  )
}

export default CreateDetails

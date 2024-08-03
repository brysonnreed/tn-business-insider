import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import CitySection from '../BusinessFormComponents/CitySection'
import MapSection from '../BusinessFormComponents/MapSection'

function CreateAddress({ cities, onSubmit, defaultValues }) {
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
    if (defaultValues.city) {
      setValue('city', defaultValues.city)
    }
    if (defaultValues.address) {
      setValue('address', defaultValues.address)
    }
  }, [defaultValues, setValue])
  return (
    <>
      <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
        <p className="text-3xl font-bold capitalize text-black sm:text-4xl">
          {` Where is ${
            defaultValues.name ? defaultValues.name : 'your business'
          } located?`}
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
        <CitySection cities={cities} setValue={setValue} business={null} />
        <MapSection
          register={register}
          setValue={setValue}
          errors={errors}
          business={null}
        />
        <button type="submit">Next</button>
      </motion.form>
    </>
  )
}

export default CreateAddress

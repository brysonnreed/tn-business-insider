import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import DescriptionSection from '../BusinessFormComponents/DescriptionSection'
import LogoSection from '../BusinessFormComponents/LogoSection'
import NameSection from '../BusinessFormComponents/NameSection'

function CreateBasicDetails({ onSubmit, defaultValues }) {
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
    if (defaultValues.name) {
      setValue('name', defaultValues.name)
    }
    if (defaultValues.description) {
      setValue('description', defaultValues.description)
    }
    if (defaultValues.logo) {
      setValue('logo', defaultValues.logo)
    }
  }, [defaultValues, setValue])

  return (
    <>
      <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
        <h1 className="text-2xl font-semibold text-orange-500 sm:text-3xl">
          Interested in growing your business?
        </h1>
        <p className="text-3xl font-bold capitalize text-black sm:text-4xl">
          Lets start with the basics
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
        <NameSection register={register} errors={errors} />
        <LogoSection
          setValue={setValue}
          title={'Business Logo'}
          user={null}
          required={true}
          business={null}
        />

        <DescriptionSection register={register} errors={errors} />
        <button type="submit">Next</button>
      </motion.form>
    </>
  )
}

export default CreateBasicDetails

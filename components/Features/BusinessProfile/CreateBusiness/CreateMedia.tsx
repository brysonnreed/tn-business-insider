import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import ImageGallerySection from '../BusinessFormComponents/ImageGallerySection'
import SocialMediaSection from '../BusinessFormComponents/SocialMediaSection'

function CreateMedia({ socials, defaultValues, onSubmit }) {
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
    console.log(data)
  }
  useEffect(() => {
    if (defaultValues.images) {
      setValue('images', defaultValues.images)
    }
    if (defaultValues.socialMedia) {
      setValue('socialMedia', defaultValues.socialMedia)
    }
  }, [defaultValues, setValue])

  return (
    <>
      <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
        <p className="text-3xl font-bold capitalize text-black sm:text-4xl">
          Any media you want to promote?
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
        <ImageGallerySection
          setValue={setValue}
          business={null}
          setRemovedImages={null}
        />

        <SocialMediaSection
          socials={socials}
          register={register}
          setValue={setValue}
          business={null}
          errors={errors}
        />

        <button type="submit">Next</button>
      </motion.form>
    </>
  )
}

export default CreateMedia

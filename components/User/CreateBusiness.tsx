import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddressSection from 'components/BusinessProfile/BusinessFormComponents/AddressSection'
import { uploadImageToSanity } from 'lib/sanity.client.cdn'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import AmenitiesSection from '../BusinessProfile/BusinessFormComponents/AmenitiesSection'
import BusinessHoursSection from '../BusinessProfile/BusinessFormComponents/BusinessHoursSection '
import CategorySection from '../BusinessProfile/BusinessFormComponents/CategorySection'
import CitySection from '../BusinessProfile/BusinessFormComponents/CitySection'
import DescriptionSection from '../BusinessProfile/BusinessFormComponents/DescriptionSection'
import ImageGallerySection from '../BusinessProfile/BusinessFormComponents/ImageGallerySection'
import LogoSection from '../BusinessProfile/BusinessFormComponents/LogoSection'
import MapSection from '../BusinessProfile/BusinessFormComponents/MapSection'
import NameSection from '../BusinessProfile/BusinessFormComponents/NameSection'
import ServiceSection from '../BusinessProfile/BusinessFormComponents/ServiceSection'
import SocialMediaSection from '../BusinessProfile/BusinessFormComponents/SocialMediaSection'
import WebsiteSection from '../BusinessProfile/BusinessFormComponents/WebsiteSection'

type SocialMediaData = {
  platform: string
  url: string
}

type BusinessFormData = {
  name: string
  logo: File
  city: string
  description: string
  category: string
  services: string[]
  // images: FileList
  images: { image: File; source: string }[]
  amenities: string[]
  address: string
  mapLocationUrl: string
  openAllDay: boolean
  hours: {
    [key: string]: {
      isOpen: boolean
      open?: string
      close?: string
    }
  }
  website: string
  socialMedia: SocialMediaData[]
}

export default function CreateBusiness({
  cities,
  categories,
  socials,
  session,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    control,
    setError,
    clearErrors,
    trigger,
    formState: { errors, isValid },
  } = useForm<BusinessFormData>({ mode: 'all' })

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<BusinessFormData> = async (data) => {
    // if (!data.logo && !data.city && !data.category) {
    //   toast.error('Make sure all required fields are filled.')
    // } else if (!data.logo) {
    //   toast.error('Logo is required')
    // } else if (!data.city) {
    //   toast.error('City is required.')
    // } else if (!data.category) {
    //   toast.error('Category is required.')
    // } else {
    try {
      console.log('data: ', data)

      setIsLoading(true)
      // Upload the logo and images to Sanity and get the URLs
      const logoId = data.logo ? await uploadImageToSanity(data.logo) : null
      // const imageIds = data.images
      //   ? await Promise.all(Array.from(data.images).map(uploadImageToSanity))
      //   : []
      const imageIds = data.images
        ? await Promise.all(
            data.images.map((img) => uploadImageToSanity(img.image))
          )
        : []

      const formData = {
        ...data,
        logo: logoId,
        images: imageIds,
        user: session?.user.email,
      }

      const response = await fetch('/api/handleBusinessCreation', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to add Business')
      }
      setSubmitted(true)
      notifySuccess()
      reset()
    } catch (error) {
      setSubmitted(false)
      notifyError()
      console.log('Error uploading business: ', error)
    } finally {
      setIsLoading(false)
    }
    // }
  }
  useEffect(() => {
    if (submitted) {
      setIsLoading(false)
      setSubmitted(false)
    }
  }, [submitted])

  const notifySuccess = () =>
    toast.success('Business was successfully added!', {
      icon: (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="h-6 w-6 text-green-500"
        />
      ),
    })
  const notifyError = () => toast.error('Failed to add Business')

  const [formStep, setFormStep] = useState(0)
  const CITY_FORM_STEP = 1
  const CATEGORY_FORM_STEP = 2
  // const completeFormStep = () => {
  //   if (formStep === CITY_FORM_STEP) {
  //     // Assuming CITY_FORM_STEP is a constant representing the step number for the city form
  //     const watchedCity = watch('city')

  //     if (!watchedCity) {
  //       setError('city', {
  //         type: 'manual',
  //         message: 'Please select a city from the dropdown',
  //       })
  //       toast.error('Please select a valid city before proceeding.')
  //       console.log(errors)
  //       return
  //     } else {
  //       clearErrors('city')
  //     }
  //   }

  //   if (isValid) {
  //     setFormStep((cur) => cur + 1)
  //   } else {
  //     console.log('errors: ', errors)
  //     toast.error('Make sure to fill out required fields')
  //   }
  // }
  const completeFormStep = async () => {
    // <-- make the function async
    if (formStep === CITY_FORM_STEP) {
      const watchedCity = watch('city')

      if (!watchedCity) {
        setError('city', {
          type: 'manual',
          message: 'Please select a city from the dropdown',
        })
        toast.error('Please select a valid city before proceeding.')
        return
      } else {
        clearErrors('city')
      }
    }
    if (formStep === CATEGORY_FORM_STEP) {
      const watchedCity = watch('category')

      if (!watchedCity) {
        setError('category', {
          type: 'manual',
          message: 'Please select a category from the dropdown',
        })
        console.log(errors)
        toast.error('Please select a valid category before proceeding.')
        return
      } else {
        clearErrors('category')
      }
    }

    // Manually trigger validation
    const isCurrentlyValid = await trigger() // <-- note the await keyword

    if (isCurrentlyValid) {
      setFormStep((cur) => cur + 1)
    } else {
      console.log('errors: ', errors)
      toast.error('Make sure to fill out required fields')
    }
  }
  const goToPreviousStep = () => {
    if (formStep !== 0) {
      setFormStep((cur) => cur - 1)
    }
  }
  const renderButton = () => {
    if (formStep > 4) {
      return undefined
    } else if (formStep === 4) {
      return (
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded bg-orange-500 py-2 text-xl font-light text-white transition-all duration-200 hover:bg-orange-600"
        >
          {isLoading ? 'Loading...' : 'Submit'}{' '}
          <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
        </button>
      )
    } else {
      return (
        <button
          type="button"
          onClick={completeFormStep}
          className="flex items-center justify-center gap-2 rounded bg-orange-500 py-2 text-xl font-light text-white transition-all duration-200 hover:bg-orange-600"
        >
          Next
          <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
        </button>
      )
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {formStep !== 0 && (
        <div className="flex  ">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-orange-500"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Go back
          </button>
        </div>
      )}
      {formStep >= 0 && (
        <section className={formStep === 0 ? 'block' : 'hidden'}>
          <NameSection register={register} errors={errors} />

          <LogoSection
            setValue={setValue}
            title={'Business Logo'}
            user={null}
            required={false}
            business={null}
          />
          <DescriptionSection register={register} errors={errors} />
        </section>
      )}
      {formStep >= 1 && (
        <section className={formStep === 1 ? 'block' : 'hidden'}>
          <AddressSection
            cities={cities}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            Controller={Controller}
            clearErrors={clearErrors}
            business={null}
            getValue={getValues}
          />

          {/* <CitySection cities={cities} setValue={setValue} business={null} />
          {errors.city && (
            <div className="mt-2 flex items-center gap-2">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="h-4 w-4 text-red-500"
              />
              <p className="text-sm text-red-500">Select a city the list</p>
            </div>
          )}
          <MapSection
            register={register}
            setValue={setValue}
            errors={errors}
            business={null}
          /> */}
        </section>
      )}
      {formStep >= 2 && (
        <section className={formStep === 2 ? 'block' : 'hidden'}>
          <CategorySection
            setValue={setValue}
            categories={categories}
            business={null}
          />
          {errors.category && (
            <span className="text-red-600">{errors.category.message}</span>
          )}
          <ServiceSection setValue={setValue} business={null} />
          <AmenitiesSection setValue={setValue} business={null} />
          <WebsiteSection register={register} errors={errors} />
        </section>
      )}
      {formStep >= 3 && (
        <section className={formStep === 3 ? 'block' : 'hidden'}>
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
        </section>
      )}
      {formStep >= 4 && (
        <section className={formStep === 4 ? 'block' : 'hidden'}>
          <BusinessHoursSection setValue={setValue} business={null} />
        </section>
      )}
      {renderButton()}
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </form>

    //   <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
    //   <NameSection register={register} errors={errors} />
    //   <LogoSection
    //     setValue={setValue}
    //     title={'Business Logo'}
    //     user={null}
    //     required={true}
    //     business={null}
    //     defaultLogo={null}
    //   />

    //   <DescriptionSection register={register} errors={errors} />

    //   <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
    //     <CitySection
    //       cities={cities}
    //       setValue={setValue}
    //       business={null}
    //       defaultCity={null}
    //     />

    //     <CategorySection
    //       setValue={setValue}
    //       categories={categories}
    //       business={null}
    //       defaultCategory={null}
    //     />
    //   </div>
    //   <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
    //     <ServiceSection
    //       setValue={setValue}
    //       business={null}
    //       defaultService={null}
    //     />
    //     <AmenitiesSection
    //       setValue={setValue}
    //       business={null}
    //       defaultAmenities={null}
    //     />
    //   </div>
    //   <ImageGallerySection
    //     setValue={setValue}
    //     business={null}
    //     setRemovedImages={null}
    //     defaultImages={null}
    //   />
    //   <SocialMediaSection
    //     socials={socials}
    //     register={register}
    //     setValue={setValue}
    //     business={null}
    //     errors={errors}
    //     defaultSocials={null}
    //   />
    //   <MapSection
    //     register={register}
    //     setValue={setValue}
    //     errors={errors}
    //     business={null}
    //     defaultAddress={null}
    //   />
    //   <BusinessHoursSection
    //     open247={open247}
    //     setOpen247={setOpen247}
    //     businessHours={businessHours}
    //     handleHoursChange={handleHoursChange}
    //     handleIsOpenChange={handleIsOpenChange}
    //   />

    //   <WebsiteSection register={register} errors={errors} />
    //   <button
    //     type="submit"
    //     disabled={isLoading}
    //     className="flex items-center justify-center gap-2 rounded bg-orange-500 py-2 text-xl font-light text-white transition-all duration-200 hover:bg-orange-600"
    //   >
    //     {isLoading ? 'Loading...' : 'Submit'}{' '}
    //     <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
    //   </button>
    // </form>
  )
}

import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { uploadImageToSanity } from 'lib/uploadSanityImages'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
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

export default function CreateBusiness({ cities, categories, socials }) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<BusinessFormData>()

  const { data: session } = useSession()

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (errors.name?.type === 'required') {
    toast.error('Please enter a Business Name.')
  } else if (errors.description?.type === 'required') {
    toast.error('Please enter a Business Description.')
  } else if (errors.address?.type === 'required') {
    toast.error('Select a Business Address.')
  }

  const onSubmit: SubmitHandler<BusinessFormData> = async (data) => {
    if (!data.logo && !data.city && !data.category) {
      toast.error('Make sure all required fields are filled.')
    } else if (!data.logo) {
      toast.error('Logo is required')
    } else if (!data.city) {
      toast.error('City is required.')
    } else if (!data.category) {
      toast.error('Category is required.')
    } else {
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
          logo: logoId._id,
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
        open: value ? '09:00 AM' : '',
        close: value ? '05:00 PM' : '',
      },
    })
  }

  useEffect(() => {
    setValue('openAllDay', open247)
  }, [open247, setValue])

  useEffect(() => {
    setValue('hours', businessHours)
  }, [businessHours, setValue])

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Business Name */}

      <NameSection register={register} errors={errors} />
      {/* Logo Image */}
      <LogoSection
        setValue={setValue}
        title={'Business Logo'}
        user={null}
        required={true}
        business={null}
      />
      {/* Description */}

      <DescriptionSection register={register} errors={errors} />
      <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
        {/* City */}
        <CitySection cities={cities} setValue={setValue} business={null} />

        {/* Category */}
        <CategorySection
          setValue={setValue}
          categories={categories}
          business={null}
        />
      </div>
      {/* Services & Amenities */}
      <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
        <ServiceSection setValue={setValue} business={null} />
        <AmenitiesSection setValue={setValue} business={null} />
      </div>
      {/* Image Gallery */}
      <ImageGallerySection
        setValue={setValue}
        business={null}
        setRemovedImages={null}
      />
      {/* Social Media */}
      <SocialMediaSection
        socials={socials}
        register={register}
        setValue={setValue}
        business={null}
        errors={errors}
      />
      {/* Address */}
      <MapSection
        register={register}
        setValue={setValue}
        errors={errors}
        business={null}
      />
      {/* Business Hours */}
      <BusinessHoursSection
        open247={open247}
        setOpen247={setOpen247}
        businessHours={businessHours}
        handleHoursChange={handleHoursChange}
        handleIsOpenChange={handleIsOpenChange}
      />

      <WebsiteSection register={register} errors={errors} />
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 rounded bg-orange-500 py-2 text-xl font-light text-white transition-all duration-200 hover:bg-orange-600"
      >
        {isLoading ? 'Loading...' : 'Submit'}{' '}
        <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
      </button>
    </form>
  )
}

import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { uploadImageToSanity } from 'lib/uploadSanityImages'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import AmenitiesSection from './AddFormComponents/AmenitiesSection'
import BusinessHoursSection from './AddFormComponents/BusinessHoursSection '
import CategorySection from './AddFormComponents/CategorySection'
import CitySection from './AddFormComponents/CitySection'
import ImageGallerySection from './AddFormComponents/ImageGallerySection'
import LogoSection from './AddFormComponents/LogoSection'
import MapSection from './AddFormComponents/MapSection'
import ServiceSection from './AddFormComponents/ServiceSection'
import SocialMediaSection from './AddFormComponents/SocialMediaSection'

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
  images: FileList
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
const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
// Function to generate times in 15 minute intervals
const generateTimes = (start, end) => {
  let times = []
  let current = start
  while (current < end) {
    let hour = Math.floor(current)
    let minutes = (current - hour) * 60
    let displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    let displayMinutes = minutes < 10 ? `0${minutes}` : minutes
    let ampm = hour < 12 || hour === 24 ? 'AM' : 'PM'
    let displayTime = `${displayHour}:${displayMinutes} ${ampm}`
    times.push(displayTime)
    current += 0.25 // Adding 15 mins
  }
  return times
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
        setIsLoading(true)
        // Upload the logo and images to Sanity and get the URLs
        const logoId = data.logo ? await uploadImageToSanity(data.logo) : null
        const imageIds = data.images
          ? await Promise.all(Array.from(data.images).map(uploadImageToSanity))
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

  // Generate times in 15 minute intervals from 00:00 to 24:00
  const times = generateTimes(0, 24)

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
      <label className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label>
            Business Name{' '}
            <span className="text-lg font-semibold text-red-600">*</span>
          </label>
          <input
            {...register('name', { required: true })}
            className="rounded-md border-b border-slate-400 bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
            placeholder="Business Name"
            type="text"
            aria-invalid={errors.name ? 'true' : 'false'}
          />
        </div>
      </label>
      {/* Logo Image */}
      <LogoSection
        setValue={setValue}
        title={'Business Logo'}
        user={null}
        required={true}
      />
      {/* Description */}
      <label className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label>
            Business Description
            <span className="text-lg font-semibold text-red-600"> *</span>
          </label>
          <textarea
            {...register('description', { required: true })}
            aria-invalid={errors.description ? 'true' : 'false'}
            className="rounded-md border-b border-slate-400 bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
            placeholder="Enter a description of your business"
            rows={8}
          />
        </div>
      </label>
      <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
        {/* City */}
        <CitySection cities={cities} setValue={setValue} />

        {/* Category */}
        <CategorySection setValue={setValue} categories={categories} />
      </div>
      {/* Services & Amenities */}
      <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
        <ServiceSection setValue={setValue} />
        <AmenitiesSection setValue={setValue} />
      </div>
      {/* Image Gallery */}
      <ImageGallerySection setValue={setValue} />

      {/* Social Media */}
      <SocialMediaSection
        socials={socials}
        register={register}
        setValue={setValue}
      />
      {/* Address */}
      <MapSection register={register} setValue={setValue} errors={errors} />

      {/* Business Hours */}
      <BusinessHoursSection
        open247={open247}
        setOpen247={setOpen247}
        businessHours={businessHours}
        setBusinessHours={setBusinessHours}
        handleHoursChange={handleHoursChange}
        handleIsOpenChange={handleIsOpenChange}
        times={times}
        daysOfWeek={daysOfWeek}
      />
      <label className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label>Website</label>
          <input
            {...register('website', { required: false })}
            className="rounded-md border-b border-slate-400 bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
            placeholder="Website Link"
            type="url"
          />
        </div>
      </label>

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

import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AmenitiesSection from 'components/Features/BusinessProfile/BusinessFormComponents/AmenitiesSection'
import BusinessHoursSection from 'components/Features/BusinessProfile/BusinessFormComponents/BusinessHoursSection '
import CategorySection from 'components/Features/BusinessProfile/BusinessFormComponents/CategorySection'
import CitySection from 'components/Features/BusinessProfile/BusinessFormComponents/CitySection'
import DescriptionSection from 'components/Features/BusinessProfile/BusinessFormComponents/DescriptionSection'
import ImageGallerySection from 'components/Features/BusinessProfile/BusinessFormComponents/ImageGallerySection'
import LogoSection from 'components/Features/BusinessProfile/BusinessFormComponents/LogoSection'
import MapSection from 'components/Features/BusinessProfile/BusinessFormComponents/MapSection'
import NameSection from 'components/Features/BusinessProfile/BusinessFormComponents/NameSection'
import ServiceSection from 'components/Features/BusinessProfile/BusinessFormComponents/ServiceSection'
import SocialMediaSection from 'components/Features/BusinessProfile/BusinessFormComponents/SocialMediaSection'
import WebsiteSection from 'components/Features/BusinessProfile/BusinessFormComponents/WebsiteSection'
import { uploadImageToSanity } from 'lib/sanity/sanity.client.cdn'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

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

export default function CreateBusiness({ cities, categories, socials, user }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<BusinessFormData>({ mode: 'all' })

  const router = useRouter()

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<BusinessFormData> = async (data) => {
    try {
      setIsLoading(true)
      // Upload the logo and images to Sanity and get the URLs
      const logoId = data.logo ? await uploadImageToSanity(data.logo) : null

      const imageIds = data.images
        ? await Promise.all(
            data.images.map((img) => uploadImageToSanity(img.image))
          )
        : []

      const formData = {
        ...data,
        logo: logoId,
        images: imageIds,
        user: user?.email,
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

      // Redirect after a 2-second delay
      setTimeout(() => {
        router.push('/businesses/business-management')
      }, 2000)
    }
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <NameSection register={register} errors={errors} />
        <LogoSection
          setValue={setValue}
          title={'Business Logo'}
          user={null}
          required={true}
          business={null}
        />

        <DescriptionSection register={register} errors={errors} />

        <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
          <CitySection cities={cities} setValue={setValue} business={null} />

          <CategorySection
            setValue={setValue}
            categories={categories}
            business={null}
          />
        </div>
        <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
          <ServiceSection setValue={setValue} business={null} />
          <AmenitiesSection setValue={setValue} business={null} />
        </div>
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
        <MapSection
          register={register}
          setValue={setValue}
          errors={errors}
          business={null}
        />
        <BusinessHoursSection setValue={setValue} business={null} />

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
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </>
  )
}

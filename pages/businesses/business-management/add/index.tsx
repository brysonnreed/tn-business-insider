import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BlogContainer from 'components/Blog/BlogContainer'
import CreateAddress from 'components/BusinessProfile/CreateBusiness/CreateAddress'
import CreateBasicDetails from 'components/BusinessProfile/CreateBusiness/CreateBasicDetails'
import CreateDetails from 'components/BusinessProfile/CreateBusiness/CreateDetails'
import CreateHours from 'components/BusinessProfile/CreateBusiness/CreateHours'
import CreateMedia from 'components/BusinessProfile/CreateBusiness/CreateMedia'
import PreviewBusiness from 'components/BusinessProfile/CreateBusiness/PreviewBusiness'
import CreateBusiness from 'components/User/CreateBusiness'
import {
  getAllBusinessProfileCategories,
  getAllCities,
  getSocialMedias,
} from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import { uploadImageToSanity } from 'lib/sanity.client.cdn'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { authOptions } from '../../../api/auth/[...nextauth]'

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

const BusinessManagementAddForm = ({
  cities,
  categories,
  socials,
  session,
}) => {
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   getValues,
  //   reset,
  //   formState: { errors },
  // } = useForm<BusinessFormData>()

  // const [submitted, setSubmitted] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  // const [formData, setFormData] = useState({})

  // const onSubmit: SubmitHandler<BusinessFormData> = async (data) => {
  //   console.log('data: ', data)
  //   console.log('stepData: ', formData)
  // }
  // useEffect(() => {
  //   if (submitted) {
  //     setIsLoading(false)
  //     setSubmitted(false)
  //   }
  // }, [submitted])

  // const notifySuccess = () =>
  //   toast.success('Business was successfully added!', {
  //     icon: (
  //       <FontAwesomeIcon
  //         icon={faCheckCircle}
  //         className="h-6 w-6 text-green-500"
  //       />
  //     ),
  //   })
  // const notifyError = () => toast.error('Failed to add Business')

  // const [currentStep, setCurrentStep] = useState(0)

  // const handleStepSubmit = (data) => {
  //   // Merge data
  //   setFormData({ ...formData, ...data })
  //   // Navigate to the next step
  //   setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  // }

  // const steps = [
  //   // Step 1
  //   <CreateBasicDetails
  //     onSubmit={handleStepSubmit}
  //     key={1}
  //     defaultValues={formData}
  //   />,
  //   // Step 2
  //   <CreateAddress
  //     onSubmit={handleStepSubmit}
  //     key={2}
  //     cities={cities}
  //     defaultValues={formData}
  //   />,
  //   <CreateDetails
  //     onSubmit={handleStepSubmit}
  //     key={3}
  //     categories={categories}
  //     defaultValues={formData}
  //   />,
  //   <CreateMedia
  //     onSubmit={handleStepSubmit}
  //     key={4}
  //     defaultValues={formData}
  //     socials={socials}
  //   />,
  //   <CreateHours
  //     onSubmit={handleStepSubmit}
  //     key={5}
  //     defaultValues={formData}
  //   />,
  // ]
  return (
    <>
      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          {/* {steps[currentStep]}

          
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
              type="button"
              className="flex items-center justify-center gap-2 rounded bg-orange-500 px-3 py-2 text-xl font-light text-white transition-all duration-200 hover:bg-orange-600"
            >
              Back
            </button>
            
            <div className="flex items-center justify-center">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={`mr-2 inline-block h-4 w-4 rounded-full ${
                    currentStep === index ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                ></span>
              ))}
            </div>
            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
                className="flex items-center justify-center gap-2 rounded bg-orange-500 px-3 py-2 text-xl font-light text-white transition-all duration-200 hover:bg-orange-600"
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                type="button"
                className="flex items-center justify-center gap-2 rounded bg-orange-500 px-3 py-2 text-xl font-light text-white transition-all duration-200 hover:bg-orange-600"
              >
                Next
              </button>
            )}
          </div> */}
          <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
            <h1 className="text-2xl font-semibold text-orange-500 sm:text-3xl">
              Interested in growing your business?
            </h1>
            <p className="text-5xl font-bold capitalize text-black sm:text-6xl">
              Add your Business here
            </p>
          </div>
          <div className="pt-5">
            <CreateBusiness
              cities={cities}
              categories={categories}
              socials={socials}
              session={session}
            />
          </div>
        </BlogContainer>
      </section>
    </>
  )
}

export default BusinessManagementAddForm

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    // If the session is not active, redirect to the login page with a callback URL
    const currentUrl = req.url
    const loginUrl = `/account/login?callbackUrl=${encodeURIComponent(
      currentUrl
    )}&protectedPageCallback=true`

    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    }
  }
  const client = getClient()

  try {
    const cities = await getAllCities(client)
    const categories = await getAllBusinessProfileCategories(client)
    const socials = await getSocialMedias(client)

    return {
      props: {
        cities,
        categories,
        socials,
        session,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        cities: [],
        categories: [],
        socials: [],
        session,
      },
    }
  }
}

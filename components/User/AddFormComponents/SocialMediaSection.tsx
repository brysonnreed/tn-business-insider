import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'

type SocialMediaSectionProps = {
  socials: { _id: string; platform: string }[]
  register: any
  setValue: any
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  socials,
  register,
  setValue,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const contentRef = useRef(null)
  const [socialMediaData, setSocialMediaData] = useState([])

  // Function to handle updating socialMediaData
  const handleSocialMediaChange = (platform: string, url: string) => {
    // Find the index of the platform in the current socialMediaData array
    const index = socialMediaData.findIndex(
      (item) => item.platform === platform
    )

    if (index === -1) {
      // If the platform is not found, add it to the socialMediaData array
      setSocialMediaData((prevData) => [...prevData, { platform, url }])
    } else {
      // If the platform is found, update its URL
      setSocialMediaData((prevData) => {
        const newData = [...prevData]
        newData[index].url = url
        return newData
      })
    }
  }

  useEffect(() => {
    setValue('socialMedia', socialMediaData)
  }, [socialMediaData, setValue])

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState)
  }

  const getHeight = () => {
    return isAccordionOpen && contentRef.current
      ? contentRef.current.scrollHeight + 'px'
      : 0
  }

  return (
    <div className="rounded border p-2  shadow-md">
      <div
        className={`flex cursor-pointer items-center justify-between ${
          isAccordionOpen && 'mb-4 border-b pb-2'
        }`}
        onClick={toggleAccordion}
      >
        <p className="text-lg">List Social Media</p>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={`h-6 w-6 transform text-orange-500 ${
            isAccordionOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: getHeight(),
          transition: 'max-height 0.3s ease-in-out', // Add CSS transition
        }}
      >
        <div ref={contentRef}>
          <div className="flex flex-col items-start justify-start gap-4">
            {socials.map((platform) => {
              let icon
              let styling
              switch (platform.platform) {
                case 'Facebook':
                  icon = faFacebook
                  styling = 'text-blue-500'
                  break
                case 'Twitter':
                  icon = faTwitter
                  styling = 'text-blue-400'
                  break
                case 'Instagram':
                  icon = faInstagram
                  styling = 'text-pink-700'
                  break
                case 'LinkedIn':
                  icon = faLinkedin
                  styling = 'text-blue-900'
                  break
                default:
                  icon = null
              }

              return (
                <div
                  key={platform._id}
                  className="flex w-full items-center justify-start gap-5 pb-4"
                >
                  <div className="flex w-1/6 items-center justify-start gap-2">
                    <FontAwesomeIcon
                      icon={icon}
                      className={`h-8 w-8 cursor-pointer transition-all hover:scale-105 ${styling}`}
                    />
                    <p className="hidden sm:block">{platform.platform}</p>
                  </div>
                  <input
                    {...register(platform.platform, {
                      required: false,
                    })}
                    className="w-full rounded-md border-b border-slate-400 bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
                    placeholder="Enter social media URL"
                    type="url"
                    onChange={(e) => {
                      handleSocialMediaChange(platform.platform, e.target.value) // Update socialMediaData
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialMediaSection

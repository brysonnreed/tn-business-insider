import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sanitizeURL } from 'lib/sanitizeUserInput'
import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/Form.module.css'

type SocialMediaSectionProps = {
  socials: { _id: string; platform: string }[]
  register: any
  setValue: any
  business: any
  errors: any
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  socials,
  register,
  setValue,
  business,
  errors,
}) => {
  const [socialMediaData, setSocialMediaData] = useState([])

  useEffect(() => {
    // Set uploaded images from the business prop when it's available
    if (business && business.socialMedia) {
      setSocialMediaData(business.socialMedia)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business])

  const handleSocialMediaChange = (platform: string, url: string) => {
    const sanitizedURL = sanitizeURL(url)

    // If the URL input is empty, remove the platform from the list
    if (!url) {
      setSocialMediaData((prevData) =>
        prevData.filter((item) => item.platform !== platform)
      )

      return
    }

    // If the URL is not valid/safe, don't proceed
    if (sanitizedURL === null) {
      return
    }

    const index = socialMediaData.findIndex(
      (item) => item.platform === platform
    )

    if (index === -1) {
      // Add the platform and URL if not in the list
      setSocialMediaData((prevData) => [...prevData, { platform, url }])
    } else {
      // Update the URL if the platform is in the list
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

  return (
    <div className="">
      <div className={`flex  items-center justify-between`}>
        <p className="mb-2 text-lg font-bold">Social Media</p>
      </div>

      <div>
        <div>
          <div className="flex flex-col items-start justify-start gap-5">
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
                <div key={platform._id} className="w-full">
                  <div className="flex w-full items-center justify-start gap-5 ">
                    <div className="flex w-3/12 items-center justify-start gap-2">
                      <FontAwesomeIcon
                        icon={icon}
                        className={`h-7 w-7 cursor-pointer transition-all hover:scale-105 ${styling}`}
                      />
                      <p className="hidden sm:block">{platform.platform}</p>
                    </div>
                    <div
                      className={`${styles.input_group} w-full ${
                        errors[platform.platform]?.type === 'validate'
                          ? 'border-rose-600'
                          : ''
                      }`}
                    >
                      <input
                        {...register(platform.platform, {
                          required: false,
                          validate: (value) =>
                            sanitizeURL(value) || 'Invalid or unsafe URL',
                        })}
                        className={styles.input_text}
                        placeholder="Enter social media URL"
                        type="url"
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                          handleSocialMediaChange(
                            platform.platform,
                            e.currentTarget.value
                          ) // Update socialMediaData
                        }}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          handleSocialMediaChange(
                            platform.platform,
                            e.currentTarget.value
                          ) // Update socialMediaData
                        }}
                        defaultValue={
                          socialMediaData.find(
                            (data) => data.platform === platform.platform
                          )?.url || ''
                        }
                      />
                    </div>
                  </div>
                  {errors[platform.platform]?.type === 'validate' && (
                    <p className="text-center text-red-500">
                      Invalid or unsafe URL
                    </p>
                  )}
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

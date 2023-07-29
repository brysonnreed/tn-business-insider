import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import {
  faArrowRight,
  faCheckCircle,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { urlForImage } from 'lib/sanity.image'
import { BusinessProfile as BusinessProfileType } from 'lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'

interface BusinessProfileProps {
  businessProfile: BusinessProfileType
}

export default function BusinessProfile({
  businessProfile,
}: BusinessProfileProps) {
  const {
    name,
    description,
    logo,
    services,
    verified,
    city,
    images,
    hours,
    amenities,
    socialMedia,
    address,
    mapLocation,
    slug,
  } = businessProfile

  return (
    <div className="border-b border-gray-300 p-4">
      <div className="mb-1 flex flex-col justify-center gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex  justify-start space-x-2 sm:justify-center">
          <div className="h-16 w-16 ">
            {logo && (
              <Image
                src={urlForImage(logo).url()}
                alt={`${name} Logo`}
                width={1000}
                height={1000}
                className="rounded-full"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-center text-xl font-semibold capitalize sm:text-left sm:text-2xl">
                {name}
              </h2>
              {verified && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: '#2bff00' }}
                  className="h-5 w-5"
                />
              )}
            </div>
            <div className="flex flex-row items-center justify-start gap-2 sm:hidden">
              <FontAwesomeIcon
                icon={faMapPin}
                style={{ color: 'red' }}
                className="h-4 w-4"
              />
              <h3 className="flex">
                {city}
                <span className="hidden sm:flex">, Tennessee</span>
              </h3>
            </div>
          </div>
        </div>

        {verified && socialMedia && socialMedia.length > 0 ? (
          <ul className="flex flex-row items-center justify-center gap-2 sm:justify-start md:justify-center">
            {socialMedia.map((platform, index) => (
              <li key={index}>
                {platform.platform === 'Facebook' && (
                  <a href={platform.url} target="_blank">
                    <FontAwesomeIcon
                      icon={faFacebook}
                      className="h-5 w-5 cursor-pointer text-blue-500 transition-all hover:scale-105"
                    />
                  </a>
                )}
                {platform.platform === 'Twitter' && (
                  <a href={platform.url} target="_blank">
                    <FontAwesomeIcon
                      icon={faTwitter}
                      className="h-5 w-5 cursor-pointer text-blue-400 transition-all hover:scale-105"
                    />
                  </a>
                )}
                {platform.platform === 'Instagram' && (
                  <a href={platform.url} target="_blank">
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="h-5 w-5 cursor-pointer text-pink-700 transition-all hover:scale-105"
                    />
                  </a>
                )}
                {platform.platform === 'LinkedIn' && (
                  <a href={platform.url} target="_blank">
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="h-5 w-5 cursor-pointer text-blue-900 transition-all hover:scale-105"
                    />
                  </a>
                )}
                {/* Add more conditions and corresponding icons for other social media platforms */}
              </li>
            ))}
          </ul>
        ) : (
          <div></div>
        )}
      </div>
      <p className="line-clamp-3 sm:line-clamp-2">{description}</p>

      <div className="mt-5 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
        <div className="hidden flex-row items-center justify-end gap-2 sm:flex">
          <FontAwesomeIcon
            icon={faMapPin}
            style={{ color: 'red' }}
            className="h-5 w-5"
          />
          <h3 className="">{city}, Tennessee</h3>
        </div>
        <Link
          href={`/businesses/business-profile/[slug]`}
          as={`/businesses/business-profile/${slug}`}
        >
          <button className="mt-2 flex items-center justify-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-base text-white transition-all hover:scale-105 sm:mt-0 ">
            Read More{' '}
            <FontAwesomeIcon
              icon={faArrowRight}
              style={{ color: 'white' }}
              className="h-3 w-3 sm:h-5 sm:w-5"
            />
          </button>
        </Link>
      </div>
    </div>
  )
}

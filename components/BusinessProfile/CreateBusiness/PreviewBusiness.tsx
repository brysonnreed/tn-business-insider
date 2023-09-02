import 'react-multi-carousel/lib/styles.css'

import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import {
  faBellConcierge,
  faCheckCircle,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Carousel from 'react-multi-carousel'

import MapComponent from '../MapComponent'

function PreviewBusiness({ formData }) {
  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 3,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 1,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464,
      },
      items: 2,
      partialVisibilityGutter: 30,
    },
  }
  const imageUrls = formData.images
    ? formData.images.map((image) => URL.createObjectURL(image.image))
    : []

  const daysOfTheWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]
  return (
    <article className="">
      <section className="mb-1 flex flex-col items-center justify-center gap-2 border-b  border-gray-300 sm:flex-row sm:justify-between ">
        <div className="mb-5 flex justify-start space-x-2 sm:justify-center">
          <div className="h-24 w-24 sm:h-32 sm:w-32">
            {formData.logo && (
              <Image
                src={URL.createObjectURL(formData.logo)}
                alt={`${formData.name} Logo`}
                width={500}
                height={500}
                className="rounded-full"
              />
            )}
          </div>
          <div className="flex flex-col  justify-center">
            <div className="flex items-center gap-2">
              <h1 className="flex items-start text-center text-xl font-semibold capitalize sm:text-left sm:text-2xl">
                {formData.name}
              </h1>
              {formData.verified && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: '#2bff00' }}
                  className="h-5 w-5 "
                />
              )}
            </div>
            <div className="mr-6 flex flex-row justify-start gap-2 xs:items-center">
              <FontAwesomeIcon
                icon={faMapPin}
                style={{ color: 'red' }}
                className="h-4 w-4"
              />
              <h3 className="flex flex-row gap-1">
                <span className="hidden sm:block">
                  {formData?.address.name}
                  {', '}
                </span>
                {formData?.city}{' '}
                <span className="invisible sm:visible">, Tennessee</span>
              </h3>
            </div>
          </div>
        </div>

        {formData.socialMedia && formData.socialMedia.length > 0 ? (
          <ul className="flex flex-row items-center justify-center gap-2 sm:justify-start md:justify-center">
            {formData.socialMedia.map((platform, index) => (
              <li key={index}>
                {platform.platform === 'Facebook' && (
                  <a href={platform.url} target="_blank">
                    <FontAwesomeIcon
                      icon={faFacebook}
                      className="h-5 w-5 cursor-pointer text-blue-500 transition-all hover:scale-105 md:h-7 md:w-7"
                    />
                  </a>
                )}
                {platform.platform === 'Twitter' && (
                  <a href={platform.url} target="_blank">
                    <FontAwesomeIcon
                      icon={faTwitter}
                      className="h-5 w-5 cursor-pointer text-blue-400 transition-all hover:scale-105 md:h-7 md:w-7"
                    />
                  </a>
                )}
                {platform.platform === 'Instagram' && (
                  <a href={platform.url} target="_blank">
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="h-5 w-5 cursor-pointer text-pink-700 transition-all hover:scale-105 md:h-7 md:w-7"
                    />
                  </a>
                )}
                {platform.platform === 'LinkedIn' && (
                  <a href={platform.url} target="_blank">
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="h-5 w-5 cursor-pointer text-blue-900 transition-all hover:scale-105 md:h-7 md:w-7"
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
      </section>
      <div className="py-10">
        <p>{formData.description}</p>
      </div>
      <div className="pb-10 ">
        {imageUrls && (
          <Carousel
            additionalTransfrom={0}
            arrows={false}
            autoPlay
            autoPlaySpeed={5000}
            centerMode={false}
            containerClass="container-with-dots"
            draggable={true}
            focusOnSelect={true}
            infinite
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={responsive}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={true}
            slidesToSlide={1}
            swipeable={true}
          >
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative h-[30vh]">
                <Image
                  src={imageUrl}
                  alt={`Slide ${index + 1} for ${formData.name}`}
                  //   width={2000}
                  //   height={2000}

                  fill
                  draggable={false}
                  className="object-cover pb-10"
                  priority={true}
                  sizes="(max-width: 768px)"
                />
              </div>
            ))}
          </Carousel>
        )}
      </div>
      <section className="flex flex-col gap-10 border-t border-gray-300 py-10 sm:flex-row ">
        <div className="rounded-md border border-gray-300 py-5 shadow-lg xs:mx-auto xs:w-[80%] sm:w-1/2">
          <div className="mb-3 flex items-center justify-center gap-2 ">
            <h2 className="border-b border-gray-300 text-xl font-semibold">
              Services offered
            </h2>
            <FontAwesomeIcon icon={faBellConcierge} className="h-5 w-5" />
          </div>
          <ul className="flex h-[80%] flex-col items-center justify-evenly">
            {formData.services &&
              formData.services.map((service, i) => (
                <li key={i + 1} className="text-lg">
                  {service}
                </li>
              ))}
          </ul>
        </div>
        <div className="rounded-md border border-gray-300 py-5 shadow-lg xs:mx-auto xs:w-[80%] sm:w-1/2">
          <div className="flex h-full flex-col items-center justify-center">
            <h2 className="mb-3 border-b border-gray-300 text-xl font-semibold">
              Hours
            </h2>
            {/* {formData.openAllDay ? (
              <>
                {daysOfTheWeek.map((day) => (
                  <div
                    key={day}
                    className="mb-1 flex w-[50%] items-center justify-between"
                  >
                    <span className="font-semibold capitalize">{day}:</span>
                    <span className="text-right">Open all day</span>
                  </div>
                ))}
              </>
            ) : formData.hours ? (
              <>
                {daysOfTheWeek.map((day) => {
                  const { isOpen, hours } = formData.hours[day]
                  return (
                    <div
                      key={day}
                      className="mb-1 flex w-[50%] items-center justify-between"
                    >
                      <span className="font-semibold capitalize">{day}:</span>
                      <span className="text-right">
                        {isOpen ? hours.open + ' - ' + hours.close : 'Closed'}
                      </span>
                    </div>
                  )
                })}
              </>
            ) : (
              <>
                {daysOfTheWeek.map((day) => (
                  <div
                    key={day}
                    className="mb-1 flex w-[50%] items-center justify-between"
                  >
                    <span className="font-semibold capitalize">{day}:</span>
                    <span className="text-right">No hours available</span>
                  </div>
                ))}
              </>
            )} */}
            {/* {businessProfile.hours ? (
                        <>
                          {Object.entries(businessProfile.hours).map(
                            ([day, { isOpen, hours }]) => (
                              <div
                                key={day}
                                className=" mb-1 flex w-[50%] items-center justify-between"
                              >
                                <span className="font-semibold capitalize">
                                  {day}:
                                </span>
                                <span className="text-right">
                                  {isOpen
                                    ? hours.open + ' - ' + hours.close
                                    : 'Closed'}
                                </span>
                              </div>
                            )
                          )}
                        </>
                      ) : (
                        <p>No hours available</p>
                      )} */}
          </div>
        </div>
      </section>
      <MapComponent businessProfile={formData} />
    </article>
  )
}

export default PreviewBusiness

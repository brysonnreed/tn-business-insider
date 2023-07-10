import 'react-multi-carousel/lib/styles.css'

import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import {
  faArrowRight,
  faBellConcierge,
  faCheckCircle,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import BusinessProfilePageHead from 'components/BusinessProfilePageHead'
import BusinessProfileTitle from 'components/PostTitle'
import SectionSeparator from 'components/SectionSeparator'
import { urlForImage } from 'lib/sanity.image'
import { BusinessProfile, Post, Settings } from 'lib/sanity.queries'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Carousel from 'react-multi-carousel'

export interface BusinessProfilePageProps {
  preview?: boolean
  loading?: boolean
  businessProfile: BusinessProfile

  settings: Settings
}

export default function BusinessProfilePage(props: BusinessProfilePageProps) {
  const {
    preview,
    loading,

    businessProfile,
    settings,
  } = props
  const slug = businessProfile?.slug

  if (!slug && !preview) {
    notFound()
  }
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
  const imageUrls = businessProfile.images.map((image) =>
    urlForImage(image).url()
  )

  return (
    <>
      <BusinessProfilePageHead
        settings={settings}
        businessProfile={businessProfile}
      />

      <Layout preview={preview} loading={loading}>
        <Container>
          {preview && !businessProfile ? (
            <BusinessProfileTitle>Loading…</BusinessProfileTitle>
          ) : (
            <>
              <article>
                <section className="mb-1 flex flex-col items-center justify-center gap-2 border-b  border-gray-300 sm:flex-row sm:justify-between ">
                  <div className="flex  justify-start space-x-2 sm:justify-center">
                    <div className="h-24 w-24 sm:h-32 sm:w-32">
                      {businessProfile.logo && (
                        <Image
                          src={urlForImage(businessProfile.logo).url()}
                          alt={`${businessProfile.name} Logo`}
                          width={1000}
                          height={1000}
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex flex-col  justify-center">
                      <div className="flex items-center gap-2">
                        <h1 className="flex items-start text-center text-xl font-semibold capitalize sm:text-left sm:text-2xl">
                          {businessProfile.name}
                        </h1>
                        {businessProfile.verified && (
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
                        <h3 className="">
                          <span className="hidden sm:block">
                            {businessProfile?.address}
                          </span>
                          {businessProfile?.city}{' '}
                          <span className="invisible sm:visible">
                            , Tennessee
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>

                  {businessProfile.verified &&
                  businessProfile.socialMedia &&
                  businessProfile.socialMedia.length > 0 ? (
                    <ul className="flex flex-row items-center justify-center gap-2 sm:justify-start md:justify-center">
                      {businessProfile.socialMedia.map((platform, index) => (
                        <li key={index}>
                          {platform.platform === 'facebook' && (
                            <a href={platform.url} target="_blank">
                              <FontAwesomeIcon
                                icon={faFacebook}
                                className="h-5 w-5 cursor-pointer text-blue-500 transition-all hover:scale-105 md:h-7 md:w-7"
                              />
                            </a>
                          )}
                          {platform.platform === 'twitter' && (
                            <a href={platform.url} target="_blank">
                              <FontAwesomeIcon
                                icon={faTwitter}
                                className="h-5 w-5 cursor-pointer text-blue-400 transition-all hover:scale-105 md:h-7 md:w-7"
                              />
                            </a>
                          )}
                          {platform.platform === 'instagram' && (
                            <a href={platform.url} target="_blank">
                              <FontAwesomeIcon
                                icon={faInstagram}
                                className="h-5 w-5 cursor-pointer text-pink-700 transition-all hover:scale-105 md:h-7 md:w-7"
                              />
                            </a>
                          )}
                          {platform.platform === 'linkedIn' && (
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
                  <p>{businessProfile.description}</p>
                </div>
                <div className="pb-10 ">
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
                      <div key={index} className="h-[30vh]">
                        <Image
                          src={imageUrl}
                          alt={`Slide ${index + 1} for ${businessProfile.name}`}
                          //   width={2000}
                          //   height={2000}
                          objectFit="cover"
                          fill
                          draggable={false}
                          className="pb-10 "
                          priority={true}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
                <section className="flex flex-col gap-10 border-t border-gray-300 py-10 sm:flex-row ">
                  <div className="rounded-md border border-gray-300 py-5 shadow-lg xs:mx-auto xs:w-[80%] sm:w-1/2">
                    <div className="mb-3 flex items-center justify-center gap-2 ">
                      <h2 className="border-b border-gray-300 text-xl font-semibold">
                        Services offered
                      </h2>
                      <FontAwesomeIcon
                        icon={faBellConcierge}
                        className="h-5 w-5"
                      />
                    </div>
                    <ul className="flex h-[80%] flex-col items-center justify-evenly">
                      {businessProfile.services.map((service, i) => (
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
                      {businessProfile.hours ? (
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
                      )}
                    </div>
                  </div>
                </section>
                <section className="flex items-center justify-center rounded-md border border-gray-300  shadow-lg">
                  {businessProfile.mapLocation && (
                    <iframe
                      src={businessProfile.mapLocation}
                      width="1000"
                      height="650"
                      loading="lazy"
                    ></iframe>
                  )}
                </section>
              </article>
            </>
          )}
        </Container>
      </Layout>
    </>
  )
}

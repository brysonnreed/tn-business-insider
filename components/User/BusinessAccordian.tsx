import { faCaretDown, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useMemo, useRef, useState } from 'react'

function BusinessAccordian() {
  const [openIndex, setOpenIndex] = useState(-1)
  const contentRef = useRef([])

  const accordionData = [
    {
      header: 'Improved SEO',
      content:
        'Listing your business on our website can greatly improve your search engine optimization (SEO) efforts. With proper optimization, your business profile can rank higher in search engine results, making it easier for potential customers to find you.',
    },
    {
      header: 'Quality Backlinking',
      content:
        "By listing your business on our website, you'll get valuable backlinks to your website. Backlinks from reputable sources like our website can improve your website's authority and search engine rankings.",
    },
    {
      header: 'Increased Social Media Visibility',
      content:
        'Our platform allows you to include links to your social media profiles. This can increase your social media visibility and attract more followers and potential customers.',
    },
    {
      header: 'More Traffic and Leads',
      content:
        "With a business listing on our platform, you'll benefit from increased visibility, which can drive more traffic to your website. More traffic means more potential leads and customers for your business.",
    },
    {
      header: 'On-Site Contact Forms',
      content:
        'We offer on-site contact forms that allow potential customers to get in touch with you directly. This makes it easier for them to inquire about your products or services, increasing the chances of conversion.',
    },
    {
      header: 'Rank for Local Search Queries',
      content:
        'Listing your business with location-specific information can help your business rank for local search queries like "Best home-builders in Nashville, Tennessee." This can attract more local customers and boost your business.',
    },
    {
      header: 'Improved Domain Rating',
      content:
        "Backlinks from our website and increased traffic can improve your website's domain rating. A higher domain rating signifies better authority and trust, leading to improved search rankings and visibility.",
    },
  ]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedAccordionData = useMemo(() => accordionData, [])

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? -1 : index))
  }

  const getHeight = (index) => {
    return openIndex === index && contentRef.current[index]
      ? contentRef.current[index].scrollHeight + 'px'
      : 0
  }

  return (
    <div className="mt-10">
      <h3 className="mb-1 text-center text-2xl font-semibold sm:text-4xl">
        <span className="font-bold text-orange-500">Benefits</span> of listing
        your Business
      </h3>

      {memoizedAccordionData.map((item, index) => (
        <div
          key={index}
          className={`mb-2 cursor-pointer overflow-hidden rounded-lg ${
            openIndex === index ? 'shadow-2xl' : 'shadow-md'
          }`}
        >
          <div
            className={`mt-4 rounded-lg bg-orange-500 p-4 shadow-md transition-all duration-300 ${
              openIndex === index ? 'bg-orange-500' : ''
            }`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white xs:text-lg">
                {item.header}
              </h2>

              <FontAwesomeIcon
                icon={faCaretDown}
                className={`h-4 w-4 cursor-pointer text-white transition-all duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>

          <div
            className="overflow-hidden"
            style={{
              maxHeight: getHeight(index),
              transition: 'max-height 0.3s ease-in-out', // Add CSS transition
            }}
          >
            <div ref={(el) => (contentRef.current[index] = el)}>
              <div className="bg-slate-200 px-5 py-2">
                <p className="mt-2 text-sm sm:text-base">{item.content}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BusinessAccordian

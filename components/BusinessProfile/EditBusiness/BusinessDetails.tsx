import {
  faChartColumn,
  faCreditCard,
  faEnvelope,
  faEye,
  faPen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import { useRouter } from 'next/router'
const BusinessDetails = ({ business, showPage, setShowPage }) => {
  const router = useRouter()

  const handlePageChange = (newPage) => {
    setShowPage(newPage)
    // Update the URL without causing a page reload
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, showPage: newPage },
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <div className="mx-auto flex flex-col justify-between rounded-t-lg border bg-slate-200 px-1 py-2 shadow-xl sm:rounded-l-lg sm:rounded-r-none  sm:py-5  md:px-5">
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="flex gap-2 sm:flex-col sm:text-center">
          <div className="flex flex-row gap-4 sm:mb-4 sm:flex-col">
            <div className="relative items-center justify-center sm:flex ">
              <Image
                src={urlForImage(business.logo).url()}
                className="h-[60px] w-[60px]  object-cover md:h-[80px] md:w-[80px]"
                height={96}
                width={96}
                alt={business.name}
                priority
              />
            </div>
            <div>
              <p className="text-2xl font-semibold">{business.name}</p>
              <p className=" hidden xs:flex sm:hidden md:flex">
                You can manage your business from here
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 flex-row justify-center gap-2 xs:flex sm:flex-col">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={
              showPage == 'dashboard' ? 'userNavBtnActive' : 'userNavBtn'
            }
            onClick={() => {
              handlePageChange('dashboard')
              setShowPage('dashboard')
            }}
            type="button"
          >
            <FontAwesomeIcon icon={faChartColumn} className="h-4 w-4" />
            Dashboard
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={showPage == 'update' ? 'userNavBtnActive' : 'userNavBtn'}
            onClick={() => {
              handlePageChange('update')
              setShowPage('update')
            }}
            type="button"
          >
            <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
            Update
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={showPage == 'email' ? 'userNavBtnActive' : 'userNavBtn'}
            onClick={() => {
              handlePageChange('email')
              setShowPage('email')
            }}
            type="button"
          >
            <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
            Leads
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={
              showPage == 'subscription' ? 'userNavBtnActive' : 'userNavBtn'
            }
            onClick={() => {
              handlePageChange('subscription')
              setShowPage('subscription')
            }}
            type="button"
          >
            <FontAwesomeIcon icon={faCreditCard} className="h-4 w-4" />
            Subscription
          </motion.button>
        </div>
      </div>
      <span className="hidden sm:block">
        <motion.a
          href={`/business/business-profile/${business.slug}`}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.01 }}
          className={`userNavBtn`}
        >
          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
          View Profile
        </motion.a>
      </span>
    </div>
  )
}

export default BusinessDetails

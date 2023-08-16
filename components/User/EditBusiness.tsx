import UpdateAddress from 'components/BusinessProfile/EditBusiness/UpdateAddress'
import UpdateBasicDetails from 'components/BusinessProfile/EditBusiness/UpdateBasicDetails'
import UpdateDetails from 'components/BusinessProfile/EditBusiness/UpdateDetails'
import UpdateHours from 'components/BusinessProfile/EditBusiness/UpdateHours'
import UpdateMedia from 'components/BusinessProfile/EditBusiness/UpdateMedia'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useState } from 'react'

function EditBusiness({ business, categories, cities, socials }) {
  const router = useRouter()
  const [showPage, setShowPage] = useState(router.query.page || 'general')

  const handleShowPage = (page) => {
    setShowPage(page)

    // Update the URL with the selected page without a page refresh
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page },
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <section>
      <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
        <h1 className="text-2xl font-semibold text-orange-500 sm:text-3xl">
          Want to make changes?
        </h1>
        <p className="text-5xl font-bold capitalize text-black sm:text-6xl">
          Update your Business Profile.
        </p>
      </div>
      <div className="flex flex-row justify-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.01 }}
          className={`p-2 text-sm ${
            showPage == 'general' ? 'bg-orange-500 text-white' : ''
          }`}
          onClick={() => handleShowPage('general')}
        >
          General
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.01 }}
          className={`p-2 text-sm ${
            showPage == 'details' ? 'bg-orange-500 text-white' : ''
          }`}
          onClick={() => handleShowPage('details')}
        >
          Details
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.01 }}
          className={`p-2 text-sm ${
            showPage == 'media' ? 'bg-orange-500 text-white' : ''
          }`}
          onClick={() => handleShowPage('media')}
        >
          Media
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.01 }}
          className={`p-2 text-sm ${
            showPage == 'hours' ? 'bg-orange-500 text-white' : ''
          }`}
          onClick={() => handleShowPage('hours')}
        >
          Hours
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.01 }}
          className={`p-2 text-sm ${
            showPage == 'address' ? 'bg-orange-500 text-white' : ''
          }`}
          onClick={() => handleShowPage('address')}
        >
          Address
        </motion.button>
      </div>
      {showPage == 'general' && <UpdateBasicDetails business={business} />}
      {showPage == 'address' && (
        <UpdateAddress business={business} cities={cities} />
      )}
      {showPage == 'details' && (
        <UpdateDetails business={business} categories={categories} />
      )}
      {showPage == 'media' && (
        <UpdateMedia business={business} socials={socials} />
      )}
      {showPage == 'hours' && <UpdateHours business={business} />}
    </section>
  )
}

export default EditBusiness

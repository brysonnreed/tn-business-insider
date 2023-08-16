import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

import ManageBusinessProfile from '../ManageBusinessProfile'

const OwnedBusinesses = ({ businesses }) => {
  return (
    <motion.div
      layout
      initial={{ y: 150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-2xl  font-semibold sm:text-4xl">
          My{' '}
          <span className="text-2xl font-bold text-orange-500 sm:text-4xl">
            Businesses
          </span>
        </h3>
        <Link href={'/businesses/business-management/add'}>
          <button className="group flex flex-row items-center justify-center gap-2 rounded border bg-slate-100 px-2 py-1 transition-all duration-200 hover:border-none hover:bg-orange-500 hover:text-white">
            Add New{' '}
            <FontAwesomeIcon
              icon={faPlus}
              className="h-4 w-4 transition-all duration-200 group-hover:rotate-90 group-hover:text-white "
            />
          </button>
        </Link>
      </div>

      {/* Display a list of owned businesses */}
      <motion.ul
        layout
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
      >
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <ManageBusinessProfile key={business._id} business={business} />
          ))
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center rounded-md border-t bg-slate-200 transition-all duration-200 hover:shadow-lg">
            <p className="text-center text-base font-thin text-gray-800 sm:text-xl">
              It doesnt look like you are managing any businesses yet. <br></br>
              <Link
                href={`/businesses/business-management/add`}
                className="underline"
              >
                Click here
              </Link>{' '}
              to add one
            </p>
          </div>
        )}
      </motion.ul>
    </motion.div>
  )
}

export default OwnedBusinesses

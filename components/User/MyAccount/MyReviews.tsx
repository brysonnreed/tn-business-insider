import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

function MyReviews() {
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
            Reviews
          </span>
        </h3>
      </div>

      {/* TODO: Display a list of Reviews and that business */}

      <div className="flex min-h-[40vh] items-center justify-center rounded-md border-t bg-slate-200 transition-all duration-200 hover:shadow-lg">
        <p className="text-center text-base font-thin text-gray-800 sm:text-xl">
          It doesnt look like you have made any reviews yet. <br></br>
          <Link href={`/businesses`} className="underline">
            Click here
          </Link>{' '}
          to search for businesses you want to review.
        </p>
      </div>
    </motion.div>
  )
}

export default MyReviews

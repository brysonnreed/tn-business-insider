import { motion } from 'framer-motion'
import React from 'react'

function BusinessSubscription() {
  return (
    <motion.div
      layout
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0 }}
    >
      <div className=" mb-5 flex flex-col gap-2 border-b border-black pb-10 leading-8">
        <h1 className="text-xl font-semibold text-orange-500 sm:text-2xl">
          Looking to get more views?
        </h1>
        <p className="text-4xl font-bold capitalize text-black sm:text-5xl">
          upgrade your plan.
        </p>
      </div>

      <motion.div className="flex gap-5">
        <div className="flex w-1/2 flex-col items-center gap-4 rounded-md border p-2 text-center shadow-xl sm:p-5">
          <div className="mb-5 flex flex-col gap-5 border-b border-gray-400 pb-5">
            <h2 className="text-4xl">Basic</h2>
            <p className="text-4xl font-bold text-green-600">$0</p>
            <p className="text-gray-400">
              per month billed anually <br></br>or 15$ month-to-month
            </p>
            <button className="rounded bg-orange-500 px-6 py-2 uppercase text-white">
              Upgrade
            </button>
          </div>
          <ul>
            <li>service</li>
            <li>service</li>
            <li>service</li>
            <li>service</li>
          </ul>
        </div>
        <div className="flex w-1/2 flex-col items-center gap-4 rounded-md border p-2 text-center shadow-xl sm:p-5">
          <div className="mb-5 flex flex-col gap-5 border-b border-gray-400 pb-5">
            <h2 className="text-4xl">Premium</h2>
            <p className="text-4xl font-bold text-green-600">$10</p>
            <p className="text-gray-400">
              per month billed anually <br></br> or 15$ month-to-month
            </p>
            <button className="rounded bg-orange-500 px-6 py-2 uppercase text-white">
              Upgrade
            </button>
          </div>
          <ul>
            <li>service</li>
            <li>service</li>
            <li>service</li>
            <li>service</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BusinessSubscription

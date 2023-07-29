import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ManageBusinessProfile({ business }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between border-y py-5"
    >
      <div className="flex flex-row items-center justify-center gap-4">
        <Image
          src={urlForImage(business.logo).url()}
          alt={`${business.name} logo`}
          width={400}
          height={400}
          className="h-10 w-10 sm:h-16 sm:w-16"
        />{' '}
        <h2 className="text:xl font-medium sm:text-2xl">{business.name}</h2>
      </div>
      <Link href={'/businesses/business-management/edit'}>
        <div className="group p-2">
          <FontAwesomeIcon
            icon={faPen}
            className="transition-all duration-200 group-hover:cursor-pointer group-hover:text-orange-500"
          />
        </div>
      </Link>
    </motion.div>
  )
}

export default ManageBusinessProfile

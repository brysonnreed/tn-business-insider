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
      className="flex items-center justify-between border-y py-5 "
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
      <Link href={`/businesses/business-management/manage/${business._id}`}>
        <div className="group p-2">
          <div className="flex items-center justify-center gap-2 text-slate-400 transition-all duration-300 group-hover:cursor-pointer group-hover:text-orange-500">
            <p className="hidden text-slate-600 xs:block">Manage</p>
            <FontAwesomeIcon icon={faPen} className="h-4 w-4 " />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ManageBusinessProfile

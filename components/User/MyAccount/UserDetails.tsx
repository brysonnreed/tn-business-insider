import {
  faBuilding,
  faThumbsUp,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import React from 'react'

const UserDetails = ({ user, showPage, setShowPage }) => {
  return (
    <div className="mx-auto flex flex-col justify-between rounded-t-lg border bg-slate-200 px-1 py-5 shadow-xl sm:rounded-l-lg  sm:rounded-r-none  md:px-5">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 sm:flex-col sm:text-center">
          <div className="mb-4 flex flex-row gap-4 sm:flex-col">
            <div className="relative items-center justify-center sm:flex ">
              <Image
                src={
                  user.image
                    ? user.image
                    : 'https://cdn.sanity.io/images/yuy7c73l/production/08232b0e5971e6f5a4e7a6fe2f8bdd6dd472f7e7-150x151.png'
                }
                className="h-[60px] w-[60px] rounded-full object-cover md:h-[80px] md:w-[80px]"
                height={96}
                width={96}
                alt={user.name}
              />
            </div>
            <div>
              <p className="text-2xl font-semibold">{user.name}</p>
              <p className=" hidden xs:flex sm:hidden md:flex">
                You can manage your profile from here
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2 xs:flex-row sm:flex-col">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={
              showPage == 'profile' ? 'userNavBtnActive' : 'userNavBtn'
            }
            onClick={() => setShowPage('profile')}
          >
            <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
            Manage Profile
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={
              showPage == 'businesses' ? 'userNavBtnActive' : 'userNavBtn'
            }
            onClick={() => setShowPage('businesses')}
          >
            <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
            My Businesses
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={showPage == 'posts' ? 'userNavBtnActive' : 'userNavBtn'}
            onClick={() => setShowPage('posts')}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="h-4 w-4" />
            My Liked Posts
          </motion.button>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.01 }}
        onClick={() => signOut()}
        className="hidden items-center justify-center rounded bg-orange-500 p-2 text-white sm:flex lg:text-xl"
      >
        Sign Out
      </motion.button>
    </div>
  )
}

export default UserDetails

import {
  faBuilding,
  faClipboard,
  faThumbsUp,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import React from 'react'

const UserDetails = ({ user, showPage, setShowPage }) => {
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
        <div className="grid grid-cols-2 flex-row justify-center gap-2 xs:flex sm:flex-col">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={
              showPage == 'profile' ? 'userNavBtnActive' : 'userNavBtn'
            }
            onClick={() => {
              handlePageChange('profile')
              setShowPage('profile')
            }}
          >
            <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
            Profile
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={
              showPage == 'businesses' ? 'userNavBtnActive' : 'userNavBtn'
            }
            onClick={() => {
              handlePageChange('businesses')
              setShowPage('businesses')
            }}
          >
            <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
            Businesses
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={showPage == 'posts' ? 'userNavBtnActive' : 'userNavBtn'}
            onClick={() => {
              handlePageChange('posts')
              setShowPage('posts')
            }}
          >
            {' '}
            <FontAwesomeIcon icon={faThumbsUp} className="h-4 w-4" />
            Liked Posts
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className={
              showPage == 'reviews' ? 'userNavBtnActive' : 'userNavBtn'
            }
            onClick={() => {
              handlePageChange('reviews')
              setShowPage('reviews')
            }}
          >
            {' '}
            <FontAwesomeIcon icon={faClipboard} className="h-4 w-4" />
            My Reviews
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

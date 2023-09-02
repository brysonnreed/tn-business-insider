import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

function UserNavigation({
  isDropdownVisible,
  setIsDropdownVisible,
  navRef,
  session,
  signOut,
  signIn,
  user,
}) {
  return (
    <nav className="z-[21] drop-shadow-2xl">
      {isDropdownVisible && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          ref={navRef}
          className="absolute right-0 top-0 z-[21] w-full text-center text-lg font-medium uppercase tracking-wider text-black sm:w-1/2 xl:right-[4%] xl:w-[15%]"
        >
          {session ? (
            <div>
              <Link href={'/businesses/business-management'}>
                <button
                  className="w-full border-y"
                  type="button"
                  onClick={() => setIsDropdownVisible(false)}
                >
                  <li className="mobileNavItem bg-white">My Businesses</li>
                </button>
              </Link>
              <Link href={'/account/my-account'}>
                <button
                  className="w-full border-y"
                  type="button"
                  onClick={() => setIsDropdownVisible(false)}
                >
                  <li className="mobileNavItem bg-white">My Profile</li>
                </button>
              </Link>
              {user && user.admin == true && (
                <Link href={'/studio'}>
                  <button
                    className="w-full border-y"
                    type="button"
                    onClick={() => setIsDropdownVisible(false)}
                  >
                    <li className="mobileNavItem bg-white">Studio</li>
                  </button>
                </Link>
              )}

              <button
                onClick={() => {
                  signOut()
                  setIsDropdownVisible()
                }}
                className="w-full border-y"
                type="button"
              >
                <li className="mobileNavItem bg-white">Sign Out</li>
              </button>
            </div>
          ) : (
            <button
              className="w-full border-y"
              onClick={() => {
                signIn()
                setIsDropdownVisible(false)
              }}
              type="button"
            >
              <li className="mobileNavItem bg-white">Sign In</li>
            </button>
          )}
        </motion.ul>
      )}
    </nav>
  )
}

export default UserNavigation

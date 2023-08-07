import { faFacebook, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import logo from '../public/images/logo.jpg'

function Footer() {
  return (
    <footer className="mt-10 bg-slate-100 px-4 py-10 sm:text-lg">
      <div className="mx-auto max-w-7xl rounded bg-white p-4  shadow-xl">
        <div className="mb-4 flex  flex-row items-center justify-between border-b border-gray-300 pb-4">
          <p className="">Get connected with us on social networks:</p>
          <div className="flex gap-4">
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <FontAwesomeIcon
                icon={faFacebook}
                className="h-6 w-6 text-gray-500"
              />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <FontAwesomeIcon
                icon={faLinkedinIn}
                className="h-6 w-6 text-gray-500"
              />
            </motion.a>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl flex-col  justify-evenly gap-5 xs:flex-row sm:gap-0 md:items-center">
          <div className="hidden sm:block">
            <Image
              src={logo}
              width={170}
              height={170}
              alt="TN Business Insider"
            />
          </div>
          <div>
            <p className="mb-2 border-b border-gray-700 text-lg font-semibold">
              Links
            </p>
            <div>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href={'/'} className=" hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={'/blog'} className=" hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href={'/businesses'} className=" hover:underline">
                    Businesses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <p className="mb-2 border-b border-gray-700 text-lg font-semibold">
              Account
            </p>
            <div>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href={'/login'} className=" hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href={'/register'} className=" hover:underline">
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/login/reset-password'}
                    className=" hover:underline"
                  >
                    Reset Password
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <p className="mb-2 border-b border-gray-700 text-lg font-semibold">
              Legal
            </p>
            <div>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href={'/privacy-policy'} className=" hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={'/terms-of-service'} className=" hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href={'/contact'} className=" hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-gray-500">
          © 2021 Copyright:{' '}
          <Link href={'/'} className="font-semibold text-black">
            TNBusinessInsider
          </Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer

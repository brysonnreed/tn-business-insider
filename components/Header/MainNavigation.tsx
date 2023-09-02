import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

function MainNavigation({ active, navPRef, setActive }) {
  return (
    <nav className="z-[21] drop-shadow-2xl">
      {active === true && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          ref={navPRef}
          className="absolute right-0 top-0 z-[21] w-full text-center text-lg font-medium uppercase tracking-wider text-black sm:w-1/2 xl:right-[4%] xl:w-[15%]"
        >
          <button
            onClick={() => setActive(false)}
            className="w-full border-y"
            type="button"
          >
            <Link href="/">
              <li className="mobileNavItem bg-white">Home</li>
            </Link>
          </button>

          <button
            onClick={() => {
              setActive(false)
            }}
            type="button"
            className="w-full"
          >
            <Link href="/blog">
              <li
                className={`mobileNavItem flex items-center justify-center gap-1 bg-white `}
              >
                Blog{' '}
              </li>
            </Link>
          </button>

          <button
            onClick={() => setActive(false)}
            className="w-full border-y"
            type="button"
          >
            <Link href="/businesses">
              <li className="mobileNavItem bg-white">Businesses</li>
            </Link>
          </button>

          <button
            onClick={() => setActive(false)}
            className="w-full border-b"
            type="button"
          >
            <Link href="/contact">
              <li className="mobileNavItem bg-white">Contact</li>
            </Link>
          </button>
        </motion.ul>
      )}
    </nav>
  )
}

export default MainNavigation

import {
  faCaretDown,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { getAllCategories } from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { groq } from 'next-sanity'
import BlankUser from 'public/images/blank-user-image.png'
import { useEffect, useRef, useState } from 'react'

import logo from '../public/images/logo.jpg'
import AuthorAvatar from './AuthorAvatar'
import UserAvatar from './User/UserAvatar'

function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [active, setActive] = useState(false)
  const [categories, setCategories] = useState([])
  const [isBlogActive, setIsBlogActive] = useState(false)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const toggleNav = () => {
    setActive((prevActive) => !prevActive)
  }

  const toggleDropdown = () => {
    setIsDropdownVisible((prevIsDropdownVisible) => !prevIsDropdownVisible)
  }

  const searchRef = useRef<HTMLInputElement>(null)
  const navRef = useRef<HTMLUListElement>(null)

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)

    // Perform search logic if query is not empty
    if (query.trim().length > 0) {
      const searchResults = await searchBlogPosts(query)
      setSearchResults(searchResults)
    } else {
      setSearchResults([])
    }
  }

  const searchBlogPosts = async (query) => {
    const searchQuery = groq`
      *[
        (_type == "post" && title match "${query}*") ||
        (_type == "businessProfile" && name match "${query}*")
      ] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage,
        name,
        "categories": categories[]->{name},
        logo,
        description
      }
    `

    const results = await getClient().fetch(searchQuery, { query })
    return results
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const allCategories = await getAllCategories(getClient()) // Replace this with your function to fetch categories
      setCategories(allCategories)
    }

    fetchCategories()
  }, [])

  const handleClickOutside = (e: MouseEvent) => {
    if (
      searchRef.current &&
      e.target instanceof Node &&
      !searchRef.current.contains(e.target)
    ) {
      setSearchQuery('')
      setSearchResults([])
      setIsSearchFocused(false)
    }

    if (
      navRef.current &&
      e.target instanceof Node &&
      !navRef.current.contains(e.target)
    ) {
      setActive(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchBlur = () => {
    setIsSearchFocused(false)
  }
  const handleNavButtonClick = (e) => {
    if (searchQuery) {
      return setSearchQuery('') // Stop event propagation
    } else {
      return toggleNav(), e.stopPropagation()
    }
  }
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 ">
      <nav className="flex flex-col items-center justify-between space-y-4 bg-orange-500 p-2 font-bold shadow-2xl sm:flex-row sm:space-x-2 sm:space-y-0 sm:px-5 sm:py-5 xl:px-40">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src={logo}
              width={170}
              height={170}
              alt="TN Business Insider"
            />
          </Link>
        </div>
        <div className="flex w-screen items-center justify-between gap-2 px-3 xs:px-4 sm:w-auto sm:gap-5 sm:px-0">
          {session ? (
            <button
              onClick={toggleDropdown}
              type="button"
              aria-label="Open user dropdown menu"
              className=" flex items-center justify-center gap-1 focus:outline-none xs:gap-2 sm:hidden"
            >
              <UserAvatar
                image={session?.user.image ? session.user.image : BlankUser}
              />{' '}
              <FontAwesomeIcon
                icon={faCaretDown}
                className={`flex h-4 w-4 text-white xs:h-5 xs:w-5 ${
                  isDropdownVisible
                    ? `rotate-180 transition-all duration-300`
                    : ''
                }`}
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleDropdown}
              aria-label="Open user dropdown menu"
              className=" focus:outline-none sm:hidden"
            >
              <FontAwesomeIcon icon={faUser} className="h-7 w-7 text-white" />
            </button>
          )}
          <div
            className="relative flex items-center justify-center"
            ref={searchRef}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full rounded-full border-none py-2 pl-4 focus:outline-none active:outline-none  sm:pr-12 "
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-[1.95px] top-1/2 -translate-y-1/2 transform rounded-full bg-slate-300 p-2 focus:outline-none"
                onClick={() => setSearchQuery('')}
                type="button"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="h-5 w-5 cursor-pointer text-gray-500 transition-all hover:scale-105 hover:text-gray-700"
                />
              </motion.button>
            )}
            {!searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-[1.95px] top-1/2 -translate-y-1/2 transform rounded-full bg-slate-500/40 p-2"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  className="h-5 w-5 text-gray-500 transition-all hover:scale-105"
                />
              </motion.div>
            )}
          </div>
          {session ? (
            <button
              onClick={toggleDropdown}
              type="button"
              aria-label="Open user dropdown menu"
              className=" hidden items-center justify-center gap-2  focus:outline-none sm:flex"
            >
              <UserAvatar
                image={session?.user.image ? session.user.image : BlankUser}
              />{' '}
              <FontAwesomeIcon
                icon={faCaretDown}
                className={`flex h-3 w-3 text-white xs:h-5 xs:w-5 ${
                  isDropdownVisible
                    ? `rotate-180 transition-all duration-300`
                    : ''
                }`}
              />
            </button>
          ) : (
            <button
              onClick={toggleDropdown}
              type="button"
              aria-label="Open user dropdown menu"
              className=" hidden items-center justify-center gap-2 focus:outline-none sm:flex"
            >
              <FontAwesomeIcon icon={faUser} className="h-7 w-7 text-white" />
              <FontAwesomeIcon
                icon={faCaretDown}
                className="h-5 w-5 text-white"
              />
            </button>
          )}

          <button
            onClick={handleNavButtonClick}
            type="button"
            aria-label="Open the navigation"
            className={`hamburger  p-2 ${active === true ? 'active' : ''}`}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>

      {searchResults.length > 0 && (
        <div className="absolute flex w-full justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-50 w-full bg-white shadow-2xl lg:w-1/2 xl:w-1/3"
          >
            {searchResults.map((result) => (
              <Link
                key={result.slug.current}
                href={
                  result._type === 'post'
                    ? `/posts/${result.slug.current}`
                    : `/businesses/business-profile/${result.slug.current}`
                }
              >
                <div className="block overflow-hidden border-b border-gray-300 px-4 py-2 pb-3 text-gray-800 hover:bg-gray-200 ">
                  <div className="flex w-full space-x-2">
                    {result._type === 'post' && result.coverImage && (
                      <Image
                        src={urlForImage(result.coverImage).url()}
                        alt={`Cover image for ${result.title}`}
                        className="h-12 w-12 object-cover object-center md:h-20 md:w-20"
                        width={500}
                        height={500}
                      />
                    )}
                    {result._type === 'businessProfile' && result.logo && (
                      <Image
                        src={urlForImage(result.logo).url()}
                        alt={`Icon for ${result.name}`}
                        className="h-12 w-12 object-cover object-center md:h-20 md:w-20"
                        width={500}
                        height={500}
                      />
                    )}
                    <div className="w-full">
                      <div className="flex w-full justify-between">
                        <h3 className="font-bold capitalize">
                          {result._type === 'businessProfile'
                            ? result.name
                            : result.title}
                        </h3>
                        <p className="text-gray-400">
                          {result._type === 'businessProfile'
                            ? 'Business'
                            : result.categories[0].name}
                        </p>
                      </div>
                      <p className="line-clamp-3 overflow-hidden text-sm">
                        {result._type === 'businessProfile'
                          ? result.description
                          : result.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      )}
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
                  <button className="w-full border-y" type="button">
                    <li className="mobileNavItem bg-white">My Businesses</li>
                  </button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full border-y"
                  type="button"
                >
                  <li className="mobileNavItem bg-white">Sign Out</li>
                </button>
              </div>
            ) : (
              <button
                className="w-full border-y"
                onClick={() => signIn()}
                type="button"
              >
                <li className="mobileNavItem bg-white">Sign In</li>
              </button>
            )}
          </motion.ul>
        )}

        {active === true && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            ref={navRef}
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
            <div
              onMouseEnter={() => setIsBlogActive(true)}
              onMouseLeave={() => setIsBlogActive(false)}
            >
              <button
                onMouseEnter={() => setIsBlogActive(true)}
                onClick={() => {
                  setIsBlogActive(!isBlogActive)
                  setActive(false)
                }}
                type="button"
                className="w-full"
              >
                <Link href="/blog">
                  <li
                    className={`mobileNavItem flex items-center justify-center gap-1 bg-white ${
                      isBlogActive ? 'active' : ''
                    }`}
                  >
                    Blog{' '}
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={`h-4 w-4 transition-all duration-300 ${
                        isBlogActive ? `rotate-180` : ``
                      }`}
                    />
                  </li>
                </Link>
              </button>
              <ul>
                {isBlogActive &&
                  categories.map((category) => (
                    <button
                      onClick={() => [setActive(false), setIsBlogActive(false)]}
                      className="w-full"
                      key={category._id}
                      type="button"
                    >
                      <Link href={`/blog/${category.slug}`}>
                        <li className="mobileNavItem border-y border-gray-100 bg-white py-2 text-sm text-gray-500">
                          {category.name}
                        </li>
                      </Link>
                    </button>
                  ))}
              </ul>
            </div>

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
    </header>
  )
}

export default Header

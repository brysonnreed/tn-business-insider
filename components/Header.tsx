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
import { groq } from 'next-sanity'
import { useEffect, useRef, useState } from 'react'

import logo from '../public/images/logo.jpg'

function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [active, setActive] = useState(false)
  const [categories, setCategories] = useState([])
  const [isBlogActive, setIsBlogActive] = useState(false)

  const toggleNav = () => {
    setActive((prevActive) => !prevActive)
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

    // Reset the search query
  }

  return (
    <header className="sticky top-0 z-50 ">
      <nav className="flex flex-col items-center justify-between space-x-2 space-y-4 bg-orange-500 px-5 py-5 font-bold sm:flex-row sm:space-y-0 xl:px-40 ">
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
        <div className="flex w-3/4 items-center justify-center gap-1 xs:w-auto sm:gap-5">
          <FontAwesomeIcon
            icon={faUser}
            className="block h-7 w-7 text-white sm:hidden"
          />
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
              className=" rounded-full border-none py-2 pl-4 focus:outline-none active:outline-none sm:pr-12 "
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-[1.95px] top-1/2 -translate-y-1/2 transform rounded-full bg-slate-500/40 p-2 focus:outline-none"
                onClick={() => setSearchQuery('')}
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

          <FontAwesomeIcon
            icon={faUser}
            className="hidden h-7 w-7 text-white sm:block"
          />
          <button
            onClick={handleNavButtonClick}
            aria-label="Open the mobile navigation"
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
            initial={{ x: 100 }}
            animate={{ x: 0 }}
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
      <nav className=" z-[21] bg-white drop-shadow-2xl">
        {active === true && (
          <ul
            ref={navRef}
            className="absolute right-0 top-0 z-[21] h-screen w-full text-center  text-lg uppercase tracking-wider text-black sm:w-1/2 xl:right-[4%] xl:w-[15%]"
          >
            <button
              onClick={() => setActive(false)}
              className="w-full border-y"
            >
              <Link href="/">
                <motion.li
                  initial={{ x: 200, opacity: 0.5 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mobileNavItem bg-white"
                >
                  Home
                </motion.li>
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
                className="w-full"
              >
                <Link href="/blog">
                  <motion.li
                    initial={{ x: 200, opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
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
                  </motion.li>
                </Link>
              </button>
              <ul>
                {isBlogActive &&
                  categories.map((category) => (
                    <button
                      onClick={() => setActive(false)}
                      className="w-full"
                      key={category._id}
                    >
                      <Link href={`/blog/${category.slug}`}>
                        <motion.li
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="mobileNavItem border-y border-gray-100 bg-white py-2 text-sm text-gray-500"
                        >
                          {category.name}
                        </motion.li>
                      </Link>
                    </button>
                  ))}
              </ul>
            </div>

            <button
              onClick={() => setActive(false)}
              className="w-full border-y"
            >
              <Link href="/businesses">
                <motion.li
                  initial={{ x: 200, opacity: 0.5 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mobileNavItem bg-white"
                >
                  Businesses
                </motion.li>
              </Link>
            </button>

            <button
              onClick={() => setActive(false)}
              className="w-full border-b"
            >
              <Link href="/contact">
                <motion.li
                  initial={{ x: 200, opacity: 0.5 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="mobileNavItem bg-white"
                >
                  Contact
                </motion.li>
              </Link>
            </button>
          </ul>
        )}
      </nav>
    </header>
  )
}

export default Header

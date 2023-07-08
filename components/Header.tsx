import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { getClient } from 'lib/sanity.client.cdn'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import { groq } from 'next-sanity'
import { useEffect, useRef, useState } from 'react'

function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)

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
      *[_type == "post" && title match "${query}*"] {
        _id,
        title,
        slug,
        excerpt,
        coverImage
      }
    `
    const results = await getClient().fetch(searchQuery, { query })
    return results
  }

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

  return (
    <header className="sticky top-0 z-50 ">
      <nav className="flex flex-col items-center justify-between space-x-2 space-y-4 bg-orange-500 px-5 py-5 font-bold sm:flex-row sm:space-y-0 xl:px-40 ">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="bg-white p-2 md:p-4">
              <h1 className="text-lg font-bold uppercase text-orange-500 md:text-2xl">
                TN<span className="text-black">Business</span>Insider
              </h1>
            </div>
          </Link>
        </div>
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
            className="rounded-full border-none py-2 pl-4 pr-12 focus:outline-none active:outline-none"
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
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
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
                className="h-5 w-5 text-gray-500"
              />
            </motion.div>
          )}
        </div>
      </nav>
      {searchResults.length > 0 && (
        <div className="flex justify-end">
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className="z-50 w-full bg-white shadow-2xl lg:w-1/2 xl:w-1/3"
          >
            {searchResults.map((result) => (
              <Link
                key={result.slug.current}
                href={`/posts/${result.slug.current}`}
              >
                <div className="block max-h-[10vh] overflow-hidden border-b border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-200">
                  <div className="flex space-x-2">
                    {result.coverImage && (
                      <Image
                        src={urlForImage(result.coverImage.asset).url()}
                        alt={`Cover image for ${result.title}`}
                        className="h-12 w-12 object-cover object-center md:h-20 md:w-20"
                        width={500}
                        height={500}
                      />
                    )}
                    <div>
                      <h3 className="font-bold capitalize">{result.title}</h3>
                      <p className="line-clamp-3 overflow-hidden text-sm">
                        {result.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      )}
    </header>
  )
}

export default Header

import { motion } from 'framer-motion'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
function SearchResults({ searchResults }) {
  return (
    <>
      {searchResults.length > 0 && (
        <div className="absolute flex w-full justify-end">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
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
    </>
  )
}

export default SearchResults

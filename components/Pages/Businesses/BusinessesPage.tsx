import DropdownFilter from 'components/Features/Businesses/DropdownFilter'
import BusinessesPageHead from 'components/Pages/Businesses/BusinessesMeta'
import {
  getAllBusinessProfileCategories,
  getAllBusinessProfiles,
  getAllCities,
  getBusinessCategoryBySlug,
  getBusinessProfilesByCategory,
  getBusinessProfilesByCity,
  getBusinessProfilesByCityAndCategory,
  getCityBySlug,
  getClient,
  getSettings,
} from 'lib/sanity/sanity.client'
import {
  BusinessProfile as BusinessProfileType,
  Category,
  Cities,
  Settings,
} from 'lib/sanity/sanity.queries'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'

import BusinessProfile from '../../Features/BusinessProfile/BusinessProfileItem'

interface BusinessesPageProps {
  businessProfiles: BusinessProfileType[]
  settings: Settings
  preview?: boolean
  loading?: boolean
  cities?: Cities[]
  categories?: Category[]
}

export default function BusinessesPage(props: BusinessesPageProps) {
  const { businessProfiles, cities, categories } = props

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
  }

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [filteredProfiles, setFilteredProfiles] = useState<
    BusinessProfileType[]
  >([])

  useEffect(() => {
    const filterProfiles = async () => {
      // Filter by City only
      if (selectedCity && !selectedCategory) {
        const cityData = await getCityBySlug(getClient(), selectedCity)
        const filterByCity = await getBusinessProfilesByCity(
          getClient(),
          cityData.slug
        )
        setFilteredProfiles(filterByCity)
      }
      // Filter by Category Only
      else if (!selectedCity && selectedCategory) {
        const categoryData = await getBusinessCategoryBySlug(
          getClient(),
          selectedCategory
        )
        const filterByCategory = await getBusinessProfilesByCategory(
          getClient(),
          categoryData.slug
        )
        setFilteredProfiles(filterByCategory)
      }
      // Filter by City and Category
      else if (selectedCity && selectedCategory) {
        const categoryData = await getBusinessCategoryBySlug(
          getClient(),
          selectedCategory
        )
        const cityData = await getCityBySlug(getClient(), selectedCity)
        const filterByCityAndCategory =
          await getBusinessProfilesByCityAndCategory(
            getClient(),
            cityData.slug,
            categoryData.slug
          )
        setFilteredProfiles(filterByCityAndCategory)
      }
      // No filters applied
      else {
        setFilteredProfiles(businessProfiles)
      }
    }

    filterProfiles()
  }, [selectedCategory, selectedCity, businessProfiles])

  return (
    <>
      <BusinessesPageHead />

      <main className="boxSection">
        <div className="boxContainer">
          {selectedCategory || selectedCity ? (
            <h1 className="pb-10 text-xl font-bold capitalize sm:text-3xl">
              Searching for{' '}
              {selectedCategory
                ? selectedCategory + ' businesses'
                : 'Businesses'}{' '}
              in{' '}
              <span className=" text-orange-500">
                {selectedCity ? selectedCity + ` ,` : ''} Tennessee
              </span>
            </h1>
          ) : (
            <h1 className="pb-10 text-xl font-bold capitalize sm:text-3xl">
              Search for Businesses by category or city
            </h1>
          )}

          <div className="mb-4 flex flex-col justify-center gap-4 border-b border-gray-300 pb-6 xs:flex-row md:items-center md:justify-start">
            <DropdownFilter
              label="City"
              options={cities || []}
              selectedOption={selectedCity}
              onChange={handleCityChange}
            />
            <DropdownFilter
              label="Category"
              options={categories || []}
              selectedOption={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
          {filteredProfiles.map((businessProfile) => (
            <BusinessProfile
              key={businessProfile._id}
              businessProfile={businessProfile}
            />
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<BusinessesPageProps> = async () => {
  const [settings, businessProfiles, categories, cities] = await Promise.all([
    getSettings(getClient()),
    getAllBusinessProfiles(getClient()),
    getAllBusinessProfileCategories(getClient()),
    getAllCities(getClient()),
  ])

  return {
    props: {
      businessProfiles,
      settings,
      categories,
      cities,
    },
  }
}

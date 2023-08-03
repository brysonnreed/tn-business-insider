// CitySection.tsx
import { faChevronDown, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getClient } from 'lib/sanity.client.cdn'
import { groq } from 'next-sanity'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

type CitySectionProps = {
  cities: any
  setValue: any
  // remove setValue prop, useFormContext hook will be used instead
}

const CitySection: React.FC<CitySectionProps> = ({ cities, setValue }) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false) // State to manage the visibility of the dropdowns
  const [selectedCity, setSelectedCity] = useState('') // State to manage the selected city and category
  const [cityResults, setCityResults] = useState([]) // State to store the matching city and category results
  const [cityInput, setCityInput] = useState('') // State to manage the user input for city and category

  // Function to toggle the visibility of the city dropdown
  const toggleCityDropdown = () => {
    setShowCityDropdown((prevState) => !prevState)
  }
  // Function to search for cities based on the query
  const searchCities = async (query: string) => {
    const searchQuery = groq`
      *[
        (_type == "city" && name match "${query}*")
      ] {
        _id,
        name
      }
    `

    const matchingCities = await getClient().fetch(searchQuery, { query })
    return matchingCities
  }
  // Function to handle city input changes and trigger search
  const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setCityInput(query) // Update the cityInput state with the user's input
    const matchingCities = await searchCities(query)
    setShowCityDropdown(true) // Display the dropdown when typing in the city input
    setCityResults(matchingCities) // Set the matching cities as dropdown results
  }
  // Function to handle selecting a city from the dropdown results
  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName)
    setShowCityDropdown(false)
  }

  useEffect(() => {
    setValue('city', selectedCity)
  }, [selectedCity, setValue])
  return (
    <div className="relative w-full">
      <label>
        City <span className="text-lg font-semibold text-red-600">*</span>
      </label>
      <div className="flex w-full flex-row justify-between gap-2 rounded-md border-b border-slate-400 bg-slate-100">
        <input
          type="text"
          placeholder="Select a City"
          value={selectedCity ? selectedCity : cityInput}
          onChange={handleCityChange}
          className="w-full rounded bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
        />
        <div className="flex flex-row">
          {selectedCity && (
            <button
              type="button"
              className="border-l border-gray-200 px-1"
              onClick={() => {
                handleSelectCity('')
                setCityInput('')
              }}
            >
              <FontAwesomeIcon icon={faX} className="h-3 w-3 px-1" />
            </button>
          )}
          <button
            type="button"
            className="border-l border-gray-200 px-1"
            onClick={toggleCityDropdown}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`h-4 w-4 transition-all duration-200 ${
                showCityDropdown && 'rotate-180'
              }`}
            />
          </button>
        </div>
      </div>
      {/* Dropdown for cities */}
      <div
        className={`absolute z-10 max-h-40 w-full overflow-y-scroll rounded-b shadow-md ${
          showCityDropdown == true ? 'block' : 'hidden'
        }`}
      >
        {/* Your dropdown content */}
        {cityResults.length > 0
          ? cityResults.map((city) => (
              <button
                key={city._id}
                onClick={() => handleSelectCity(city.name)}
                className="mobileNavItem flex w-full border-b bg-white px-2 py-1 text-left"
                type="button"
              >
                {city.name}
              </button>
            ))
          : cities.map((city, index) => (
              <button
                key={index + 1}
                onClick={() => handleSelectCity(city.name)}
                className="mobileNavItem flex w-full border-b bg-white px-2 py-1 text-left"
                type="button"
              >
                {city.name}
              </button>
            ))}
      </div>
    </div>
  )
}

export default CitySection

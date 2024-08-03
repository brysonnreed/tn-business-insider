import { faChevronDown, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getClient } from 'lib/sanity/sanity.client.cdn'
import { groq } from 'next-sanity'
import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/Form.module.css'

type CitySectionProps = {
  cities: any
  setValue: any
  business: any
  register: any
  errors: any
  control: any
  Controller: any
  clearErrors: any
  getValue: any
}

const City: React.FC<CitySectionProps> = ({
  cities,
  setValue,
  business,
  register,
  errors,
  control,
  Controller,
  clearErrors,
  getValue,
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false) // State to manage the visibility of the dropdowns
  const [selectedCity, setSelectedCity] = useState('') // State to manage the selected city and category
  const [cityResults, setCityResults] = useState([]) // State to store the matching city and category results
  const [cityInput, setCityInput] = useState('') // State to manage the user input for city and category

  const [inputError, setInputError] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    // Set uploaded images from the business prop when it's available
    if (business && business.city) {
      setSelectedCity(business.city)
    }
  }, [business])

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
    console.log('City input change: ', query)
  }
  // Function to handle selecting a city from the dropdown results
  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName)
    setShowCityDropdown(false)
  }
  const isValidCity = (cityName) => {
    return cities.some(
      (city) => city.name.toLowerCase() === cityName.toLowerCase()
    )
  }
  useEffect(() => {
    setValue('city', selectedCity)
  }, [selectedCity, setValue])

  useEffect(() => {
    const currentCity = getValue('city')
    console.log('Current City: ', currentCity) // Let's see what value is retrieved

    if (isValidCity(currentCity)) {
      console.log('Valid City: ', currentCity) // Log it if the city is valid
      setSelectedCity(currentCity)
    } else {
      console.log('Invalid City: ', currentCity) // Log it if the city is invalid
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValue])

  return (
    <div className="relative w-full">
      <label>
        City <span className="text-lg font-semibold text-red-600">*</span>
      </label>

      <div className={styles.input_group}>
        <input
          type="text"
          placeholder="Select a City"
          value={selectedCity ? selectedCity : cityInput}
          onChange={handleCityChange}
          className={`${styles.input_text}  ${
            inputError ? 'border-rose-600' : ''
          }`}
          ref={inputRef}
        />
        {selectedCity && (
          <button
            type="button"
            className="border-l border-gray-200 px-1 transition-all duration-200 hover:text-red-500"
            onClick={() => {
              handleSelectCity('')
              setCityInput('')
            }}
          >
            <FontAwesomeIcon icon={faX} className="h-4 w-4 px-1 " />
          </button>
        )}
        <button
          type="button"
          className="border-l border-gray-200 px-1 transition-all duration-200 hover:text-orange-500"
          onClick={toggleCityDropdown}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`h-4 w-4  ${showCityDropdown && 'rotate-180'}`}
          />
        </button>
      </div>
      {errors.city && (
        <span className="text-red-600">{errors.city.message}</span>
      )}

      {/* Dropdown for cities */}
      <div
        className={`absolute z-10 max-h-40 w-full overflow-y-scroll bg-white px-1  ${
          styles.selectInput
        } rounded-b shadow-md ${showCityDropdown == true ? 'block' : 'hidden'}`}
      >
        {/* Your dropdown content */}
        {cityResults.length > 0
          ? cityResults.map((city) => (
              <button
                key={city._id}
                onClick={() => handleSelectCity(city.name)}
                className="mobileNavItem flex w-full border-b  px-2 py-1 text-left"
                type="button"
              >
                {city.name}
              </button>
            ))
          : cities.map((city, index) => (
              <button
                key={index + 1}
                onClick={() => handleSelectCity(city.name)}
                className="mobileNavItem flex w-full border-b px-2 py-1 text-left"
                type="button"
              >
                {city.name}
              </button>
            ))}
      </div>
    </div>
  )
}

export default City

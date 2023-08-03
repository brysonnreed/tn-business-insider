// CategorySection.tsx
import { faChevronDown, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getClient } from 'lib/sanity.client.cdn'
import { groq } from 'next-sanity'
import React, { useEffect, useState } from 'react'

type CategorySectionProps = {
  setValue: any
  categories: any[]
}

const CategorySection: React.FC<CategorySectionProps> = ({
  setValue,
  categories,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false) // State to manage the visibility of the dropdowns
  const [selectedCategory, setSelectedCategory] = useState('') // State to manage the selected city and category
  const [categoryResults, setCategoryResults] = useState([]) // State to store the matching city and category results
  const [categoryInput, setCategoryInput] = useState('') // State to manage the user input for city and category

  // Function to toggle the visibility of the category dropdown
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown((prevState) => !prevState)
  }

  // Function to search for categories based on the query
  const searchCategories = async (query: string) => {
    const searchQuery = groq`
      *[
        (_type == "businessProfileCategory" && name match "${query}*")
      ] {
        _id,
        name
      }
    `

    const matchingCategories = await getClient().fetch(searchQuery, { query })
    return matchingCategories
  }

  // Function to handle category input changes and trigger search
  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value
    setCategoryInput(query) // Update the categoryInput state with the user's input
    const matchingCategories = await searchCategories(query)
    setShowCategoryDropdown(true) // Display the dropdown when typing in the category input
    setCategoryResults(matchingCategories) // Set the matching categories as dropdown results
  }

  // Function to handle selecting a category from the dropdown results
  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setShowCategoryDropdown(false)
  }

  useEffect(() => {
    setValue('category', selectedCategory)
  }, [selectedCategory, setValue])
  return (
    <div className="relative w-full">
      <label>
        Category <span className="text-lg font-semibold text-red-600">*</span>
      </label>
      <div className="flex w-full flex-row justify-between gap-2 rounded-md border-b border-slate-400 bg-slate-100">
        <input
          type="text"
          placeholder="Select a Category"
          value={selectedCategory ? selectedCategory : categoryInput}
          onChange={handleCategoryChange}
          className="w-full rounded bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
        />
        <div className="flex flex-row">
          {selectedCategory && (
            <button
              type="button"
              className="border-l border-gray-200 px-1"
              onClick={() => {
                handleSelectCategory('')
                setCategoryInput('')
              }}
            >
              <FontAwesomeIcon icon={faX} className="h-3 w-3 px-1" />
            </button>
          )}
          <button
            type="button"
            className="border-l border-gray-200 px-1"
            onClick={toggleCategoryDropdown}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`h-4 w-4 transition-all duration-200 ${
                showCategoryDropdown && 'rotate-180'
              }`}
            />
          </button>
        </div>
      </div>
      {/* Dropdown for categories */}
      <div
        className={`absolute z-10 max-h-40 w-full overflow-y-scroll rounded-b shadow-md  ${
          showCategoryDropdown ? 'block' : 'hidden'
        }`}
      >
        {/* Your dropdown content */}
        {categoryResults
          ? categoryResults.length > 0
            ? categoryResults.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleSelectCategory(category.name)}
                  className="mobileNavItem flex w-full border-b bg-white px-2 py-1 text-left"
                  type="button"
                >
                  {category.name}
                </button>
              ))
            : categories.map((category, index) => (
                <button
                  key={index + 1}
                  onClick={() => handleSelectCategory(category.name)}
                  className="mobileNavItem flex w-full border-b bg-white px-2 py-1 text-left"
                  type="button"
                >
                  {category.name}
                </button>
              ))
          : categories.map((category, index) => (
              <button
                key={index + 1}
                onClick={() => handleSelectCategory(category.name)}
                className="mobileNavItem flex w-full border-b bg-white px-2 py-1 text-left"
                type="button"
              >
                {category.name}
              </button>
            ))}
      </div>
    </div>
  )
}

export default CategorySection

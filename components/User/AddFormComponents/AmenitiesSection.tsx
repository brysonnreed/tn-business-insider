// AmenitiesSection.tsx

import { faPlus, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

interface AmenitiesSectionProps {
  setValue: any
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ setValue }) => {
  const [amenities, setAmenities] = useState<string[]>([])
  const [amenityInput, setAmenityInput] = useState('')

  const handleAddAmenity = () => {
    if (amenityInput.trim() !== '') {
      setAmenities((prevAmenities) => [...prevAmenities, amenityInput.trim()])
      setAmenityInput('')
      setValue('amenities', [...amenities, amenityInput.trim()])
    }
  }

  const handleRemoveAmenity = (index: number) => {
    const updatedAmenities = amenities.filter((_, i) => i !== index)
    setAmenities(updatedAmenities)
    setValue('amenities', updatedAmenities)
  }

  useEffect(() => {
    setValue('amenities', [])
  }, [setValue])

  return (
    <div className="flex w-full flex-col">
      <label>What amenities does your business offer?</label>
      <div className="flex justify-between rounded-md border-b border-slate-400 bg-slate-100 ">
        <input
          value={amenityInput}
          onChange={(e) => setAmenityInput(e.target.value)}
          type="text"
          className="w-full border-slate-400 bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
        />

        <button
          type="button"
          onClick={handleAddAmenity}
          className="ml-1 border-l px-2"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
        </button>
      </div>
      {amenities.length > 0 && (
        <div className="mt-4">
          <label>Amenities you offer:</label>
          <ul className="flex gap-2">
            {amenities.map((amenity, index) => (
              <li
                key={index + 1}
                className="flex items-center justify-between gap-2 rounded border border-gray-300 bg-slate-200 py-1 pl-2"
              >
                <p className="text-lg capitalize">{amenity}</p>
                <button
                  type="button"
                  className="border-l px-1"
                  onClick={() => handleRemoveAmenity(index)}
                >
                  <FontAwesomeIcon icon={faX} className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AmenitiesSection

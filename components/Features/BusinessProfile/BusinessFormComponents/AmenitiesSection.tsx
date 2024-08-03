import { faPlus, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validateAndSanitizeInput } from 'lib/sanitizeUserInput'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import styles from 'styles/Form.module.css'

interface AmenitiesSectionProps {
  setValue: any
  business: any
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  setValue,
  business,
}) => {
  const [amenities, setAmenities] = useState<string[]>([])
  const [amenityInput, setAmenityInput] = useState('')

  useEffect(() => {
    // Set uploaded images from the business prop when it's available
    if (business && business.amenities) {
      setAmenities(business.amenities)
      setValue('amenities', business.amenities)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business])

  const handleAddAmenity = () => {
    if (
      amenityInput.trim() !== '' &&
      validateAndSanitizeInput(amenityInput.trim())
    ) {
      setAmenities((prevAmenities) => [...prevAmenities, amenityInput.trim()])
      setAmenityInput('')
      setValue('amenities', [...amenities, amenityInput.trim()])
    }
    if (!validateAndSanitizeInput(amenityInput.trim())) {
      toast.error('Invalid character in service name.')
    }
  }

  const handleRemoveAmenity = (index: number) => {
    const updatedAmenities = amenities.filter((_, i) => i !== index)
    setAmenities(updatedAmenities)
    setValue('amenities', updatedAmenities)
  }

  return (
    <div className="flex w-full flex-col">
      <label className="mb-2 text-lg font-bold">
        What amenities does your business offer?
      </label>
      <div className={styles.input_group}>
        <input
          value={amenityInput}
          onChange={(e) => setAmenityInput(e.target.value)}
          type="text"
          className={styles.input_text}
        />
        <button
          type="button"
          onClick={handleAddAmenity}
          className="ml-1 border-l px-2 transition-all duration-200 hover:text-black"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
        </button>
      </div>
      {amenities && amenities.length > 0 && (
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

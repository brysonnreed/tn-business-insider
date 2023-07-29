import { faArrowUpFromBracket, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

type LogoSectionProps = {
  setValue: any
}

const LogoSection: React.FC<LogoSectionProps> = ({ setValue }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const logoInputRef = useRef(null)

  useEffect(() => {
    setValue('logo', selectedImage)
  }, [selectedImage, setValue])

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedImage(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
  }

  const onLogoButtonClick = () => {
    logoInputRef.current.click()
  }
  return (
    <div>
      <label>Business Logo</label>
      <div
        id="logo-section"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <div className="image-container">
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Logo"
              width={100}
              height={100}
              className="h-32 w-32 object-contain"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="upload-button"
            >
              Remove Image <FontAwesomeIcon icon={faX} className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <label
            id="label-logo-upload" // Make sure the ID is unique for the logo section
            htmlFor="input-logo-upload" // Update this to match the ID of the input field
            className={`label-file-upload ${dragActive ? 'drag-active' : ''}`}
          >
            <div className="flex flex-col items-center justify-center gap-2 py-5 text-center">
              <p>Drag and drop your logo here or</p>
              <button className="upload-button" onClick={onLogoButtonClick}>
                Upload a file <FontAwesomeIcon icon={faArrowUpFromBracket} />
              </button>
            </div>
            <input
              ref={logoInputRef}
              type="file"
              id="input-logo-upload" // Update this to match the "htmlFor" in the label
              className="input-file-upload"
              data-input-type="logo" // Add data attribute to identify input type
              multiple={false}
              onChange={handleChange}
            />
          </label>
        )}
      </div>
    </div>
  )
}

export default LogoSection

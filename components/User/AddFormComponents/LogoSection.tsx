import { faArrowUpFromBracket, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

type LogoSectionProps = {
  setValue: any
  title: string
  user: any
  required: boolean
}

const LogoSection: React.FC<LogoSectionProps> = ({
  setValue,
  title,
  user,
  required,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const logoInputRef = useRef(null)
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    setValue('logo', selectedImage)
  }, [selectedImage, setValue])

  useEffect(() => {
    if (user && user.image) {
      setSelectedImage(user.image)
      setImageSrc(user.image)
    }
  }, [user])

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

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault()
  //   if (e.target.files && e.target.files[0]) {
  //     setSelectedImage(e.target.files[0])
  //   }
  // }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check if the selected file is an image
      if (selectedFile.type.startsWith('image/')) {
        setSelectedImage(selectedFile)
      } else {
        // Display an error message or perform other actions for non-image files
        toast.error('Please select an image file.')
      }
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImageSrc('')
  }

  const onLogoButtonClick = () => {
    logoInputRef.current.click()
  }
  return (
    <div>
      <label>
        {title}{' '}
        {required == true && (
          <span className="text-lg font-semibold text-red-600">*</span>
        )}
      </label>
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
              src={
                imageSrc != '' ? imageSrc : URL.createObjectURL(selectedImage)
              }
              alt="Selected Logo"
              width={200}
              height={200}
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
              <button
                className="upload-button"
                onClick={onLogoButtonClick}
                type="button"
              >
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

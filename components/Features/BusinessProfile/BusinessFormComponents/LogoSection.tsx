import { faArrowUpFromBracket, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { urlForImage } from 'lib/sanity/sanity.image'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

type LogoSectionProps = {
  setValue: any
  title: string
  user: any
  required: boolean
  business: any
}

const LogoSection: React.FC<LogoSectionProps> = ({
  setValue,
  title,
  user,
  required,
  business,
}) => {
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const logoInputRef = useRef(null)
  const [imageSrc, setImageSrc] = useState('')
  const [businessImage, setBusinessImage] = useState()

  useEffect(() => {
    setValue('logo', selectedImage)
  }, [selectedImage, setValue])

  useEffect(() => {
    if (user && user.image) {
      setSelectedImage(user.image)
      setImageSrc(user.image)
    }
  }, [user])

  useEffect(() => {
    // Set uploaded images from the business prop when it's available
    if (business && business.logo) {
      setBusinessImage(business.logo)
      setSelectedImage(business.logo)
    }
  }, [business])

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

    const files = e.dataTransfer.files

    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const files = e.target.files

    if (files && files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImageSrc('')
    setBusinessImage(null)
  }

  const onLogoButtonClick = () => {
    logoInputRef.current.click()
  }

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported.')
      return
    }

    sanitizeImage(file)
  }

  const sanitizeImage = (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image file size should be less than 10MB.')
      return
    }

    const img = new window.Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        setSelectedImage(new File([blob], file.name, { type: 'image/png' }))
      })

      URL.revokeObjectURL(img.src)
    }
  }
  return (
    <div>
      <label className="mb-2 text-lg font-bold">
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
                imageSrc != ''
                  ? imageSrc
                  : businessImage
                  ? urlForImage(businessImage).url()
                  : URL.createObjectURL(selectedImage)
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
                Upload a file{' '}
                <FontAwesomeIcon
                  icon={faArrowUpFromBracket}
                  className="h-4 w-4"
                />
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

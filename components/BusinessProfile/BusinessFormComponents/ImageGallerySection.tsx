import { faArrowUpFromBracket, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

type ImageGallerySectionProps = {
  setValue: any
  business: any
  setRemovedImages: any
}

type ImageSource = 'user' | 'sanity'

type UploadedImage = {
  source: ImageSource
  image: any
}

const ImageGallerySection: React.FC<ImageGallerySectionProps> = ({
  setValue,
  business,
  setRemovedImages,
}) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const [dragActive, setDragActive] = useState(false)
  const galleryInputRef = useRef(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  useEffect(() => {
    setValue('images', uploadedImages)
  }, [uploadedImages, setValue])

  useEffect(() => {
    // Set uploaded images from the business prop when it's available
    if (business && business.images) {
      const businessImageObjects = business.images.map((img) => ({
        source: 'sanity',
        image: img,
      }))
      setUploadedImages(businessImageObjects)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business])

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const types = e.dataTransfer.types
    const selectedFiles = Array.from(e.dataTransfer.files)
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith('image/')
    )

    if (types.includes('Files') && imageFiles.length) {
      sanitizeImages(imageFiles, handleAddImage)
    } else {
      toast.error('No valid image files were selected.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const selectedFiles = Array.from(e.target.files || [])
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith('image/')
    )

    if (imageFiles.length) {
      sanitizeImages(imageFiles, handleAddImage)
    } else {
      toast.error('No valid image files were selected.')
    }
  }

  const handleAddImage = (files: File[]) => {
    const newImages: UploadedImage[] = files.map((file) => ({
      source: 'user',
      image: file,
    }))
    setUploadedImages((prevImages) => [...prevImages, ...newImages])
  }

  const handleRemoveGalleryImage = (index: number) => {
    if (setRemovedImages) {
      const imageId = uploadedImages[index].image.asset._ref // Assuming your image object has an _id field
      setRemovedImages((prev) => [...prev, imageId])
    }

    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const onGalleryButtonClick = () => {
    galleryInputRef.current.click()
  }

  const sanitizeImages = (files: File[], callback: (files: File[]) => void) => {
    let sanitizedFiles: File[] = []
    let loadedCount = 0

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 10MB size limit.`)
        loadedCount++
        if (loadedCount === files.length) {
          callback(sanitizedFiles)
        }
        return
      }

      const img = new window.Image()
      img.onload = () => {
        loadedCount++
        sanitizedFiles.push(file)
        if (loadedCount === files.length) {
          callback(sanitizedFiles)
        }
      }
      img.onerror = () => {
        loadedCount++
        toast.error(`${file.name} is not a valid image file.`)
        if (loadedCount === files.length) {
          callback(sanitizedFiles)
        }
      }
      img.src = URL.createObjectURL(file)
    })
  }
  return (
    <div>
      <label>Image Gallery</label>
      <div
        id="image-gallery-section"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <label
          id="label-gallery-upload"
          htmlFor="input-gallery-upload"
          className={`label-file-upload ${dragActive ? 'drag-active' : ''}`}
        >
          <div className="flex flex-col items-center justify-center gap-2 py-5 text-center">
            <p>Drag and drop your gallery images here or</p>
            <button
              className="upload-button"
              onClick={onGalleryButtonClick}
              type="button"
            >
              Upload a file <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </button>
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            id="input-gallery-upload"
            className="input-file-upload"
            multiple={true}
            onChange={handleChange}
            data-input-type="gallery"
          />
        </label>
      </div>
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <p className="text-lg">Your gallery images:</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-10 rounded border border-gray-200 bg-slate-100 p-2 shadow-md">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-2"
              >
                <Image
                  src={
                    image.source === 'sanity'
                      ? urlForImage(image.image).url()
                      : URL.createObjectURL(image.image)
                  }
                  alt={`Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="h-20 w-20 object-contain sm:h-32 sm:w-32"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(index)}
                  className="upload-button"
                >
                  Remove <FontAwesomeIcon icon={faX} className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallerySection

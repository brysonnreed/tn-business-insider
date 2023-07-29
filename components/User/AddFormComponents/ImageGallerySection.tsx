import { faArrowUpFromBracket, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

type ImageGallerySectionProps = {
  setValue: any
}

const ImageGallerySection: React.FC<ImageGallerySectionProps> = ({
  setValue,
}) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const galleryInputRef = useRef(null)

  useEffect(() => {
    setValue('images', uploadedImages)
  }, [uploadedImages, setValue])

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddImage(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleAddImage(e.target.files)
    }
  }

  const handleAddImage = (files: FileList) => {
    const newImages = Array.from(files)
    setUploadedImages((prevImages) => [...prevImages, ...newImages])
  }

  const handleRemoveGalleryImage = (index: number) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const onGalleryButtonClick = () => {
    galleryInputRef.current.click()
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
            <button className="upload-button" onClick={onGalleryButtonClick}>
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
                  src={URL.createObjectURL(image)}
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

import { faPlus, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validateAndSanitizeInput } from 'lib/sanitizeUserInput'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import styles from 'styles/Form.module.css'

interface ServiceSectionProps {
  setValue: any
  business: any
}

const ServiceSection: React.FC<ServiceSectionProps> = ({
  setValue,
  business,
}) => {
  const [services, setServices] = useState<string[]>([])
  const [serviceInput, setServiceInput] = useState('')

  useEffect(() => {
    // Set uploaded images from the business prop when it's available
    if (business && business.images) {
      setServices(business.services)
      setValue('services', business.services)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business, setValue])

  const handleAddService = () => {
    if (
      serviceInput.trim() !== '' &&
      validateAndSanitizeInput(serviceInput.trim())
    ) {
      setServices((prevServices) => [...prevServices, serviceInput.trim()])
      setServiceInput('')
      setValue('services', [...services, serviceInput.trim()])
    }
    if (!validateAndSanitizeInput(serviceInput.trim())) {
      toast.error('Invalid character in service name.')
    }
  }

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index)
    setServices(updatedServices)
    setValue('services', updatedServices)
  }

  return (
    <div className="flex w-full flex-col">
      <label>What Services does your business offer?</label>
      <div className={styles.input_group}>
        <input
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
          type="text"
          className={styles.input_text}
        />
        <button
          type="button"
          onClick={handleAddService}
          className="ml-1 border-l px-2 transition-all duration-200 hover:text-black"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4 " />
        </button>
      </div>
      {services && services.length > 0 && (
        <div className="mt-4">
          <label>Services you offer:</label>
          <ul className="flex gap-2">
            {services.map((service, index) => (
              <li
                key={index + 1}
                className="flex items-center justify-between gap-2 rounded border border-gray-300 bg-slate-200 py-1 pl-2"
              >
                <p className="text-lg capitalize">{service}</p>
                <button
                  type="button"
                  className="border-l px-1"
                  onClick={() => handleRemoveService(index)}
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

export default ServiceSection

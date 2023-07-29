import { faPlus, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

interface ServiceSectionProps {
  setValue: any
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ setValue }) => {
  const [services, setServices] = useState<string[]>([])
  const [serviceInput, setServiceInput] = useState('')

  const handleAddService = () => {
    if (serviceInput.trim() !== '') {
      setServices((prevServices) => [...prevServices, serviceInput.trim()])
      setServiceInput('')
      setValue('services', [...services, serviceInput.trim()])
    }
  }

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index)
    setServices(updatedServices)
    setValue('services', updatedServices)
  }

  useEffect(() => {
    setValue('services', [])
  }, [setValue])
  return (
    <div className="flex w-full flex-col">
      <label>What Services does your business offer?</label>
      <div className="flex justify-between rounded-md border-b border-slate-400 bg-slate-100 ">
        <input
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
          type="text"
          className="w-full border-slate-400 bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
        />

        <button
          type="button"
          onClick={handleAddService}
          className="ml-1 border-l px-2"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
        </button>
      </div>
      {services.length > 0 && (
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

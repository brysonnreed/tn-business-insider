import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import styles from 'styles/Form.module.css'

import AptSuiteOther from './AddressComponents/AptSuiteOther'
import City from './AddressComponents/City'
import StreetAddress from './AddressComponents/StreetAddress'
import ZipCode from './AddressComponents/ZipCode'

function AddressSection({
  register,
  errors,
  setValue,
  cities,
  control,
  Controller,
  clearErrors,
  business,
  getValue,
}) {
  const addressInputRef = useRef(null)
  const [placeName, setPlaceName] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!(window as any).google) return

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ['geocode'], // Restrict results to geographical locations
        componentRestrictions: { country: 'us' }, // Limit to the US
      }
    )

    const setAddressValueAndTriggerAutocomplete = (newAddress) => {
      setValue('address', newAddress)
      const newPlace = {
        place_id: newAddress.place_id,
        formatted_address: newAddress.formatted_address,
        name: newAddress.name,
        url: newAddress.url,
        geometry: newAddress.geometry,
      }

      google.maps.event.trigger(autocomplete, 'place_changed', {
        place: newPlace,
      })
    }

    if (business && business.address) {
      setPlaceName(business.address.formatted_address)
      setAddressValueAndTriggerAutocomplete({
        place_id: business.address.place_id,
        formatted_address: business.address.formatted_address,
        name: business.address.name,
        url: business.address.url,
        geometry: business.address.geometry,
      })
    }

    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace()

      if (
        !place.formatted_address.toLowerCase().includes('tennessee') &&
        !place.formatted_address.toLowerCase().includes('tn')
      ) {
        // Show a toast message
        toast.error('Please select an address in Tennessee (TN)')
        return
      }
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'")
        return
      }

      // Extract latitude and longitude from the place's geometry location
      const latitude = place.geometry.location.lat()
      const longitude = place.geometry.location.lng()

      // Update the address object with latitude and longitude
      const address = {
        place_id: place.place_id,
        formatted_address: place.formatted_address,
        name: place.name,
        url: place.url,
        geometry: {
          latitude,
          longitude,
        },
      }

      setValue('address', address)
    })

    // Specify just the place data fields that you need.
    autocomplete.setFields([
      'place_id',
      'geometry',
      'name',
      'formatted_address',
      'url',
      'address_components',
    ])

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()

      const streetNumber = getAddressComponent(place, 'street_number')
      const streetName = getAddressComponent(place, 'route')
      const city = getAddressComponent(place, 'locality')
      const state = getAddressComponent(place, 'administrative_area_level_1')
      const zipCode = getAddressComponent(place, 'postal_code')
      const aptSuiteOther = getAddressComponent(place, 'subpremise') // This may not always exist.

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and pressed the Enter key, or the Place Details request failed.
        return
      }

      setPlaceName(place.name)
      function getAddressComponent(place, componentName) {
        for (let i = 0; i < place.address_components.length; i++) {
          const component = place.address_components[i]
          if (component.types.includes(componentName)) {
            return component.long_name || component.short_name
          }
        }
        return null
      }
      setValue('city', city)
      setValue('zipCode', zipCode)
      setValue('aptSuiteOther', aptSuiteOther)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex flex-col items-center gap-8 sm:gap-4 ">
      <div className="flex w-full flex-col gap-8 sm:flex-row">
        <div className="w-full sm:w-2/3">
          {/* <StreetAddress register={register} errors={errors} /> */}
          <label className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label>Street address (optional)</label>
              <div className={`${styles.input_group}`}>
                <input
                  {...register('streetAddress', {
                    required: false,
                  })}
                  ref={addressInputRef}
                  className={styles.input_text}
                  placeholder="Street address (optional)"
                  type="text"
                />
              </div>
              {errors.streetAddress?.type == 'validate' && (
                <div className="mt-2 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="h-4 w-4 text-red-500"
                  />
                  <p className="text-sm text-red-500">
                    Invalid characters are not allowed
                  </p>
                </div>
              )}
            </div>
          </label>
        </div>
        <div className="w-full sm:w-1/3">
          <AptSuiteOther register={register} errors={errors} />
        </div>
      </div>
      <div className="flex w-full flex-col gap-8 sm:flex-row">
        <div className="w-full sm:w-1/2">
          <City
            register={register}
            errors={errors}
            business={null}
            setValue={setValue}
            cities={cities}
            control={control}
            Controller={Controller}
            clearErrors={clearErrors}
            getValue={getValue}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <ZipCode register={register} errors={errors} />
        </div>
      </div>
    </div>
  )
}

export default AddressSection

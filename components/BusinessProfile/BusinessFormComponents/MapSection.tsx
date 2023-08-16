import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import styles from 'styles/Form.module.css'

const MapSection = ({ register, setValue, errors, business }) => {
  const addressInputRef = useRef(null)
  const [placeName, setPlaceName] = useState('')
  const tennesseePrefix = 'TN, '

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

    const map = new (window as any).google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 7,
        center: {
          lat: 35.5175,
          lng: -86.5804, // center the map over Tennessee
        },
      }
    )
    const marker = new (window as any).google.maps.Marker({ map: map })
    marker.addListener('click', () => {
      infowindow.open(map, marker)
    })
    const infowindow = new (window as any).google.maps.InfoWindow()
    const infowindowContent = document.getElementById('infowindow-content')

    const setMapAndAutocompleteToGeometry = (place) => {
      const { latitude, longitude } = place.geometry
      const location = new (window as any).google.maps.LatLng(
        latitude,
        longitude
      )

      // Set map center and zoom to the geometry location
      map.setCenter(location)
      map.setZoom(17)

      marker.setPlace({
        placeId: place.place_id,
        location: location,
      })
      marker.setVisible(true)
      infowindow.setContent(infowindowContent)
      infowindow.open(map, marker)
      if (!infowindowContent) return
      let placeNameElement = infowindowContent.querySelector('#place-name')
      if (placeNameElement) {
        placeNameElement.textContent = place.name
      }

      // Set autocomplete bounds to the geometry location
      autocomplete.setBounds(
        new (window as any).google.maps.LatLngBounds(location)
      )
    }

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
      setMapAndAutocompleteToGeometry(business.address)
    } else {
      if (placeName == '') {
        addressInputRef.current.value = tennesseePrefix + placeName
      }
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

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport)
      } else {
        map.setCenter(place.geometry.location)
        map.setZoom(17)
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
    ])
    autocomplete.bindTo('bounds', map)

    infowindow.setContent(infowindowContent)

    marker.addListener('click', () => {
      infowindow.open(map, marker)
    })
    infowindow.addListener('closeclick', () => {
      // clear the input field
      setValue('address', '')
      if (addressInputRef.current) {
        addressInputRef.current.value = ''
      }
      marker.setVisible(false)
    })
    autocomplete.addListener('place_changed', () => {
      infowindow.close()

      const place = autocomplete.getPlace()

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and pressed the Enter key, or the Place Details request failed.
        return
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport)
      } else {
        map.setCenter(place.geometry.location)
        map.setZoom(17)
      }
      marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location,
      })
      marker.setVisible(true)
      setPlaceName(place.name)
      infowindow.open(map, marker)
      if (!infowindowContent) return
      let placeNameElement = infowindowContent.querySelector('#place-name')
      if (placeNameElement) {
        placeNameElement.textContent = place.name
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <p>
        Business Address{' '}
        <span className="text-lg font-semibold text-red-600">*</span>
      </p>
      <div
        className={`${styles.input_group} mb-4 ${
          errors.address?.type === 'required' ? 'border-rose-600' : ''
        }`}
      >
        <input
          {...register('address', { required: true })}
          ref={addressInputRef}
          className={styles.input_text}
          placeholder="Search for your business address"
          type="text"
          aria-invalid={errors.address ? 'true' : 'false'}
          defaultValue={placeName} // Use the new handler
        />
      </div>

      {/* Map container */}
      <div id="map" style={{ width: '100%', height: '400px' }} />

      {/* InfoWindow container */}
      <div id="infowindow-content">
        <p className="block font-semibold">{placeName}</p>{' '}
      </div>
    </div>
  )
}

export default MapSection

import React, { useEffect, useRef, useState } from 'react'

const MapSection = ({ register, setValue, errors }) => {
  const addressInputRef = useRef(null)
  const [placeName, setPlaceName] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!(window as any).google) return

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      addressInputRef.current
    )

    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace()
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
      const address = {
        place_id: place.place_id,
        formatted_address: place.formatted_address,
        name: place.name,
        url: place.url,
      }

      setValue('address', address)
    })

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

    // Specify just the place data fields that you need.
    autocomplete.setFields([
      'place_id',
      'geometry',
      'name',
      'formatted_address',
      'url',
    ])
    autocomplete.bindTo('bounds', map)

    const infowindow = new (window as any).google.maps.InfoWindow()
    const infowindowContent = document.getElementById('infowindow-content')

    infowindow.setContent(infowindowContent)

    const marker = new (window as any).google.maps.Marker({ map: map })
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
    <>
      <p>Business Address</p>
      <input
        {...register('address', { required: true })}
        ref={addressInputRef}
        className="rounded-md border-b border-slate-400 bg-slate-100 px-4 py-1 text-base outline-none transition-all duration-300 placeholder:text-sm focus-within:border-slate-600 focus-within:shadow-xl hover:border-slate-600"
        placeholder="Search for your business address"
        type="text"
        aria-invalid={errors.address ? 'true' : 'false'}
      />

      {/* Map container */}
      <div id="map" style={{ width: '100%', height: '400px' }} />

      {/* InfoWindow container */}
      <div id="infowindow-content">
        <p className="block font-semibold">{placeName}</p>{' '}
      </div>
    </>
  )
}

export default MapSection

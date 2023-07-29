import { faCompass, faRoute } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api'
import { useEffect, useState } from 'react'

const MapComponent = ({ businessProfile }) => {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  useEffect(() => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      { address: businessProfile.address.formatted_address },
      (results, status) => {
        if (status === 'OK') {
          const { lat, lng } = results[0].geometry.location
          setLatitude(lat())
          setLongitude(lng())
        } else {
          console.error(
            'Geocode was not successful for the following reason:',
            status
          )
        }
      }
    )
  }, [businessProfile.address.formatted_address])

  const center = { lat: latitude, lng: longitude }

  return (
    <section className="flex items-center justify-center rounded-md border border-gray-300 shadow-lg">
      {latitude && longitude && (
        <GoogleMap
          mapContainerStyle={{ width: '1000px', height: '650px' }}
          center={center}
          zoom={15}
        >
          <Marker position={center} />
          <InfoWindow
            position={{ lat: latitude + 0.001, lng: longitude }} // Position in the top right corner
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }} // Adjust pixel offset to adjust position
          >
            <div className="info-window">
              <div className="flex flex-col items-start justify-center">
                <h2>{businessProfile.address.name}</h2>
                <p>{businessProfile.address.formatted_address}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  businessProfile.address.formatted_address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faRoute} className="h-5 w-5" />
                Directions
              </a>
            </div>
          </InfoWindow>
        </GoogleMap>
      )}
    </section>
  )
}

export default MapComponent

import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api'

const MapComponent = ({ businessProfile }) => {
  const { formatted_address, name, geometry } = businessProfile.address

  // Check if geometry exists
  if (!geometry) {
    return (
      <section className="flex min-h-[30vh] items-center justify-center rounded-md border border-gray-300 bg-slate-200 shadow-lg">
        <p>Map not available</p>
      </section>
    )
  }

  const center = {
    lat: geometry.latitude,
    lng: geometry.longitude,
  }

  return (
    <section className="flex items-center justify-center rounded-md border border-gray-300 shadow-lg">
      <GoogleMap
        mapContainerStyle={{ width: '100vw', height: '650px' }}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
        <InfoWindow position={{ lat: center.lat + 0.001, lng: center.lng }}>
          <div className="info-window">
            <div className="flex flex-col items-start justify-center">
              <h2>{name}</h2>
              <p>{formatted_address}</p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                formatted_address
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
    </section>
  )
}

export default MapComponent

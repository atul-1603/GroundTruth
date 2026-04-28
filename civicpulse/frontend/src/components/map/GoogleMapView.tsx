import React from 'react'
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api'
import { Spinner } from '../ui/Spinner'

interface GoogleMapViewProps {
  activities?: any[]
  volunteers?: any[]
  height?: string
}

export const GoogleMapView = ({ activities = [], volunteers = [], height = "400px" }: GoogleMapViewProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  })

  if (!isLoaded) return <div className="w-full bg-dark-card border border-dark-border rounded-xl flex items-center justify-center" style={{height}}><Spinner /></div>

  const center = activities.length > 0 ? activities[0].location : { lat: 20.5937, lng: 78.9629 } // India center

  return (
    <div className="rounded-xl overflow-hidden border border-dark-border" style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={5}
        options={{
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
          ]
        }}
      >
        {activities.map(act => (
          <Marker 
            key={act.activityId || act.id} 
            position={act.location}
            icon={{
              url: act.priorityScore >= 8 ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' :
                   act.priorityScore >= 5 ? 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png' :
                   'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }}
          />
        ))}
        {activities.map(act => act.assignedArea && (
          <Circle
            key={`circle-${act.activityId || act.id}`}
            center={act.assignedArea.center || act.location}
            radius={act.assignedArea.radiusMeters || 1000}
            options={{
              fillColor: act.priorityScore >= 8 ? '#ef4444' : '#f97316',
              fillOpacity: 0.2,
              strokeColor: act.priorityScore >= 8 ? '#ef4444' : '#f97316',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        ))}
      </GoogleMap>
    </div>
  )
}

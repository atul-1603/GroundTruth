import React from 'react'
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api'
import { Spinner } from '../ui/Spinner'

interface GoogleMapViewProps {
  activities?: any[]
  volunteers?: any[]
  ngo?: any
  height?: string
}

export const GoogleMapView = ({ activities = [], volunteers = [], ngo, height = "400px" }: GoogleMapViewProps) => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  })

  if (!isLoaded) return <div className="w-full bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center" style={{height}}><Spinner /></div>

  const defaultCenter = { lat: 19.0760, lng: 72.8777 } // Mumbai center
  const center = ngo?.lat ? { lat: ngo.lat, lng: ngo.lng } : (ngo?.location || (activities.length > 0 && activities[0].location?.lat ? activities[0].location : defaultCenter))
  const zoom = (ngo?.lat || ngo?.location) ? 14 : 12


  const mapStyles = [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [{ "weight": "2.00" }]
    },
    {
      "featureType": "all",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#9c9c9c" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [{ "visibility": "on" }]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{ "color": "#f2f2f2" }]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#7b7b7b" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#c8d7d4" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#070707" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#ffffff" }]
    }
  ]

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner" style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >


        {ngo?.lat && (
          <Marker 
            position={{ lat: ngo.lat, lng: ngo.lng }} 
            label={{ text: "NGO HQ", className: "bg-white px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 shadow-sm" }}
            icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          />
        )}
        {activities.map(act => (
          <Marker 
            key={act.activityId || act.id} 
            position={act.location}
            icon={{
              url: act.status === 'resolved' ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' :
                   act.priorityScore >= 8 ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' :
                   act.priorityScore >= 5 ? 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png' :
                   'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
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

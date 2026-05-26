'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useRouter } from 'next/navigation'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import type { Location } from '@/types'

/**
 * Vintage brass-medallion pin: teardrop with a radial brass gradient,
 * cream inset, and a compass star. The SVG sits in a 48px-wide hit area
 * (≥44pt touch target). The inner wrapper handles hover transforms so we
 * don't clobber Leaflet's positioning transform on the outer marker.
 */
const vintageMarkerIcon = L.divIcon({
  className: 'vintage-marker leaflet-touch-marker',
  html: `<div class="vintage-marker-inner">
    <svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vm-brass" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stop-color="#fff6cf"/>
          <stop offset="35%" stop-color="#f0d488"/>
          <stop offset="75%" stop-color="#bf975a"/>
          <stop offset="100%" stop-color="#8a6c34"/>
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="50" rx="6" ry="1.6" fill="rgba(0,0,0,0.28)"/>
      <path d="M20 2 C10 2 2 10 2 20 C2 30 12 38 20 50 C28 38 38 30 38 20 C38 10 30 2 20 2 Z"
        fill="url(#vm-brass)" stroke="#6b5430" stroke-width="1.3"/>
      <circle cx="20" cy="20" r="9.5" fill="#f5ead0" stroke="#6b5430" stroke-width="0.9"/>
      <path d="M20 11.5 L21.7 18.3 L28.5 20 L21.7 21.7 L20 28.5 L18.3 21.7 L11.5 20 L18.3 18.3 Z" fill="#6b5430"/>
    </svg>
  </div>`,
  iconSize: [48, 52],
  iconAnchor: [24, 50],
})

export function Map({ locations }: { locations: Location[] }) {
  const router = useRouter()

  return (
    <MapContainer
      center={[47.6062, -122.3321]}
      zoom={12}
      style={{ height: '100vh', width: '100%' }}
      className="touch-manipulation z-0"
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains={['a', 'b', 'c', 'd']}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={20}
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          icon={vintageMarkerIcon}
          position={[location.lat, location.lng]}
          eventHandlers={{
            click: () => {
              router.push(`/location/${location.id}`)
            },
          }}
        />
      ))}
    </MapContainer>
  )
}

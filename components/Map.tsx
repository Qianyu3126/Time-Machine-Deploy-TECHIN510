'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useRouter } from 'next/navigation'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import type { Location } from '@/types'

const MARKER_ICON_URL =
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const MARKER_ICON_2X_URL =
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'

/** Runs once when this module loads on the client, before any Map render */
L.Icon.Default.mergeOptions({
  iconUrl: MARKER_ICON_URL,
  iconRetinaUrl: MARKER_ICON_2X_URL,
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/** 48×48 hit area (≥44pt) with pin anchored at bottom center for accurate geoposition */
const touchTargetMarkerIcon = L.divIcon({
  className: 'leaflet-touch-marker',
  html: `<div style="width:48px;height:48px;display:flex;align-items:flex-end;justify-content:center;box-sizing:border-box;">
      <img src="${MARKER_ICON_URL}" srcset="${MARKER_ICON_2X_URL} 2x" width="25" height="41" alt="" style="display:block;pointer-events:none;" />
    </div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
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
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((location) => (
        <Marker
          key={location.id}
          icon={touchTargetMarkerIcon}
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

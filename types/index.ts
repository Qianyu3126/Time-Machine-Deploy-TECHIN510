export interface Location {
  id: number
  name: string
  lat: number
  lng: number
  description: string
}

export interface HistoricalPhoto {
  id: number
  locationId: number
  year: number
  caption: string
  imageUrl: string
  source: string
  sourceUrl: string
}

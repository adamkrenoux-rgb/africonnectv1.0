'use client'

import { useEffect, useRef } from 'react'

interface BusinessMapProps {
  coordinates: [number, number] // [latitude, longitude]
  businessName: string
  address: string
}

export default function BusinessMap({ coordinates, businessName, address }: BusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current || !coordinates) return

    // Check if Google Maps is available
    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      const google = (window as any).google
      const [lat, lng] = coordinates

      const map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#1f2937' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca3af' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#111827' }]
          }
        ]
      })

      new google.maps.Marker({
        position: { lat, lng },
        map,
        title: businessName,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#F59E0B" stroke="#000" stroke-width="2"/>
              <circle cx="16" cy="16" r="6" fill="#000"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      new google.maps.InfoWindow({
        content: `
          <div style="color: #000; padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${businessName}</h3>
            <p style="margin: 0; color: #666; font-size: 12px;">${address}</p>
          </div>
        `
      }).open(map, new google.maps.Marker({
        position: { lat, lng },
        map
      }))
    } else {
      // Fallback: Use OpenStreetMap via Leaflet or static image
      const [lat, lng] = coordinates
      const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s+ffa500(${lng},${lat})/${lng},${lat},15,0/600x300?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`
      
      // Or use OpenStreetMap static image
      const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`
      
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="width: 100%; height: 300px; background: #1f2937; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
            <iframe 
              width="100%" 
              height="100%" 
              frameborder="0" 
              scrolling="no" 
              marginheight="0" 
              marginwidth="0" 
              src="${osmUrl}"
              style="border: none;"
            ></iframe>
            <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
              <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15" target="_blank" style="color: #F59E0B; text-decoration: none;">
                View on OpenStreetMap
              </a>
            </div>
          </div>
        `
      }
    }
  }, [coordinates, businessName, address])

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg overflow-hidden bg-gray-700"
        style={{ minHeight: '300px' }}
      />
      <p className="text-gray-400 text-xs mt-2 text-center">
        {address}
      </p>
    </div>
  )
}


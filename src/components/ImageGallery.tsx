'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageGalleryProps {
  images: string[]
  businessName: string
}

export default function ImageGallery({ images, businessName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!images || images.length === 0) {
    return (
      <div className="relative h-64 bg-gradient-to-br from-yellow-600/20 to-orange-500/20 rounded-lg flex items-center justify-center">
        <span className="text-6xl">🏢</span>
        <p className="absolute bottom-4 text-gray-400 text-sm">No images available</p>
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.slice(0, 6).map((image, index) => (
          <div
            key={index}
            className={`relative cursor-pointer overflow-hidden rounded-lg ${
              index === 0 ? 'md:col-span-2 md:row-span-2 h-64' : 'h-32'
            }`}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image}
              alt={`${businessName} - Image ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {index === 5 && images.length > 6 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold">+{images.length - 6} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <Button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-white"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="relative w-full h-[80vh]">
              <Image
                src={images[selectedIndex]}
                alt={`${businessName} - Image ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {images.length > 1 && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}


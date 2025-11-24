'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SearchAndFilter } from '@/components/SearchAndFilter'
import { Pagination } from '@/components/Pagination'
import { Star, MapPin, Clock, CheckCircle2 } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  pricing: number
  duration: string
  activityType: string
  verified: boolean
  business: {
    id: string
    businessName: string
    city: string
    country: string
    verificationBadge: boolean
    reviews: Array<{ rating: number }>
  }
  businessRating: number
  bookingCount: number
}

export default function BrowseExperiencesPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<any>({})
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  })

  useEffect(() => {
    fetchListings()
  }, [pagination.currentPage, filters])

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        pageSize: pagination.itemsPerPage.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.activityType && { activityType: filters.activityType }),
        ...(filters.verified !== undefined && { verified: String(filters.verified) }),
        ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() })
      })

      const response = await fetch(`/api/listings?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setListings(data.listings || [])
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            totalPages: data.pagination.totalPages,
            totalItems: data.pagination.totalItems,
            itemsPerPage: data.pagination.itemsPerPage
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, currentPage: 1 })) // Reset to first page on filter change
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
              Africonnect
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-yellow-600 font-semibold">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/travelers/dashboard">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Browse Experiences</h1>
          <p className="text-xl text-gray-300">Discover authentic African adventures from verified local businesses</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchAndFilter
            resourceType="listings"
            onFiltersChange={handleFiltersChange}
            showLocationFilter={true}
            showPriceFilter={true}
            showVerifiedFilter={true}
            showActivityFilter={true}
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Loading experiences...</p>
          </div>
        ) : listings.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Experiences Found</h3>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </Card>
        ) : (
          <>
            {/* Listings Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {listings.map((listing) => (
                <Card key={listing.id} className="bg-gray-800 border-gray-700 overflow-hidden hover:border-yellow-500 transition-colors">
                  <Link href={`/experiences/${listing.id}`}>
                    <div className="relative h-48 bg-gray-700">
                      <Image
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                      {listing.verified && (
                        <div className="absolute top-2 right-2 bg-green-500 text-black px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{listing.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.business.city}, {listing.business.country}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white font-semibold">{listing.businessRating.toFixed(1)}</span>
                          <span className="text-gray-400 text-sm">({listing.bookingCount} bookings)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{listing.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-yellow-400">${listing.pricing}</span>
                          <span className="text-gray-400 text-sm ml-1">per person</span>
                        </div>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}


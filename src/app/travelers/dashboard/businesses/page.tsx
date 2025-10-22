'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Business {
  id: string
  businessName: string
  description: string
  location: string
  city: string
  country: string
  businessType: string
  verificationBadge: boolean
  trustScore: number
  listings: Array<{
    id: string
    title: string
    pricing: number
    activityType: string
  }>
  _count: {
    reviews: number
    bookings: number
  }
}

export default function TravelerBusinessesPage() {
  const [activeTab, setActiveTab] = useState('listings')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('/api/businesses?verified=true')
        const data = await response.json()
        if (data.success) {
          setBusinesses(data.businesses)
        }
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  const filteredData = activeTab === 'listings' ? businesses : bookings

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                AFRICONNECT
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Profile</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Business Listings</h1>
              <p className="text-xl text-gray-300">Discover authentic African businesses and experiences</p>
            </div>
            <Link href="/plan-trip">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Plan Your Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <Button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-3 ${
              activeTab === 'listings'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Browse Listings ({businesses.length})
          </Button>
          <Button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 ${
              activeTab === 'bookings'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            My Bookings ({bookings.length})
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Loading...</p>
          </div>
        ) : activeTab === 'listings' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="bg-gray-800 border-gray-700 p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">{business.businessName}</h3>
                    {business.verificationBadge && (
                      <span className="bg-green-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{business.description}</p>
                  <p className="text-yellow-500 text-sm">{business.city}, {business.country}</p>
                  <p className="text-gray-400 text-xs capitalize">{business.businessType.toLowerCase().replace('_', ' ')}</p>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{business._count.reviews} reviews</span>
                    <span>{business._count.bookings} bookings</span>
                    <span>Trust Score: {Math.round(business.trustScore * 100)}%</span>
                  </div>
                </div>

                {business.listings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Available Experiences:</h4>
                    <div className="space-y-2">
                      {business.listings.slice(0, 2).map((listing) => (
                        <div key={listing.id} className="bg-gray-700 p-3 rounded">
                          <p className="text-white text-sm font-medium">{listing.title}</p>
                          <p className="text-yellow-500 text-sm">${listing.pricing} • {listing.activityType}</p>
                        </div>
                      ))}
                      {business.listings.length > 2 && (
                        <p className="text-gray-400 text-xs">+{business.listings.length - 2} more experiences</p>
                      )}
                    </div>
                  </div>
                )}

                <Link href={`/experiences/${business.id}`}>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                    View Details
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-gray-800 border-yellow-500/30 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{booking.listingTitle}</h3>
                    <p className="text-gray-300 mb-2">with {booking.businessName}</p>
                    <p className="text-gray-400 text-sm">Date: {booking.bookingDate}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">{booking.totalAmount}</div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === 'Confirmed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : booking.status === 'Pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View Details
                    </Button>
                    {booking.status === 'Confirmed' && (
                      <Button className="bg-green-500 hover:bg-green-600 text-white">
                        Manage Booking
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredData.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-white mb-4">No {activeTab === 'listings' ? 'business listings' : 'bookings'} yet</h3>
            <p className="text-gray-300 mb-6">
              {activeTab === 'listings' 
                ? 'Businesses will appear here once they create their profiles and get verified.'
                : 'Your confirmed bookings will appear here. Start planning your trip to make your first booking!'
              }
            </p>
            {activeTab === 'listings' ? (
              <Link href="/plan-trip">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Plan Your Trip
                </Button>
              </Link>
            ) : (
              <Link href="/travelers/dashboard/businesses">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse Listings
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

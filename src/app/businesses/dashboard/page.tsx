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

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch businesses (for now, this will be empty until we have real data)
        const response = await fetch('/api/businesses')
        const data = await response.json()
        if (data.success) {
          setBusinesses(data.businesses)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: null },
    { id: 'connections', name: 'Connections', icon: null },
    { id: 'collabs', name: 'Collabs', icon: null },
    { id: 'bookings', name: 'Bookings', icon: null },
    { id: 'content', name: 'Post Content', icon: null },
    { id: 'mybusiness', name: 'My Business', icon: null },
    { id: 'analytics', name: 'Analytics', icon: null }
  ]

  const collabOffers = []

  const messages = []

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
              <Link href="/businesses" className="text-yellow-600 font-semibold">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Profile</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Navigation */}
      <section className="py-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`px-4 py-2 text-sm font-semibold ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
                }`}
              >
                {tab.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Business Overview</h2>
              <p className="text-gray-300">Your business performance at a glance</p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">Loading...</p>
              </div>
            ) : businesses.length > 0 ? (
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
                        <h4 className="text-white font-medium mb-2">Your Listings:</h4>
                        <div className="space-y-2">
                          {business.listings.slice(0, 2).map((listing) => (
                            <div key={listing.id} className="bg-gray-700 p-3 rounded">
                              <p className="text-white text-sm font-medium">{listing.title}</p>
                              <p className="text-yellow-500 text-sm">${listing.pricing} • {listing.activityType}</p>
                            </div>
                          ))}
                          {business.listings.length > 2 && (
                            <p className="text-gray-400 text-xs">+{business.listings.length - 2} more listings</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Link href={`/businesses/dashboard/listings`}>
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                        Manage Listings
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-white mb-4">Welcome to Your Business Dashboard</h3>
                <p className="text-gray-300 mb-6">Start by creating your first listing to begin connecting with travelers</p>
                <Link href="/business/setup">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Create Your First Listing
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Your Connections</h2>
              <p className="text-gray-300">Manage your client relationships and collaborations</p>
            </div>
            
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-4">No Messages Yet</h3>
              <p className="text-gray-300 mb-6">Start by creating listings to connect with travelers</p>
              <Link href="/business/setup">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Create Your First Listing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Collabs Tab */}
      {activeTab === 'collabs' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Collaborations</h2>
              <p className="text-gray-300">Manage your influencer partnerships</p>
            </div>
            
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-4">No Collaborations Yet</h3>
              <p className="text-gray-300 mb-6">Browse available campaigns to start collaborating with influencers</p>
              <Link href="/businesses/dashboard/collaborations">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse Collaborations
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Your Bookings</h2>
              <p className="text-gray-300">Manage your reservations and client bookings</p>
            </div>
            
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-4">No Bookings Yet</h3>
              <p className="text-gray-300 mb-6">Create listings to start receiving bookings from travelers</p>
              <Link href="/business/setup">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Create Your First Listing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Post Content</h2>
              <p className="text-gray-300">Share updates and engage with your audience</p>
            </div>
            
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-4">Content Creation</h3>
              <p className="text-gray-300 mb-6">Share photos, videos, and stories to showcase your business</p>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Create Post
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* My Business Tab */}
      {activeTab === 'mybusiness' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">My Business</h2>
              <p className="text-gray-300">Manage your business profile and listings</p>
            </div>
            
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-4">Set Up Your Business</h3>
              <p className="text-gray-300 mb-6">Complete your business profile and create your first listing</p>
              <Link href="/business/setup">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Set Up Business
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Analytics</h2>
              <p className="text-gray-300">Track your business performance and insights</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">ANALYTICS</div>
              <h3 className="text-2xl font-semibold text-white mb-4">View Your Analytics</h3>
              <p className="text-gray-300 mb-6">Track your performance, conversion rates, and campaign projections</p>
              <Link href="/businesses/dashboard/analytics">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
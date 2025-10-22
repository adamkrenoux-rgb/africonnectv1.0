'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Business } from '@prisma/client'
import Link from 'next/link'

interface BusinessDashboardProps {
  user: User & {
    business: Business | null
    travelerBookings: any[]
  }
}

export default function BusinessDashboard({ user }: BusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!user.business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold mb-2">Complete Your Business Profile</h3>
            <p className="text-gray-600 mb-6">
              Set up your business profile to start listing experiences and connecting with travelers.
            </p>
            <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
              <Link href="/business/setup">Set Up Business</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const business = user.business
  const recentBookings = user.travelerBookings.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{business.businessName}</h1>
              <p className="text-gray-600">Manage your business and connect with travelers</p>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link href="/business/listings/new">Add Listing</Link>
              </Button>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/business/analytics">View Analytics</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">📊</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{recentBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">💰</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${recentBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">⭐</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Trust Score</p>
                  <p className="text-2xl font-bold text-gray-900">{business.trustScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">✅</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verification</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {business.verificationBadge ? 'Verified' : 'Pending'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'listings', name: 'Listings', icon: '📝' },
              { id: 'bookings', name: 'Bookings', icon: '📅' },
              { id: 'campaigns', name: 'Campaigns', icon: '📱' },
              { id: 'analytics', name: 'Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-africa-earth text-africa-earth'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/business/listings/new">
                        <span className="mr-2">➕</span>
                        Add New Listing
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/business/verification">
                        <span className="mr-2">✅</span>
                        Get Verified
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/campaigns">
                        <span className="mr-2">📱</span>
                        Find Influencers
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No bookings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{booking.listing.title}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${booking.totalAmount}</p>
                            <p className="text-sm text-gray-500">{booking.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {!business.verificationBadge && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">⚠️</div>
                    <div>
                      <h3 className="font-semibold text-orange-800">Get Verified</h3>
                      <p className="text-orange-700">
                        Complete your verification to get the "✅ Verified Local Partner" badge and boost your visibility.
                      </p>
                      <Button asChild className="mt-2 bg-orange-600 hover:bg-orange-700">
                        <Link href="/business/verification">Start Verification</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Listings</h3>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/business/listings/new">Add New Listing</Link>
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-4">Create your first listing to start attracting travelers</p>
                <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                  <Link href="/business/listings/new">Create Listing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            {recentBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Your bookings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              recentBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{booking.listing.title}</h3>
                        <p className="text-gray-600">{booking.listing.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                          <p>Traveler: {booking.traveler.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${booking.totalAmount}</p>
                        <p className="text-sm text-gray-500">{booking.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Influencer Campaigns</h3>
              <p className="text-gray-600 mb-4">Connect with travel influencers to promote your business</p>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/campaigns">Browse Campaigns</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Business Analytics</h3>
              <p className="text-gray-600 mb-4">View detailed insights about your business performance</p>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/business/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

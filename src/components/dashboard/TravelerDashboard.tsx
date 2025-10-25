'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { User } from '@prisma/client'
import Link from 'next/link'

interface TravelerDashboardProps {
  user: any
}

export default function TravelerDashboard({ user }: TravelerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const upcomingBookings = user.travelerBookings.filter(
    (booking: any) => new Date(booking.bookingDate) > new Date()
  )

  const pastBookings = user.travelerBookings.filter(
    (booking: any) => new Date(booking.bookingDate) <= new Date()
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600">Plan your next authentic African adventure</p>
            </div>
            <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
              <Link href="/plan-trip">Plan New Trip</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">🧭</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{user.travelerBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">📅</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">✅</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{pastBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">⭐</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
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
              { id: 'upcoming', name: 'Upcoming Trips', icon: '📅' },
              { id: 'past', name: 'Past Trips', icon: '✅' },
              { id: 'saved', name: 'Saved Trips', icon: '❤️' }
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
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button asChild variant="outline" className="h-20 flex-col">
                    <Link href="/plan-trip">
                      <span className="text-2xl mb-2">🧭</span>
                      Plan New Trip
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col">
                    <Link href="/listings">
                      <span className="text-2xl mb-2">🔍</span>
                      Browse Experiences
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col">
                    <Link href="/reviews">
                      <span className="text-2xl mb-2">⭐</span>
                      Write Reviews
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {upcomingBookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 3).map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{booking.listing.title}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${booking.totalAmount}</p>
                          <p className="text-sm text-gray-600">{booking.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold mb-2">No upcoming trips</h3>
                  <p className="text-gray-600 mb-4">Start planning your next African adventure!</p>
                  <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                    <Link href="/plan-trip">Plan a Trip</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking: any) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{booking.listing.title}</h3>
                        <p className="text-gray-600">{booking.listing.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                          <p>Business: {booking.business.businessName}</p>
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

        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold mb-2">No completed trips yet</h3>
                  <p className="text-gray-600">Your completed trips will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map((booking: any) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{booking.listing.title}</h3>
                        <p className="text-gray-600">{booking.listing.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                          <p>Business: {booking.business.businessName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${booking.totalAmount}</p>
                        <p className="text-sm text-gray-500">{booking.status}</p>
                        {!booking.review && (
                          <Button size="sm" className="mt-2">
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">No saved trips yet</h3>
              <p className="text-gray-600 mb-4">Save trips you're interested in for later</p>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/listings">Browse Experiences</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

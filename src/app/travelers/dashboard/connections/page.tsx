'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState('messages')

  // Mock connections data
  const connections = [
    {
      id: '1',
      name: 'Serengeti Safari Tours',
      type: 'Business',
      lastMessage: 'Your safari booking is confirmed for March 15th!',
      timestamp: '2 hours ago',
      unread: true,
      avatar: 'S'
    },
    {
      id: '2',
      name: 'Zambezi Adventures',
      type: 'Business',
      lastMessage: 'We have availability for the Victoria Falls tour next week.',
      timestamp: '1 day ago',
      unread: false,
      avatar: 'Z'
    },
    {
      id: '3',
      name: 'Cape Adventures',
      type: 'Business',
      lastMessage: 'Thank you for the wonderful review!',
      timestamp: '3 days ago',
      unread: false,
      avatar: 'C'
    }
  ]

  const recentBookings = [
    {
      id: '1',
      experience: 'Maasai Mara Safari Adventure',
      business: 'Serengeti Safari Tours',
      date: 'March 15-17, 2024',
      status: 'Confirmed',
      total: 900
    },
    {
      id: '2',
      experience: 'Victoria Falls Tour',
      business: 'Zambezi Adventures',
      date: 'February 28, 2024',
      status: 'Completed',
      total: 380
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Connexus
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-yellow-600 font-semibold">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/travelers/dashboard">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Dashboard</Button>
              </Link>
              <Link href="/sign-in">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Your Connections</h1>
          <p className="text-xl text-gray-300">Stay connected with businesses and manage your bookings</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <Button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 ${
              activeTab === 'messages'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Messages
          </Button>
          <Button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 ${
              activeTab === 'bookings'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Bookings
          </Button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Recent Messages</h2>
              <Link href="/messages">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  View All Messages
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {connections.map((connection) => (
                <Link key={connection.id} href="/messages">
                  <Card className={`bg-gray-800 border-yellow-500/30 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    connection.unread ? 'border-l-4 border-l-yellow-500' : ''
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-lg">
                            {connection.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{connection.name}</h3>
                          <p className="text-gray-300">{connection.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-sm">{connection.timestamp}</span>
                        {connection.unread && (
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 ml-auto"></div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Your Bookings</h2>
              <Link href="/travelers/dashboard/browse-experiences">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse More Experiences
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {recentBookings.map((booking) => (
                <Card key={booking.id} className="bg-gray-800 border-yellow-500/30 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{booking.experience}</h3>
                      <p className="text-gray-300 mb-2">by {booking.business}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-300">📅 {booking.date}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'Confirmed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">${booking.total}</div>
                      <div className="flex space-x-2 mt-2">
                        <Link href="/messages">
                          <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                            Message
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {recentBookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg mb-4">No bookings yet</p>
                <Link href="/travelers/dashboard/browse-experiences">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Start Exploring
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

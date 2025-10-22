'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BusinessAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days')

  // No analytics data yet - will be populated when real businesses create listings
  const analytics = {
    overview: {
      totalViews: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      conversionRate: 0,
      clickThroughRate: 0,
      avgBookingValue: 0
    },
    monthlyData: [],
    topListings: [],
    campaignProjections: []
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

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
              <h1 className="text-4xl font-bold text-white mb-4">Business Analytics</h1>
              <p className="text-xl text-gray-300">Track your performance and optimize your listings</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setTimeRange('7days')}
                className={`px-4 py-2 ${
                  timeRange === '7days'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                7 Days
              </Button>
              <Button
                onClick={() => setTimeRange('30days')}
                className={`px-4 py-2 ${
                  timeRange === '30days'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                30 Days
              </Button>
              <Button
                onClick={() => setTimeRange('90days')}
                className={`px-4 py-2 ${
                  timeRange === '90days'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                90 Days
              </Button>
            </div>
          </div>
        </div>

        {/* Empty State - No Analytics Yet */}
        <div className="text-center py-12">
          <div className="text-6xl mb-4">ANALYTICS</div>
          <h3 className="text-2xl font-semibold text-white mb-4">No Analytics Data Yet</h3>
          <p className="text-gray-300 mb-6">Create listings and start getting bookings to see your analytics</p>
          <Link href="/business/setup">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Create Your First Listing
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function BusinessAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days')
  const [isLoading, setIsLoading] = useState(false)

  // No fake stats — show empty state. Replace with real data once available.
  const analytics = null as any

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

        {/* Empty State (no fake stats) */}
        <Card className="bg-gray-800 border-gray-700 p-8 mb-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">No analytics yet</h3>
          <p className="text-gray-300">When your verified listings receive traffic and bookings, real analytics will appear here.</p>
        </Card>

        {/* Remove fake charts; show guidance instead */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-2">How analytics will appear</h3>
          <p className="text-gray-300">Traffic, bookings, revenue, and conversion charts will populate automatically from your real activity. No fake data is shown.</p>
        </Card>

        {/* Remove fake projections */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">AI Campaign Projections</h3>
          <p className="text-gray-300">Projections will be generated from your real campaigns and audiences when available.</p>
        </Card>

        {/* Remove fabricated insights */}
        <Card className="bg-gray-800 border-gray-700 p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">AI Business Insights</h3>
          <p className="text-gray-300">Insights will appear once sufficient real activity is available.</p>
        </Card>

      </div>
    </div>
  )
}

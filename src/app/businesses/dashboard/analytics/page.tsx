'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  MessageSquare, 
  Star,
  Calendar,
  BarChart3
} from 'lucide-react'
import { useCurrentUser } from '@/components/UserProvider'

interface Analytics {
  overview: {
    totalBookings: number
    confirmedBookings: number
    totalRevenue: number
    commission: number
    netRevenue: number
    inquiries: number
    conversionRate: number
    averageRating: number
    reviewCount: number
    listingViews: number
  }
  bookings: {
    total: number
    confirmed: number
    pending: number
    completed: number
    cancelled: number
  }
  revenue: {
    total: number
    commission: number
    net: number
    averageBookingValue: number
  }
  engagement: {
    inquiries: number
    conversionRate: number
    averageRating: number
    reviewCount: number
  }
  listings: Array<{
    id: string
    title: string
    bookings: number
    revenue: number
  }>
}

export default function BusinessAnalyticsPage() {
  const { dbUser, isLoaded } = useCurrentUser()
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [businessId, setBusinessId] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && dbUser) {
      fetchBusiness()
    }
  }, [isLoaded, dbUser])

  useEffect(() => {
    if (businessId) {
      fetchAnalytics()
    }
  }, [businessId, timeRange])

  const fetchBusiness = async () => {
    try {
      const response = await fetch('/api/businesses?userId=' + dbUser?.id)
      const data = await response.json()
      
      if (data.success && data.businesses.length > 0) {
        setBusinessId(data.businesses[0].id)
      } else {
        setError('No business found. Please create a business profile first.')
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load business')
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    if (!businessId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/business/${businessId}?range=${timeRange}`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data.analytics)
      } else {
        setError(data.error || 'Failed to load analytics')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    )
  }

  if (error && !businessId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="bg-gray-800 border-gray-700 p-8 max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/business/setup">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Create Business Profile
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

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
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-yellow-600 font-semibold">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/businesses/dashboard">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                  Back to Dashboard
                </Button>
              </Link>
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

        {error && !analytics ? (
          <Card className="bg-red-900/20 border-red-500/30 p-6 mb-8">
            <p className="text-red-400">{error}</p>
          </Card>
        ) : analytics ? (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(analytics.overview.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-400 opacity-50" />
                </div>
                <p className="text-gray-500 text-xs mt-2">Net: {formatCurrency(analytics.overview.netRevenue)}</p>
              </Card>

              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview.totalBookings}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-yellow-400 opacity-50" />
                </div>
                <p className="text-gray-500 text-xs mt-2">{analytics.overview.confirmedBookings} confirmed</p>
              </Card>

              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Inquiries</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview.inquiries}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-yellow-400 opacity-50" />
                </div>
                <p className="text-gray-500 text-xs mt-2">{analytics.overview.conversionRate}% conversion</p>
              </Card>

              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Average Rating</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview.averageRating.toFixed(1)}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-400 opacity-50" />
                </div>
                <p className="text-gray-500 text-xs mt-2">{analytics.overview.reviewCount} reviews</p>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Revenue Breakdown</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(analytics.revenue.total)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Platform Commission (15%)</p>
                  <p className="text-3xl font-bold text-yellow-400">{formatCurrency(analytics.revenue.commission)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Net Revenue</p>
                  <p className="text-3xl font-bold text-green-400">{formatCurrency(analytics.revenue.net)}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm">Average Booking Value</p>
                <p className="text-xl font-semibold text-white">{formatCurrency(analytics.revenue.averageBookingValue)}</p>
              </div>
            </Card>

            {/* Bookings Status */}
            <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Bookings Status</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Total</p>
                  <p className="text-2xl font-bold text-white">{analytics.bookings.total}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{analytics.bookings.completed}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{analytics.bookings.pending}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Cancelled</p>
                  <p className="text-2xl font-bold text-red-400">{analytics.bookings.cancelled}</p>
                </div>
              </div>
            </Card>

            {/* Listing Performance */}
            {analytics.listings.length > 0 && (
              <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Listing Performance</h2>
                <div className="space-y-4">
                  {analytics.listings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{listing.title}</p>
                        <p className="text-gray-400 text-sm">{listing.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(listing.revenue)}</p>
                        <p className="text-gray-500 text-xs">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Engagement Metrics */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Engagement Metrics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Inquiries</p>
                  <p className="text-3xl font-bold text-white">{analytics.engagement.inquiries}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-yellow-400">{analytics.engagement.conversionRate}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Average Rating</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <p className="text-3xl font-bold text-white">{analytics.engagement.averageRating.toFixed(1)}</p>
                    <span className="text-gray-500 text-sm">({analytics.engagement.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="bg-gray-800 border-gray-700 p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No analytics data yet</h3>
            <p className="text-gray-300 mb-4">
              Analytics will appear here once your business receives bookings and inquiries.
            </p>
            <Link href="/businesses/directory">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Promote Your Business
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function BusinessAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days')
  const [isLoading, setIsLoading] = useState(false)

  // Mock analytics data for demonstration
  const analytics = {
    overview: {
      totalViews: 1247,
      totalClicks: 89,
      totalConversions: 12,
      totalRevenue: 15600,
      conversionRate: 13.5,
      clickThroughRate: 7.1,
      avgBookingValue: 1300
    },
    monthlyData: [
      { month: 'Jan', views: 120, bookings: 2, revenue: 2400 },
      { month: 'Feb', views: 180, bookings: 3, revenue: 3600 },
      { month: 'Mar', views: 220, bookings: 4, revenue: 4800 },
      { month: 'Apr', views: 190, bookings: 3, revenue: 3600 },
      { month: 'May', views: 250, bookings: 5, revenue: 6000 },
      { month: 'Jun', views: 287, bookings: 6, revenue: 7200 }
    ],
    topListings: [
      { name: 'Serengeti Safari Experience', views: 450, bookings: 8, revenue: 9600 },
      { name: 'Maasai Cultural Tour', views: 320, bookings: 4, revenue: 4800 },
      { name: 'Kilimanjaro Hiking Adventure', views: 280, bookings: 3, revenue: 3600 }
    ],
    campaignProjections: [
      { platform: 'Instagram', reach: 15000, engagement: 3.2, projectedBookings: 8 },
      { platform: 'YouTube', reach: 8500, engagement: 4.1, projectedBookings: 5 },
      { platform: 'TikTok', reach: 22000, engagement: 2.8, projectedBookings: 12 }
    ]
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

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics.overview.totalViews)}</p>
                <p className="text-sm text-green-400">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👁️</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{analytics.overview.totalConversions}</p>
                <p className="text-sm text-green-400">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📅</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${formatNumber(analytics.overview.totalRevenue)}</p>
                <p className="text-sm text-green-400">+15% from last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">{analytics.overview.conversionRate}%</p>
                <p className="text-sm text-green-400">+2.1% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend Chart */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-end space-x-2">
              {analytics.monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-yellow-500 w-full rounded-t"
                    style={{ height: `${(data.revenue / 8000) * 200}px` }}
                  />
                  <span className="text-xs text-gray-400 mt-2">{data.month}</span>
                  <span className="text-xs text-white">${formatNumber(data.revenue)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Listings Performance */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Performing Listings</h3>
            <div className="space-y-4">
              {analytics.topListings.map((listing, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div>
                    <p className="text-white font-medium">{listing.name}</p>
                    <p className="text-sm text-gray-400">{listing.views} views • {listing.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-semibold">${formatNumber(listing.revenue)}</p>
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Campaign Projections */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">AI Campaign Projections</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {analytics.campaignProjections.map((campaign, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded">
                <h4 className="text-white font-medium mb-2">{campaign.platform}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Reach:</span>
                    <span className="text-white">{formatNumber(campaign.reach)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Engagement:</span>
                    <span className="text-white">{campaign.engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Projected Bookings:</span>
                    <span className="text-yellow-400 font-semibold">{campaign.projectedBookings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Business Insights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Performance Summary</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">• Your conversion rate of {analytics.overview.conversionRate}% is above industry average</p>
                <p className="text-gray-300">• Peak booking times are weekends and holidays</p>
                <p className="text-gray-300">• Safari experiences generate 60% of your revenue</p>
                <p className="text-gray-300">• Consider adding family packages for Q3 growth</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Recommendations</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">• Optimize listing titles for better SEO</p>
                <p className="text-gray-300">• Add more photos to increase conversion</p>
                <p className="text-gray-300">• Consider influencer partnerships for growth</p>
                <p className="text-gray-300">• Implement dynamic pricing for peak seasons</p>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BusinessListingsPage() {
  const [activeTab, setActiveTab] = useState('active')

  // No mock data — will be fetched from API; keep empty to avoid fake stats
  const listings: Array<any> = []

  const filteredListings = activeTab === 'all' 
    ? listings 
    : listings.filter(listing => (listing.status || '').toLowerCase() === activeTab)

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Your Listings</h1>
              <p className="text-xl text-gray-300">Manage your business offerings and track performance</p>
            </div>
            <Link href="/business/setup">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                + Create New Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <Button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 ${
              activeTab === 'active'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Active ({listings.filter(l => l.status === 'Active').length})
          </Button>
          <Button
            onClick={() => setActiveTab('draft')}
            className={`px-6 py-3 ${
              activeTab === 'draft'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Drafts ({listings.filter(l => l.status === 'Draft').length})
          </Button>
          <Button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 ${
              activeTab === 'all'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All ({listings.length})
          </Button>
        </div>

        {/* Listings Grid */}
        <div className="grid gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="bg-gray-800 border-yellow-500/30 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{listing.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      listing.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                    <span>💰 ${listing.price}</span>
                    <span>⏱️ {listing.duration}</span>
                    <span>🏷️ {listing.type}</span>
                    {listing.rating > 0 && (
                      <span>⭐ {listing.rating} ({listing.reviews} reviews)</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Views</div>
                      <div className="text-white font-semibold">{listing.views}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Bookings</div>
                      <div className="text-white font-semibold">{listing.bookings}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Revenue</div>
                      <div className="text-yellow-400 font-semibold">${listing.revenue}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Conversion</div>
                      <div className="text-white font-semibold">
                        {listing.views > 0 ? ((listing.bookings / listing.views) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-4">
              {activeTab === 'active' ? 'No active listings yet' : 
               activeTab === 'draft' ? 'No draft listings' : 'No listings found'}
            </p>
            <Link href="/business/setup">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Create Your First Listing
              </Button>
            </Link>
          </div>
        )}

        {/* Analytics Summary */}
        {activeTab === 'active' && filteredListings.length > 0 && (
          <Card className="bg-gray-800 border-yellow-500/30 p-6 mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {filteredListings.reduce((sum, listing) => sum + listing.views, 0)}
                </div>
                <div className="text-gray-300">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {filteredListings.reduce((sum, listing) => sum + listing.bookings, 0)}
                </div>
                <div className="text-gray-300">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  ${filteredListings.reduce((sum, listing) => sum + listing.revenue, 0)}
                </div>
                <div className="text-gray-300">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {filteredListings.length > 0 ? 
                    (filteredListings.reduce((sum, listing) => sum + listing.rating, 0) / filteredListings.length).toFixed(1) : 0}
                </div>
                <div className="text-gray-300">Avg Rating</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

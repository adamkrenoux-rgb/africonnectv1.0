'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function InfluencerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'agreements', name: 'Agreements', icon: '📋' },
    { id: 'postoffer', name: 'Post Offer', icon: '📝' },
    { id: 'viewoffers', name: 'View Offers', icon: '👀' },
    { id: 'connections', name: 'Connections', icon: '💬' },
    { id: 'browsebusinesses', name: 'Browse Businesses', icon: '🏢' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ]

  const agreements = []
  const offers = []
  const connections = []
  const businesses = []

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Africonnect
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-yellow-600 font-semibold">For Influencers</Link>
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
                <span className="mr-2">{tab.icon}</span>
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
              <h2 className="text-3xl font-bold text-white mb-4">Influencer Overview</h2>
              <p className="text-gray-300">Your influencer performance at a glance</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Welcome to Your Influencer Dashboard</h3>
              <p className="text-gray-300 mb-6">Start by browsing campaigns or posting your own collaboration offers</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/campaigns">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Browse Campaigns
                  </Button>
                </Link>
                <Link href="/campaigns/new">
                  <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                    Post Collaboration Offer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Agreements Tab */}
      {activeTab === 'agreements' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Current Agreements</h2>
              <p className="text-gray-300">Manage your active collaborations</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Active Agreements</h3>
              <p className="text-gray-300 mb-6">Start collaborating with businesses to see your agreements here</p>
              <Link href="/campaigns">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse Available Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Post Offer Tab */}
      {activeTab === 'postoffer' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Post Collaboration Offer</h2>
              <p className="text-gray-300">Create a campaign to attract business partnerships</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Create Your Campaign</h3>
              <p className="text-gray-300 mb-6">Post a collaboration opportunity and connect with African businesses</p>
              <Link href="/campaigns/new">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Create Campaign
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* View Offers Tab */}
      {activeTab === 'viewoffers' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">View Applications</h2>
              <p className="text-gray-300">Review applications to your campaigns</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👀</div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Applications Yet</h3>
              <p className="text-gray-300 mb-6">Create campaigns to start receiving applications from businesses</p>
              <Link href="/campaigns/new">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Create Your First Campaign
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Your Connections</h2>
              <p className="text-gray-300">Manage your business partnerships and collaborations</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Connections Yet</h3>
              <p className="text-gray-300 mb-6">Start collaborating with businesses to build your network</p>
              <Link href="/campaigns">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Browse Businesses Tab */}
      {activeTab === 'browsebusinesses' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Browse Businesses</h2>
              <p className="text-gray-300">Research and connect with African tourism businesses</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Discover Businesses</h3>
              <p className="text-gray-300 mb-6">Explore verified African tourism businesses for potential collaborations</p>
              <Link href="/influencers/dashboard/businesses">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse Businesses
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
              <p className="text-gray-300">Track your influencer performance and campaign impact</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Analytics Yet</h3>
              <p className="text-gray-300 mb-6">Start collaborating with businesses to see your performance analytics</p>
              <Link href="/campaigns">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Start Collaborating
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
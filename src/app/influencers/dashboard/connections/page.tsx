'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function InfluencerConnectionsPage() {
  const [activeTab, setActiveTab] = useState('messages')

  // Mock connections data - in real app this would come from API
  const connections = [
    {
      id: '1',
      name: 'Serengeti Safari Tours',
      type: 'Business',
      lastMessage: 'We\'d love to collaborate on your next safari content!',
      timestamp: '2 hours ago',
      unread: true,
      avatar: 'S',
      campaign: 'Safari Adventure Campaign'
    },
    {
      id: '2',
      name: 'Zambezi Adventures',
      type: 'Business',
      lastMessage: 'Your application looks great! Let\'s discuss details.',
      timestamp: '1 day ago',
      unread: false,
      avatar: 'Z',
      campaign: 'Victoria Falls Collaboration'
    },
    {
      id: '3',
      name: 'Cape Adventures',
      type: 'Business',
      lastMessage: 'Thank you for the amazing content!',
      timestamp: '3 days ago',
      unread: false,
      avatar: 'C',
      campaign: 'Cape Town City Tour'
    }
  ]

  const activeCollaborations = [
    {
      id: '1',
      business: 'Serengeti Safari Tours',
      campaign: 'Safari Adventure Content',
      status: 'In Progress',
      deliverables: ['3 Instagram Posts', '2 Reels', '1 Story Series'],
      deadline: 'March 30, 2024',
      compensation: 1200
    },
    {
      id: '2',
      business: 'Zambezi Adventures',
      campaign: 'Victoria Falls Highlight',
      status: 'Pending Approval',
      deliverables: ['1 YouTube Video', '2 Instagram Posts'],
      deadline: 'April 15, 2024',
      compensation: 800
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
                Africonnect
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-yellow-600 font-semibold">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/influencers/dashboard">
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
          <p className="text-xl text-gray-300">Manage your business partnerships and collaborations</p>
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
            onClick={() => setActiveTab('collaborations')}
            className={`px-6 py-3 ${
              activeTab === 'collaborations'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Collaborations
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
                          <p className="text-gray-400 text-sm">{connection.campaign}</p>
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

        {/* Collaborations Tab */}
        {activeTab === 'collaborations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Active Collaborations</h2>
              <Link href="/campaigns">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse Campaigns
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {activeCollaborations.map((collaboration) => (
                <Card key={collaboration.id} className="bg-gray-800 border-yellow-500/30 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{collaboration.campaign}</h3>
                      <p className="text-gray-300 mb-2">with {collaboration.business}</p>
                      <div className="flex items-center space-x-4 text-sm mb-3">
                        <span className="text-gray-300">📅 Due: {collaboration.deadline}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          collaboration.status === 'In Progress' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {collaboration.status}
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        <strong>Deliverables:</strong> {collaboration.deliverables.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">${collaboration.compensation}</div>
                      <div className="text-gray-300 text-sm">Total Compensation</div>
                      <div className="flex space-x-2 mt-2">
                        <Link href="/messages">
                          <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                            Message
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {activeCollaborations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg mb-4">No active collaborations yet</p>
                <Link href="/campaigns">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Browse Available Campaigns
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

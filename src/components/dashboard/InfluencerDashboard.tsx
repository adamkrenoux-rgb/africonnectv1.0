'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { User, Campaign } from '@prisma/client'
import Link from 'next/link'

interface InfluencerDashboardProps {
  user: any
}

export default function InfluencerDashboard({ user }: InfluencerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const activeCampaigns = user.influencerCampaigns.filter(
    (campaign: any) => campaign.status === 'OPEN' || campaign.status === 'IN_PROGRESS'
  )

  const completedCampaigns = user.influencerCampaigns.filter(
    (campaign: any) => campaign.status === 'COMPLETED'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600">Connect with businesses and grow your influence</p>
            </div>
            <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
              <Link href="/campaigns/new">Create Campaign</Link>
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
                <div className="text-2xl">📱</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{user.influencerCampaigns.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">🔄</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCampaigns.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{completedCampaigns.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">💰</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">$0</p>
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
              { id: 'campaigns', name: 'My Campaigns', icon: '📱' },
              { id: 'applications', name: 'Applications', icon: '📝' },
              { id: 'collaborations', name: 'Collaborations', icon: '🤝' },
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
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button asChild variant="outline" className="h-20 flex-col">
                    <Link href="/campaigns/new">
                      <span className="text-2xl mb-2">📱</span>
                      Create Campaign
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col">
                    <Link href="/campaigns">
                      <span className="text-2xl mb-2">🔍</span>
                      Browse Campaigns
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col">
                    <Link href="/profile">
                      <span className="text-2xl mb-2">👤</span>
                      Update Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {activeCampaigns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeCampaigns.slice(0, 3).map((campaign: any) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{campaign.title}</h4>
                          <p className="text-sm text-gray-600">
                            Target: {campaign.targetRegion.join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{campaign.status}</p>
                          <p className="text-sm text-gray-600">
                            {campaign.budget ? `$${campaign.budget}` : 'Barter'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Campaigns</h3>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/campaigns/new">Create Campaign</Link>
              </Button>
            </div>
            {user.influencerCampaigns.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-gray-600 mb-4">Create your first campaign to connect with businesses</p>
                  <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                    <Link href="/campaigns/new">Create Campaign</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              user.influencerCampaigns.map((campaign: any) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{campaign.title}</h3>
                        <p className="text-gray-600">{campaign.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Target: {campaign.targetRegion.join(', ')}</p>
                          <p>Type: {campaign.collaborationTerms}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{campaign.status}</p>
                        <p className="text-sm text-gray-500">
                          {campaign.budget ? `$${campaign.budget}` : 'Barter'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Campaign Applications</h3>
              <p className="text-gray-600 mb-4">View and manage applications to your campaigns</p>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/campaigns/applications">View Applications</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'collaborations' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Active Collaborations</h3>
              <p className="text-gray-600 mb-4">Manage your ongoing collaborations with businesses</p>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/collaborations">View Collaborations</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Influencer Analytics</h3>
              <p className="text-gray-600 mb-4">Track your performance and earnings</p>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <Link href="/influencer/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

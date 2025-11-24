'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BusinessCollaborationsPage() {
  const [activeTab, setActiveTab] = useState('campaigns')

  // No campaigns or applications yet - will be populated when real influencers create campaigns
  const campaigns: any[] = []
  const applications: any[] = []

  const filteredData = activeTab === 'campaigns' ? campaigns : applications

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
              <h1 className="text-4xl font-bold text-white mb-4">Collaborations</h1>
              <p className="text-xl text-gray-300">Connect with influencers and grow your business</p>
            </div>
            <Link href="/campaigns/new">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <Button
            onClick={() => setActiveTab('campaigns')}
            className={`px-6 py-3 ${
              activeTab === 'campaigns'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Browse Campaigns ({campaigns.length})
          </Button>
          <Button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 ${
              activeTab === 'applications'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            My Applications ({applications.length})
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'campaigns' ? (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gray-800 border-yellow-500/30 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{campaign.title}</h3>
                    <p className="text-gray-300 mb-4">{campaign.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">{campaign.budget}</div>
                    <div className="text-sm text-gray-400">Budget</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Influencer</div>
                    <div className="font-semibold text-white">{campaign.influencer}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Followers</div>
                    <div className="font-semibold text-white">{campaign.followers}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Engagement</div>
                    <div className="font-semibold text-white">{campaign.engagement}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Region</div>
                    <div className="font-semibold text-white">{campaign.targetRegion}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Deliverables</h4>
                  <p className="text-gray-300">{campaign.deliverables}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm">Posted {campaign.postedDate}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status === 'Open' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <Link href={`/campaigns/${campaign.id}/apply`}>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="bg-gray-800 border-yellow-500/30 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{application.campaignTitle}</h3>
                    <p className="text-gray-300 mb-4">{application.proposal}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === 'Accepted' 
                        ? 'bg-green-500/20 text-green-400' 
                        : application.status === 'Under Review'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">Applied {application.appliedDate}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View Details
                    </Button>
                    {application.status === 'Accepted' && (
                      <Button className="bg-green-500 hover:bg-green-600 text-white">
                        Start Collaboration
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-2xl font-semibold text-white mb-4">No {activeTab} Yet</h3>
            <p className="text-gray-300 mb-6">
              {activeTab === 'campaigns' 
                ? 'No campaigns available at the moment. Check back later for new opportunities.'
                : 'You haven\'t applied to any campaigns yet.'
              }
            </p>
            {activeTab === 'campaigns' ? (
              <Link href="/campaigns/new">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Create Your Own Campaign
                </Button>
              </Link>
            ) : (
              <Link href="/businesses/dashboard/collaborations">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse Campaigns
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

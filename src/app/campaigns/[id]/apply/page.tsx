'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ApplyToCampaignPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    proposal: '',
    contentSamples: [],
    proposedPrice: '',
    timeline: '',
    additionalNotes: ''
  })

  // Mock campaign data - in real app this would come from API
  const campaign = {
    id: params.id,
    title: 'Safari Adventure Content Creation',
    business: 'Serengeti Safari Tours',
    description: 'We\'re looking for an influencer to create engaging content showcasing our luxury safari experiences in the Maasai Mara.',
    deliverables: ['3 Instagram Posts', '2 Instagram Reels', '1 Story Series', '1 YouTube Video'],
    targetRegion: 'East Africa (Kenya, Tanzania, Uganda)',
    budget: '$1,000 - $2,500',
    deadline: 'March 30, 2024',
    requirements: 'Must have experience with wildlife content and 10K+ followers',
    audienceDemographics: {
      ageRange: '25-45',
      interests: ['Travel & Adventure', 'Wildlife & Nature', 'Photography'],
      followers: '10K-100K'
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Application submitted:', formData)
    
    // Show immediate impact
    alert('🎉 Application submitted successfully! The business will be notified and you\'ll receive updates on your application status. You can track your applications in your dashboard.')
    
    // In real app, this would:
    // 1. Create application in database
    // 2. Send notification to business owner
    // 3. Update campaign applications count
    // 4. Send confirmation email to influencer
    // 5. Update business dashboard with new application
    // 6. Redirect to applications dashboard
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Apply to Campaign</h1>
          <p className="text-xl text-gray-300">Submit your application for this collaboration opportunity</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Campaign Details */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-yellow-500/30 p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-4">Campaign Details</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{campaign.title}</h4>
                  <p className="text-gray-300 text-sm">by {campaign.business}</p>
                </div>
                
                <div>
                  <h5 className="text-white font-semibold mb-2">Description</h5>
                  <p className="text-gray-300 text-sm">{campaign.description}</p>
                </div>
                
                <div>
                  <h5 className="text-white font-semibold mb-2">Deliverables</h5>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {campaign.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-yellow-400 mr-2">•</span>
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-white font-semibold mb-2">Budget Range</h5>
                  <p className="text-yellow-400 font-semibold">{campaign.budget}</p>
                </div>
                
                <div>
                  <h5 className="text-white font-semibold mb-2">Deadline</h5>
                  <p className="text-gray-300 text-sm">{campaign.deadline}</p>
                </div>
                
                <div>
                  <h5 className="text-white font-semibold mb-2">Requirements</h5>
                  <p className="text-gray-300 text-sm">{campaign.requirements}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-yellow-500/30 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Your Application</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Proposal *</label>
                  <textarea
                    value={formData.proposal}
                    onChange={(e) => handleInputChange('proposal', e.target.value)}
                    placeholder="Describe your approach to this campaign, your creative vision, and why you're the perfect fit..."
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Proposed Price (USD) *</label>
                  <input
                    type="number"
                    value={formData.proposedPrice}
                    onChange={(e) => handleInputChange('proposedPrice', e.target.value)}
                    placeholder="Enter your proposed compensation"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                  <p className="text-gray-400 text-sm mt-1">Budget range: {campaign.budget}</p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Timeline *</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select timeline</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Content Samples</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">📁</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Upload Samples</h4>
                    <p className="text-gray-300 mb-4">Show examples of your previous work</p>
                    <Button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      Choose Files
                    </Button>
                    <p className="text-gray-400 text-sm mt-2">JPG, PNG, MP4 up to 50MB each</p>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Additional Notes</label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information, special requests, or questions..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* AI Insights Preview */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">🤖 AI Application Insights</h4>
                  <p className="text-gray-300 text-sm">
                    Based on your profile and this campaign, our AI suggests your application has a 78% chance of acceptance. 
                    Your proposed price is within the fair range, and your content style aligns well with their target audience.
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/campaigns">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
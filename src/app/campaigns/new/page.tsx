'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetRegion: '',
    deliverables: [],
    audienceDemographics: {
      ageRange: '',
      interests: [],
      followers: ''
    },
    collaborationTerms: {
      duration: '',
      compensation: '',
      requirements: ''
    },
    budget: '',
    deadline: ''
  })

  const regions = [
    'East Africa (Kenya, Tanzania, Uganda)',
    'Southern Africa (South Africa, Botswana, Namibia)',
    'West Africa (Ghana, Nigeria, Senegal)',
    'Central Africa (Zambia, Zimbabwe)',
    'North Africa (Morocco, Egypt)',
    'All of Africa'
  ]

  const deliverables = [
    'Instagram Posts',
    'Instagram Stories',
    'Instagram Reels',
    'YouTube Videos',
    'TikTok Videos',
    'Blog Posts',
    'Live Streams',
    'Photo Shoots'
  ]

  const interests = [
    'Travel & Adventure',
    'Wildlife & Nature',
    'Culture & History',
    'Food & Cuisine',
    'Photography',
    'Luxury Travel',
    'Budget Travel',
    'Family Travel',
    'Solo Travel',
    'Sustainable Tourism'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleArrayToggle = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item)
        ? prev[field as keyof typeof prev].filter((i: string) => i !== item)
        : [...prev[field as keyof typeof prev], item]
    }))
  }

  const handleSubmit = () => {
    console.log('Campaign data:', formData)
    // Handle form submission
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
              <Link href="/influencers" className="text-yellow-600 font-semibold">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/auth/sign-in">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Create Campaign</h1>
          <p className="text-xl text-gray-300">Post a collaboration opportunity and connect with African tourism businesses</p>
        </div>

        <Card className="bg-gray-800 border-yellow-500/30 p-8">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {/* Campaign Title */}
            <div>
              <label className="block text-white font-semibold mb-2">Campaign Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Safari Adventure Collaboration"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-semibold mb-2">Campaign Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your collaboration opportunity, what you're looking for, and what businesses can expect..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            {/* Target Region */}
            <div>
              <label className="block text-white font-semibold mb-2">Target Region *</label>
              <select
                value={formData.targetRegion}
                onChange={(e) => handleInputChange('targetRegion', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                <option value="">Select target region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Deliverables */}
            <div>
              <label className="block text-white font-semibold mb-2">Content Deliverables *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {deliverables.map(deliverable => (
                  <button
                    key={deliverable}
                    type="button"
                    onClick={() => handleArrayToggle('deliverables', deliverable)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      formData.deliverables.includes(deliverable)
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-yellow-500'
                    }`}
                  >
                    {deliverable}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience Demographics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Age Range</label>
                <select
                  value={formData.audienceDemographics.ageRange}
                  onChange={(e) => handleNestedInputChange('audienceDemographics', 'ageRange', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select age range</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                  <option value="All ages">All ages</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Follower Count</label>
                <select
                  value={formData.audienceDemographics.followers}
                  onChange={(e) => handleNestedInputChange('audienceDemographics', 'followers', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select follower range</option>
                  <option value="1K-10K">1K - 10K</option>
                  <option value="10K-50K">10K - 50K</option>
                  <option value="50K-100K">50K - 100K</option>
                  <option value="100K-500K">100K - 500K</option>
                  <option value="500K+">500K+</option>
                </select>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-white font-semibold mb-2">Audience Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleArrayToggle('audienceDemographics.interests', interest)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      formData.audienceDemographics.interests.includes(interest)
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-yellow-500'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Collaboration Terms */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Campaign Duration</label>
                <select
                  value={formData.collaborationTerms.duration}
                  onChange={(e) => handleNestedInputChange('collaborationTerms', 'duration', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Budget Range (USD)</label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="0-500">$0 - $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000+">$5,000+</option>
                  <option value="Negotiable">Negotiable</option>
                </select>
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-white font-semibold mb-2">Additional Requirements</label>
              <textarea
                value={formData.collaborationTerms.requirements}
                onChange={(e) => handleNestedInputChange('collaborationTerms', 'requirements', e.target.value)}
                placeholder="Any specific requirements, expectations, or special requests..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-white font-semibold mb-2">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* AI Insights Preview */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">🤖 AI Campaign Insights</h4>
              <p className="text-gray-300 text-sm">
                Based on your campaign details, our AI estimates this collaboration could reach 15,000-25,000 people 
                with an expected engagement rate of 3.5-4.2%. The suggested fair compensation range is $800-$1,200.
              </p>
            </div>

            {/* Submit Button */}
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
                Post Campaign
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
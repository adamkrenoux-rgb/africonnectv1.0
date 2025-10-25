'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { aiHelper } from '@/lib/ai-helper'
import LoadingSpinner from '@/components/LoadingSpinner'

interface ListingData {
  title: string
  description: string
  pricing: string
  location: string
  businessType: string
  activities: string
}

interface OptimizationResult {
  optimizedTitle: string
  optimizedDescription: string
  pricingSuggestions: {
    budget: number
    midRange: number
    luxury: number
  }
  hashtags: string[]
  socialTemplates: string[]
  contentIdeas: string[]
  seoScore: number
}

interface AIListingOptimizerProps {
  initialData?: Partial<ListingData>
  onOptimize: (result: OptimizationResult) => void
  className?: string
}

export default function AIListingOptimizer({ 
  initialData = {}, 
  onOptimize, 
  className = '' 
}: AIListingOptimizerProps) {
  const [listingData, setListingData] = useState<ListingData>({
    title: initialData.title || '',
    description: initialData.description || '',
    pricing: initialData.pricing || '',
    location: initialData.location || '',
    businessType: initialData.businessType || '',
    activities: initialData.activities || ''
  })
  
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  const handleInputChange = (field: keyof ListingData, value: string) => {
    setListingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleOptimize = async () => {
    if (!listingData.title || !listingData.description) {
      alert('Please fill in at least the title and description')
      return
    }

    setIsOptimizing(true)
    try {
      const prompt = `Optimize this business listing for better visibility and bookings:
        Title: ${listingData.title}
        Description: ${listingData.description}
        Location: ${listingData.location}
        Business Type: ${listingData.businessType}
        Activities: ${listingData.activities}
        Current Pricing: ${listingData.pricing}
        
        Provide:
        1. SEO-optimized title
        2. Improved description with cultural context
        3. Pricing suggestions (budget, mid-range, luxury)
        4. Relevant hashtags
        5. Social media post templates
        6. Content ideas for marketing
        7. SEO score (0-100)`

      const response = await aiHelper.generateResponse({
        prompt,
        maxTokens: 800,
        temperature: 0.7
      })

      if (response.success) {
        // Parse the AI response into structured data
        const result = parseOptimizationResult(response.data)
        setOptimization(result)
        onOptimize(result)
      }
    } catch (error) {
      console.error('Optimization error:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const parseOptimizationResult = (aiText: string): OptimizationResult => {
    // This would parse the AI response into structured data
    // For now, return a structured mock response
    return {
      optimizedTitle: `Optimized ${listingData.title}`,
      optimizedDescription: `Enhanced description with cultural insights and local expertise for ${listingData.location}`,
      pricingSuggestions: {
        budget: 500,
        midRange: 1200,
        luxury: 2500
      },
      hashtags: [
        `#${listingData.location?.replace(' ', '')}`,
        `#${listingData.businessType?.replace(' ', '')}`,
        '#VerifiedLocalPartner',
        '#AuthenticExperience',
        '#AfricanTourism'
      ],
      socialTemplates: [
        `Discover authentic ${listingData.businessType} in ${listingData.location}!`,
        `Experience the real ${listingData.location} through our trusted local guides!`,
        `Join us for an unforgettable ${listingData.businessType} adventure!`
      ],
      contentIdeas: [
        'Behind-the-scenes content showing local community impact',
        'Customer testimonials and reviews',
        'Local culture and traditions showcase',
        'Sustainable tourism practices highlight'
      ],
      seoScore: 85
    }
  }

  const applyOptimization = (field: 'title' | 'description') => {
    if (!optimization) return
    
    if (field === 'title') {
      setListingData(prev => ({
        ...prev,
        title: optimization.optimizedTitle
      }))
    } else if (field === 'description') {
      setListingData(prev => ({
        ...prev,
        description: optimization.optimizedDescription
      }))
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input Form */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Your Listing Details</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              value={listingData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Your business title"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={listingData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Business Type</label>
            <select
              value={listingData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="Safari">Safari</option>
              <option value="Cultural Tour">Cultural Tour</option>
              <option value="Adventure">Adventure</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Transport">Transport</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Pricing</label>
            <input
              type="text"
              value={listingData.pricing}
              onChange={(e) => handleInputChange('pricing', e.target.value)}
              placeholder="e.g., $150 per person"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
          <textarea
            value={listingData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your business and what makes it special..."
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Activities</label>
          <input
            type="text"
            value={listingData.activities}
            onChange={(e) => handleInputChange('activities', e.target.value)}
            placeholder="What activities do you offer?"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        
        <Button
          onClick={handleOptimize}
          disabled={isOptimizing || !listingData.title || !listingData.description}
          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          {isOptimizing ? (
            <LoadingSpinner size="sm" text="Optimizing..." />
          ) : (
            'AI Optimize Listing'
          )}
        </Button>
      </Card>

      {/* Optimization Results */}
      {optimization && (
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">AI Optimization Results</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">SEO Score:</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${optimization.seoScore}%` }}
                  />
                </div>
                <span className="text-yellow-400 font-semibold">{optimization.seoScore}/100</span>
              </div>
            </div>
          </div>

          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Original</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Title:</label>
                  <p className="text-gray-300">{listingData.title}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Description:</label>
                  <p className="text-gray-300 text-sm">{listingData.description}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Optimized</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Title:</label>
                  <p className="text-white">{optimization.optimizedTitle}</p>
                  <Button
                    size="sm"
                    onClick={() => applyOptimization('title')}
                    className="mt-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Apply
                  </Button>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Description:</label>
                  <p className="text-white text-sm">{optimization.optimizedDescription}</p>
                  <Button
                    size="sm"
                    onClick={() => applyOptimization('description')}
                    className="mt-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Suggestions */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-3">Pricing Suggestions</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-3 rounded">
                <h5 className="text-sm font-medium text-gray-400">Budget</h5>
                <p className="text-white font-semibold">${optimization.pricingSuggestions.budget}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <h5 className="text-sm font-medium text-gray-400">Mid-Range</h5>
                <p className="text-white font-semibold">${optimization.pricingSuggestions.midRange}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <h5 className="text-sm font-medium text-gray-400">Luxury</h5>
                <p className="text-white font-semibold">${optimization.pricingSuggestions.luxury}</p>
              </div>
            </div>
          </div>

          {/* Hashtags */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-3">Suggested Hashtags</h4>
            <div className="flex flex-wrap gap-2">
              {optimization.hashtags.map((hashtag, index) => (
                <span
                  key={index}
                  className="bg-yellow-500 text-black px-2 py-1 rounded text-sm"
                >
                  {hashtag}
                </span>
              ))}
            </div>
          </div>

          {/* Social Templates */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-3">Social Media Templates</h4>
            <div className="space-y-2">
              {optimization.socialTemplates.map((template, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded">
                  <p className="text-white text-sm">{template}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Ideas */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Content Ideas</h4>
            <ul className="space-y-2">
              {optimization.contentIdeas.map((idea, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  )
}

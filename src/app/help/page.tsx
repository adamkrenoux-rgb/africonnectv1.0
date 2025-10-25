'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SmartSearchBar from '@/components/SmartSearchBar'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = (query: string, results: any[]) => {
    setSearchQuery(query)
    setSearchResults(results)
  }

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      articles: [
        'How to create your first listing',
        'Setting up your business profile',
        'Understanding verification process',
        'Adding photos and descriptions'
      ]
    },
    {
      title: 'Bookings & Payments',
      icon: '💳',
      articles: [
        'How bookings work',
        'Payment processing and security',
        'Cancellation policies',
        'Refund procedures'
      ]
    },
    {
      title: 'Campaigns & Collaborations',
      icon: '🤝',
      articles: [
        'Creating influencer campaigns',
        'Applying to campaigns',
        'Campaign projections and ROI',
        'Content delivery and approval'
      ]
    },
    {
      title: 'Account & Security',
      icon: '🔒',
      articles: [
        'Managing your account',
        'Password and security',
        'Notification preferences',
        'Data privacy and GDPR'
      ]
    }
  ]

  const popularArticles = [
    'How do I get my business verified?',
    'What commission does AFRICONNECT take?',
    'How do I optimize my listings for better visibility?',
    'Can I work with influencers through AFRICONNECT?',
    'How do I get paid for bookings?',
    'What makes AFRICONNECT different from other platforms?',
    'How does the AI trip planning work?',
    'Is my payment information secure?'
  ]

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: '💬',
      action: 'Start Chat'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: '📧',
      action: 'Send Email'
    },
    {
      title: 'Video Call',
      description: 'Schedule a one-on-one session',
      icon: '📹',
      action: 'Schedule Call'
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
          <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-xl text-gray-300">Find answers, get support, and learn how to make the most of AFRICONNECT</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SmartSearchBar
            onSearch={handleSearch}
            placeholder="Search for help articles, guides, and FAQs..."
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Search Results for "{searchQuery}"</h2>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors cursor-pointer">
                  <h3 className="text-white font-medium">{result.title}</h3>
                  <p className="text-sm text-gray-400">{result.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {helpCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{category.title}</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex} className="text-left">
                      • {article}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Popular Help Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors cursor-pointer">
                <h3 className="text-white font-medium">{article}</h3>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Still Need Help?</h2>
          <p className="text-gray-300 mb-6">Our support team is here to help you succeed on AFRICONNECT</p>
          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{option.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                <p className="text-gray-400 mb-4">{option.description}</p>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Video Tutorials */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Video Tutorials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-4 rounded">
              <div className="w-full h-32 bg-gray-600 rounded mb-3 flex items-center justify-center">
                <span className="text-4xl">▶️</span>
              </div>
              <h3 className="text-white font-medium mb-2">Getting Started Guide</h3>
              <p className="text-sm text-gray-400">Learn the basics of using AFRICONNECT</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="w-full h-32 bg-gray-600 rounded mb-3 flex items-center justify-center">
                <span className="text-4xl">▶️</span>
              </div>
              <h3 className="text-white font-medium mb-2">Creating Your First Listing</h3>
              <p className="text-sm text-gray-400">Step-by-step guide to listing your business</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="w-full h-32 bg-gray-600 rounded mb-3 flex items-center justify-center">
                <span className="text-4xl">▶️</span>
              </div>
              <h3 className="text-white font-medium mb-2">AI Features Overview</h3>
              <p className="text-sm text-gray-400">Discover how AI can help your business</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

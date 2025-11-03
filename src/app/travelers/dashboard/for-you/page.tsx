'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ForYouPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  // Mock content data
  const content = [
    {
      id: '1',
      type: 'post',
      business: 'Serengeti Safari Tours',
      title: 'Wildebeest Migration Update',
      description: 'The great migration is in full swing! Our guests witnessed thousands of wildebeest crossing the Mara River today.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      likes: 234,
      comments: 18,
      timestamp: '2 hours ago',
      tags: ['safari', 'migration', 'wildlife']
    },
    {
      id: '2',
      type: 'story',
      business: 'Zambezi Adventures',
      title: 'Behind the Scenes: Victoria Falls',
      description: 'Take a look at what goes into preparing for a perfect day at Victoria Falls.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      likes: 156,
      comments: 12,
      timestamp: '4 hours ago',
      tags: ['adventure', 'waterfalls', 'behind-the-scenes']
    },
    {
      id: '3',
      type: 'video',
      business: 'Cape Adventures',
      title: 'Cape Town City Tour Highlights',
      description: 'Experience the vibrant culture and stunning views of Cape Town in this 2-minute highlight reel.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
      likes: 89,
      comments: 7,
      timestamp: '1 day ago',
      tags: ['city-tour', 'culture', 'highlights']
    },
    {
      id: '4',
      type: 'post',
      business: 'Mozambique Diving Co',
      title: 'Underwater Paradise',
      description: 'The crystal-clear waters of Bazaruto Island offer some of the best diving in Africa. Here\'s what you can expect to see.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      likes: 312,
      comments: 24,
      timestamp: '2 days ago',
      tags: ['diving', 'underwater', 'marine-life']
    },
    {
      id: '5',
      type: 'story',
      business: 'Tanzania Safari Experts',
      title: 'Sunrise in the Serengeti',
      description: 'There\'s nothing quite like watching the sun rise over the endless plains of the Serengeti.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      likes: 445,
      comments: 31,
      timestamp: '3 days ago',
      tags: ['sunrise', 'serengeti', 'landscape']
    },
    {
      id: '6',
      type: 'post',
      business: 'Authentic Africa Tours',
      title: 'Cultural Exchange Program',
      description: 'Our guests had an amazing time learning traditional cooking methods from local families in Ghana.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
      likes: 178,
      comments: 15,
      timestamp: '4 days ago',
      tags: ['culture', 'cooking', 'community']
    }
  ]

  const filteredContent = activeFilter === 'all' 
    ? content 
    : content.filter(item => item.type === activeFilter)

  const filters = [
    { id: 'all', label: 'All Content', count: content.length },
    { id: 'post', label: 'Posts', count: content.filter(c => c.type === 'post').length },
    { id: 'story', label: 'Stories', count: content.filter(c => c.type === 'story').length },
    { id: 'video', label: 'Videos', count: content.filter(c => c.type === 'video').length }
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
              <Link href="/travelers" className="text-yellow-600 font-semibold">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/travelers/dashboard">
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
          <h1 className="text-4xl font-bold text-white mb-4">For You</h1>
          <p className="text-xl text-gray-300">Discover content from businesses you follow and personalized recommendations</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 ${
                activeFilter === filter.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        {/* Content Feed */}
        <div className="grid gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-yellow-500/30 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-lg">
                    {item.business.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{item.business}</h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400 text-sm">{item.timestamp}</span>
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                      {item.type}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-300 mb-4">{item.description}</p>
                  
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={300}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors">
                        <span>❤️</span>
                        <span>{item.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors">
                        <span>💬</span>
                        <span>{item.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors">
                        <span>📤</span>
                        <span>Share</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/experiences/${item.id}`}>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                          View Experience
                        </Button>
                      </Link>
                      <Link href="/messages">
                        <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                          Contact
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-4">No content found for this filter.</p>
            <Button
              onClick={() => setActiveFilter('all')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Show All Content
            </Button>
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
            Load More Content
          </Button>
        </div>
      </div>
    </div>
  )
}

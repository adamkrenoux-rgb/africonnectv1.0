'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BrowseExperiencesPage() {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    duration: '',
    activityType: ''
  })

  // Mock experiences data
  const experiences = [
    {
      id: '1',
      title: 'Maasai Mara Safari Adventure',
      business: 'Serengeti Safari Tours',
      location: 'Kenya',
      price: 450,
      duration: '3 days',
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      type: 'Safari',
      verified: true
    },
    {
      id: '2',
      title: 'Victoria Falls Adventure',
      business: 'Zambezi Adventures',
      location: 'Zambia',
      price: 380,
      duration: '2 days',
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      type: 'Adventure',
      verified: true
    },
    {
      id: '3',
      title: 'Cape Town City Tour',
      business: 'Cape Adventures',
      location: 'South Africa',
      price: 120,
      duration: '1 day',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      type: 'Cultural',
      verified: true
    },
    {
      id: '4',
      title: 'Bazaruto Island Diving',
      business: 'Mozambique Diving Co',
      location: 'Mozambique',
      price: 280,
      duration: '2 days',
      rating: 4.9,
      reviews: 73,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      type: 'Water Sports',
      verified: true
    },
    {
      id: '5',
      title: 'Serengeti Migration Safari',
      business: 'Tanzania Safari Experts',
      location: 'Tanzania',
      price: 520,
      duration: '4 days',
      rating: 4.9,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      type: 'Safari',
      verified: true
    },
    {
      id: '6',
      title: 'Cultural Village Experience',
      business: 'Authentic Africa Tours',
      location: 'Ghana',
      price: 95,
      duration: '1 day',
      rating: 4.6,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      type: 'Cultural',
      verified: true
    }
  ]

  const filteredExperiences = experiences.filter(exp => {
    if (filters.location && !exp.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.activityType && exp.type !== filters.activityType) return false
    if (filters.duration && exp.duration !== filters.duration) return false
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      if (exp.price < min || exp.price > max) return false
    }
    return true
  })

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
          <h1 className="text-4xl font-bold text-white mb-4">Browse Experiences</h1>
          <p className="text-xl text-gray-300">Discover authentic African adventures from verified local businesses</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-yellow-500/30 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Kenya, Tanzania"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Any Price</option>
                    <option value="0-100">$0 - $100</option>
                    <option value="100-300">$100 - $300</option>
                    <option value="300-500">$300 - $500</option>
                    <option value="500-1000">$500+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Duration</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters({...filters, duration: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Any Duration</option>
                    <option value="1 day">1 Day</option>
                    <option value="2 days">2 Days</option>
                    <option value="3 days">3 Days</option>
                    <option value="4 days">4+ Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Activity Type</label>
                  <select
                    value={filters.activityType}
                    onChange={(e) => setFilters({...filters, activityType: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Any Type</option>
                    <option value="Safari">Safari</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Water Sports">Water Sports</option>
                  </select>
                </div>

                <Button
                  onClick={() => setFilters({location: '', priceRange: '', duration: '', activityType: ''})}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Experiences Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300">
                Showing {filteredExperiences.length} of {experiences.length} experiences
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  Sort by Price
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  Sort by Rating
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExperiences.map((experience) => (
                <Link key={experience.id} href={`/experiences/${experience.id}`}>
                  <Card className="bg-gray-800 border-yellow-500/30 hover:border-yellow-400 transition-all duration-300 cursor-pointer group">
                    <div className="relative">
                      <Image
                        src={experience.image}
                        alt={experience.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {experience.verified && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          ✓ Verified
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          {experience.title}
                        </h3>
                        <div className="text-yellow-400 font-bold text-lg">
                          ${experience.price}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2">by {experience.business}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white">{experience.rating}</span>
                          <span className="text-gray-400 text-sm">({experience.reviews})</span>
                        </div>
                        <span className="text-gray-300 text-sm">{experience.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{experience.duration}</span>
                        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                          {experience.type}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredExperiences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">No experiences found matching your filters.</p>
                <Button
                  onClick={() => setFilters({location: '', priceRange: '', duration: '', activityType: ''})}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

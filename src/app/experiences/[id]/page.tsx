'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ExperienceDetailPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [travelers, setTravelers] = useState(1)

  // Mock experience data - in real app this would come from API
  const experience = {
    id: params.id,
    title: 'Maasai Mara Safari Adventure',
    business: 'Serengeti Safari Tours',
    location: 'Kenya',
    price: 450,
    duration: '3 days',
    rating: 4.9,
    reviews: 127,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
    ],
    description: 'Experience the great migration with expert guides in one of Africa\'s most iconic wildlife destinations. This 3-day safari adventure takes you deep into the Maasai Mara National Reserve, where you\'ll witness the incredible wildebeest migration and encounter the Big Five.',
    highlights: [
      'Witness the Great Migration',
      'Big Five game drives',
      'Professional safari guide',
      'Luxury tented accommodation',
      'All meals included',
      'Airport transfers'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & First Game Drive',
        activities: ['Airport pickup', 'Lodge check-in', 'Afternoon game drive', 'Dinner at lodge']
      },
      {
        day: 2,
        title: 'Full Day Safari',
        activities: ['Early morning game drive', 'Breakfast in the bush', 'Return to lodge', 'Afternoon game drive']
      },
      {
        day: 3,
        title: 'Final Game Drive & Departure',
        activities: ['Morning game drive', 'Breakfast', 'Check-out', 'Airport transfer']
      }
    ],
    includes: [
      'Professional safari guide',
      '4x4 safari vehicle',
      'Park entrance fees',
      'Accommodation (2 nights)',
      'All meals',
      'Airport transfers',
      'Bottled water'
    ],
    excludes: [
      'International flights',
      'Travel insurance',
      'Personal expenses',
      'Tips and gratuities'
    ]
  }

  const totalPrice = experience.price * travelers

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Image
                  src={experience.images[0]}
                  alt={experience.title}
                  width={800}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div>
                <Image
                  src={experience.images[1]}
                  alt={experience.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div>
                <Image
                  src={experience.images[2]}
                  alt={experience.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Experience Details */}
            <Card className="bg-gray-800 border-yellow-500/30 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{experience.title}</h1>
                  <p className="text-gray-300 mb-2">by {experience.business}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white ml-1">{experience.rating}</span>
                      <span className="text-gray-400 ml-2">({experience.reviews} reviews)</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-300">{experience.location}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-300">{experience.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-400">${experience.price}</div>
                  <div className="text-gray-300">per person</div>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">{experience.description}</p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Experience Highlights</h3>
                <div className="grid grid-cols-2 gap-2">
                  {experience.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-yellow-400 mr-2">✓</span>
                      <span className="text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Itinerary */}
            <Card className="bg-gray-800 border-yellow-500/30 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Itinerary</h3>
              <div className="space-y-4">
                {experience.itinerary.map((day) => (
                  <div key={day.day} className="border-l-2 border-yellow-500 pl-4">
                    <h4 className="text-lg font-semibold text-white">Day {day.day}: {day.title}</h4>
                    <ul className="text-gray-300 space-y-1 mt-2">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-yellow-400 mr-2">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* What's Included/Excluded */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-yellow-500/30 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {experience.includes.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-gray-800 border-yellow-500/30 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">What's Not Included</h3>
                <ul className="space-y-2">
                  {experience.excludes.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-red-400 mr-2">✗</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-yellow-500/30 p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-4">Book This Experience</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Number of Travelers</label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Price per person</span>
                    <span className="text-white">${experience.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Travelers</span>
                    <span className="text-white">{travelers}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-400">${totalPrice}</span>
                  </div>
                </div>

                <Link href="/booking">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 text-lg font-semibold">
                    Book Now
                  </Button>
                </Link>

                <Link href="/messages">
                  <Button variant="outline" className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                    Contact Business
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

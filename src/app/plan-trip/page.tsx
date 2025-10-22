'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PlanTripPage() {
  const [preferences, setPreferences] = useState({
    destination: '',
    duration: '',
    budget: '',
    activities: '',
    interests: '',
    groupSize: '',
    travelDates: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [itinerary, setItinerary] = useState(null)

  const handleInputChange = (field: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateItinerary = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setItinerary(data.itinerary)
      } else {
        console.error('Failed to generate itinerary')
      }
    } catch (error) {
      console.error('Error generating itinerary:', error)
    } finally {
      setIsGenerating(false)
    }
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
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-orange-500/30 to-red-500/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center opacity-30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Plan Your Perfect<span className="text-yellow-400"> African Adventure</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tell us about your dream trip and our AI will create a personalized itinerary with verified local experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Trip Planning Form */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-yellow-500/30 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Tell Us About Your Dream Trip</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-white font-semibold mb-2">Destination</label>
                <select
                  value={preferences.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select destination</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Zambia">Zambia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Duration</label>
                <select
                  value={preferences.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="3-5 days">3-5 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="3+ weeks">3+ weeks</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Budget Range</label>
                <select
                  value={preferences.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select budget</option>
                  <option value="budget">Budget ($500-1000)</option>
                  <option value="mid-range">Mid-range ($1000-3000)</option>
                  <option value="luxury">Luxury ($3000+)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Group Size</label>
                <select
                  value={preferences.groupSize}
                  onChange={(e) => handleInputChange('groupSize', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select group size</option>
                  <option value="solo">Solo traveler</option>
                  <option value="couple">Couple</option>
                  <option value="small-group">Small group (3-6)</option>
                  <option value="large-group">Large group (7+)</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Activities You're Interested In</label>
              <textarea
                value={preferences.activities}
                onChange={(e) => handleInputChange('activities', e.target.value)}
                placeholder="e.g., Safari game drives, cultural experiences, hiking, beach time, wildlife photography"
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Special Interests</label>
              <textarea
                value={preferences.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                placeholder="e.g., Photography, bird watching, local cuisine, history, conservation"
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-white font-semibold mb-2">Preferred Travel Dates</label>
              <input
                type="text"
                value={preferences.travelDates}
                onChange={(e) => handleInputChange('travelDates', e.target.value)}
                placeholder="e.g., March 2024, Flexible dates, Summer 2024"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div className="text-center">
              <Button
                onClick={handleGenerateItinerary}
                disabled={isGenerating}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold shadow-lg disabled:opacity-50"
              >
                {isGenerating ? 'Generating Your Itinerary...' : 'Generate My Itinerary'}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {itinerary && (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gray-800 border-yellow-500/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Personalized Itinerary</h2>
              
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">{itinerary.title}</h3>
                <p className="text-gray-300 mb-4">{itinerary.duration}</p>
                <p className="text-white font-semibold">Total Cost: ${itinerary.total_cost}</p>
              </div>
              
              <div className="space-y-6">
                {itinerary.days?.map((day: any, index: number) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-4">Day {day.day} - {day.date}</h4>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-white mb-2">Activities:</h5>
                      <div className="space-y-2">
                        {day.activities?.map((activity: any, actIndex: number) => (
                          <div key={actIndex} className="flex justify-between items-center bg-gray-600 rounded p-3">
                            <div>
                              <span className="text-yellow-400 font-medium">{activity.time}</span>
                              <span className="text-white ml-2">{activity.activity}</span>
                              <span className="text-gray-300 ml-2">({activity.location})</span>
                            </div>
                            <span className="text-gray-300">{activity.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {day.accommodation && (
                      <div className="bg-gray-600 rounded p-3">
                        <h5 className="font-semibold text-white mb-1">Accommodation:</h5>
                        <p className="text-gray-300">{day.accommodation.name} ({day.accommodation.type})</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {itinerary.recommendations && (
                <div className="mt-6 bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4">Recommendations</h4>
                  <ul className="space-y-2">
                    {itinerary.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-300">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="text-center mt-8">
                <Link href="/booking">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold shadow-lg">
                    Book This Itinerary
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 className="text-2xl font-bold">AFRICONNECT</h3>
          </div>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Connecting the world to authentic African experiences through AI-powered technology.
          </p>
          <p className="text-gray-400 text-sm">
            © 2024 AFRICONNECT. Connecting hearts to Africa's vibrant culture and natural beauty.
          </p>
        </div>
      </footer>
    </div>
  )
}
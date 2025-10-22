'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function TravelerDashboard() {
  const [activeTab, setActiveTab] = useState('browse')

  const tabs = [
    { id: 'browse', name: 'Browse Experiences', icon: null },
    { id: 'connections', name: 'Connections', icon: null },
    { id: 'plan', name: 'Plan Trip', icon: null },
    { id: 'foryou', name: 'For You', icon: null }
  ]

  const experiences = []

  const messages = []

  const forYouContent = []

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
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Profile</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Navigation */}
      <section className="py-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`px-4 py-2 text-sm font-semibold ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
                }`}
              >
                {tab.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Experiences Tab */}
      {activeTab === 'browse' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Browse Experiences</h2>
              <p className="text-gray-300">Discover authentic African adventures</p>
            </div>
            
            {experiences.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <Link key={experience.id} href={`/experiences/${experience.id}`}>
                    <Card className="bg-gray-800 border-yellow-500/30 hover:border-yellow-400 transition-all duration-300 cursor-pointer">
                      <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{experience.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">by {experience.business}</p>
                        <p className="text-gray-400 text-sm mb-3">{experience.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400 font-bold">{experience.price}</span>
                          <span className="text-gray-300 text-sm">{experience.duration}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg mb-4">No experiences available yet</p>
                <Link href="/travelers/dashboard/businesses">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Browse Business Listings
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Your Connections</h2>
              <p className="text-gray-300">Messages from businesses you've connected with</p>
            </div>
            
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Link href="/messages" key={message.id}>
                    <Card className={`bg-gray-800 border-yellow-500/30 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${message.unread ? 'border-l-4 border-l-yellow-500' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-lg">
                              {message.business.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{message.business}</h3>
                            <p className="text-gray-300">{message.lastMessage}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 text-sm">{message.timestamp}</span>
                          {message.unread && (
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 ml-auto"></div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg mb-4">No messages yet</p>
                <Link href="/travelers/dashboard/browse-experiences">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Start Exploring
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Plan Trip Tab */}
      {activeTab === 'plan' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Plan Your Trip</h2>
              <p className="text-gray-300">Create personalized itineraries with AI</p>
            </div>
            
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-4">AI-Powered Trip Planning</h3>
              <p className="text-gray-300 mb-6">Tell us about your dream trip and our AI will create a personalized itinerary</p>
              <Link href="/plan-trip">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Start Planning
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* For You Tab */}
      {activeTab === 'foryou' && (
        <section className="py-12 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">For You</h2>
              <p className="text-gray-300">Personalized content from businesses you follow</p>
            </div>
            
            {forYouContent.length > 0 ? (
              <div className="space-y-6">
                {forYouContent.map((post) => (
                  <Card key={post.id} className="bg-gray-800 border-yellow-500/30 p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {post.business.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{post.business}</h3>
                          <span className="text-gray-400 text-sm">{post.timestamp}</span>
                        </div>
                        <p className="text-gray-300 mb-4">{post.content}</p>
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.content}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                          />
                        )}
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400">
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400">
                            <span>{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg mb-4">No content yet</p>
                <Link href="/travelers/dashboard/browse-experiences">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Follow Some Businesses
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
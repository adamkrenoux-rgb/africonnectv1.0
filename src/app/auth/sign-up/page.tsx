'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organization: '',
    country: '',
    phone: '',
    businessName: '',
    businessType: '',
    businessLocation: '',
    socialMedia: '',
    followerCount: '',
    niche: ''
  })

  const roles = [
    {
      id: 'traveler',
      title: 'Traveler',
      description: 'Discover authentic African experiences',
      icon: '🧭',
      features: ['AI-powered trip planning', 'Verified local partners', 'Secure bookings', 'Travel community']
    },
    {
      id: 'business',
      title: 'Business Owner',
      description: 'Grow your tourism business',
      icon: '🏢',
      features: ['AI listing optimization', 'International clientele', 'Influencer collaborations', 'Analytics dashboard']
    },
    {
      id: 'influencer',
      title: 'Influencer',
      description: 'Create meaningful content partnerships',
      icon: '📱',
      features: ['Campaign opportunities', 'AI pricing insights', 'Business partnerships', 'Performance analytics']
    }
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setStep(2)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your authentication system
    console.log('Sign up data:', { role: selectedRole, ...formData })
    // Redirect to appropriate dashboard
    if (selectedRole === 'traveler') {
      window.location.href = '/travelers/dashboard'
    } else if (selectedRole === 'business') {
      window.location.href = '/businesses/dashboard'
    } else if (selectedRole === 'influencer') {
      window.location.href = '/influencers/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Africonnect
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/sign-in">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Join Africonnect</h1>
            <p className="text-xl text-gray-300 mb-8">Choose your role to get started</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {roles.map((role) => (
                <Card 
                  key={role.id}
                  className="bg-gray-800 border-yellow-500/30 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-yellow-400"
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{role.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{role.title}</h3>
                    <p className="text-gray-300 mb-6">{role.description}</p>
                    <ul className="text-left text-gray-300 space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-yellow-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Account Details */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
              <p className="text-gray-300">Complete your profile as a {roles.find(r => r.id === selectedRole)?.title}</p>
            </div>

            <Card className="bg-gray-800 border-yellow-500/30 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                {/* Role-specific fields */}
                {selectedRole === 'traveler' && (
                  <>
                    <div>
                      <label className="block text-white font-semibold mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Your country"
                      />
                    </div>
                  </>
                )}

                {selectedRole === 'business' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-semibold mb-2">Business Name *</label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Your business name"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-semibold mb-2">Business Type *</label>
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="">Select business type</option>
                          <option value="safari">Safari Tours</option>
                          <option value="lodge">Lodge/Hotel</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="adventure">Adventure Activities</option>
                          <option value="cultural">Cultural Tours</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Business Location *</label>
                      <input
                        type="text"
                        name="businessLocation"
                        value={formData.businessLocation}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>
                  </>
                )}

                {selectedRole === 'influencer' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-semibold mb-2">Social Media Handle</label>
                        <input
                          type="text"
                          name="socialMedia"
                          value={formData.socialMedia}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="@yourhandle"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-semibold mb-2">Follower Count</label>
                        <select
                          name="followerCount"
                          value={formData.followerCount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="">Select range</option>
                          <option value="1k-10k">1K - 10K</option>
                          <option value="10k-50k">10K - 50K</option>
                          <option value="50k-100k">50K - 100K</option>
                          <option value="100k-500k">100K - 500K</option>
                          <option value="500k+">500K+</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Content Niche</label>
                      <select
                        name="niche"
                        value={formData.niche}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="">Select niche</option>
                        <option value="travel">Travel</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="adventure">Adventure</option>
                        <option value="culture">Culture</option>
                        <option value="food">Food</option>
                        <option value="photography">Photography</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-white font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Your phone number"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                  />
                  <label htmlFor="terms" className="text-gray-300 text-sm">
                    I agree to the <Link href="/terms" className="text-yellow-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 className="text-2xl font-bold">Africonnect</h3>
          </div>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Connecting the world to authentic African experiences through AI-powered technology.
          </p>
          <p className="text-gray-400 text-sm">
            © 2024 Africonnect. Connecting hearts to Africa's vibrant culture and natural beauty.
          </p>
        </div>
      </footer>
    </div>
  )
}

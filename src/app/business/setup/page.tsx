'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BusinessSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    location: '',
    description: '',
    services: [] as string[],
    pricing: '',
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    media: [] as string[]
  })

  const businessTypes = [
    'Safari Tours',
    'Lodge/Hotel',
    'Adventure Activities',
    'Cultural Experiences',
    'Restaurant/Food',
    'Transportation',
    'Other'
  ]

  const services = [
    'Game Drives',
    'Walking Safaris',
    'Cultural Tours',
    'Photography Tours',
    'Bird Watching',
    'Hot Air Balloon',
    'Boat Cruises',
    'Hiking',
    'Camping',
    'Luxury Accommodation'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log('Business setup data:', formData)
    
    // Show immediate impact
      alert('Congratulations! Your business has been listed and is now visible to travelers! You\'ll receive notifications when someone shows interest in your services.')
    
    // In real app, this would:
    // 1. Create business listing in database
    // 2. Send notification to nearby travelers
    // 3. Update search results
    // 4. Send welcome email with next steps
    // 5. Redirect to business dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Connexus
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-yellow-600 font-semibold">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/sign-in">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">List Your Business</h1>
          <p className="text-xl text-gray-300">Join Connexus and connect with international travelers</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-yellow-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-300">Basic Info</span>
            <span className="text-sm text-gray-300">Services</span>
            <span className="text-sm text-gray-300">Pricing</span>
            <span className="text-sm text-gray-300">Media</span>
          </div>
        </div>

        <Card className="bg-gray-800 border-yellow-500/30 p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Basic Information</h2>
              
              <div>
                <label className="block text-white font-semibold mb-2">Business Name *</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Business Type *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Business Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your business and what makes it unique"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Services Offered</h2>
              
              <div>
                <label className="block text-white font-semibold mb-4">Select the services you offer:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map(service => (
                    <button
                      key={service}
                      onClick={() => handleServiceToggle(service)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        formData.services.includes(service)
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-yellow-500'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Pricing Information</h2>
              
              <div>
                <label className="block text-white font-semibold mb-2">Starting Price (USD) *</label>
                <input
                  type="number"
                  value={formData.pricing}
                  onChange={(e) => handleInputChange('pricing', e.target.value)}
                  placeholder="Enter your starting price"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Contact Email *</label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo', {...formData.contactInfo, email: e.target.value})}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo', {...formData.contactInfo, phone: e.target.value})}
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Website (Optional)</label>
                <input
                  type="url"
                  value={formData.contactInfo.website}
                  onChange={(e) => handleInputChange('contactInfo', {...formData.contactInfo, website: e.target.value})}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 4: Media */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Add Photos & Media</h2>
              
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Upload Photos</h3>
                <p className="text-gray-300 mb-4">Add photos of your business, services, and experiences</p>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Choose Files
                </Button>
                <p className="text-gray-400 text-sm mt-2">JPG, PNG up to 10MB each</p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Pro Tip</h4>
                <p className="text-gray-300 text-sm">
                  High-quality photos help travelers understand what to expect. Include photos of your facilities, 
                  activities, and happy customers for the best results.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Complete Setup
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
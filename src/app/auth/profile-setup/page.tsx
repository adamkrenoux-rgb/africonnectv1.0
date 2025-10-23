'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ProfileSetupPage() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState('traveler') // This would come from auth context
  const [formData, setFormData] = useState({
    profilePhoto: '',
    bio: '',
    interests: [],
    languages: [],
    experience: '',
    specialties: [],
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: '',
      website: ''
    },
    availability: '',
    pricing: {
      min: '',
      max: ''
    }
  })

  const travelerInterests = [
    'Wildlife Photography', 'Cultural Experiences', 'Adventure Sports', 
    'Food & Cuisine', 'History & Heritage', 'Nature & Conservation',
    'Art & Crafts', 'Music & Dance', 'Religious Sites', 'Beach & Coastal'
  ]

  const businessSpecialties = [
    'Safari Tours', 'Cultural Tours', 'Adventure Activities', 'Luxury Lodges',
    'Budget Accommodations', 'Restaurants', 'Transportation', 'Photography Services',
    'Guided Hiking', 'Wildlife Conservation', 'Community Projects', 'Educational Tours'
  ]

  const influencerSpecialties = [
    'Travel Content', 'Lifestyle', 'Adventure', 'Food & Dining', 'Photography',
    'Videography', 'Cultural Content', 'Wildlife', 'Nature', 'Fashion',
    'Wellness', 'Education', 'Entertainment', 'News & Current Affairs'
  ]

  const languages = [
    'English', 'French', 'Spanish', 'Portuguese', 'Arabic', 'Swahili',
    'Amharic', 'Yoruba', 'Zulu', 'Hausa', 'Other'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile setup data:', formData)
    
    // Redirect to appropriate dashboard
    if (userType === 'traveler') {
      window.location.href = '/travelers/dashboard'
    } else if (userType === 'business') {
      window.location.href = '/businesses/dashboard'
    } else if (userType === 'influencer') {
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
                AFRICONNECT
              </Link>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Complete Your Profile</h1>
          <p className="text-xl text-gray-300">Help us personalize your AFRICONNECT experience</p>
        </div>

        <Card className="bg-gray-800 border-yellow-500/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Profile */}
            {step === 1 && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
                  <p className="text-gray-300">This helps us match you with the right experiences</p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Profile Photo</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <span className="text-4xl">📷</span>
                    </div>
                    <p className="text-gray-300 mb-4">Upload a profile photo</p>
                    <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                      Choose Photo
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Tell us about yourself, your interests, and what you're looking for..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-4">Languages you speak</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {languages.map((language) => (
                      <label key={language} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(formData.languages as string[]).includes(language)}
                          onChange={(e) => handleArrayChange('languages', language, e.target.checked)}
                          className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                        />
                        <span className="text-gray-300">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Role-specific information */}
            {step === 2 && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {userType === 'traveler' && 'Your Travel Preferences'}
                    {userType === 'business' && 'Your Business Details'}
                    {userType === 'influencer' && 'Your Content Specialties'}
                  </h2>
                  <p className="text-gray-300">Help us understand your specific needs and interests</p>
                </div>

                {userType === 'traveler' && (
                  <>
                    <div>
                      <label className="block text-white font-semibold mb-4">Travel Interests</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {travelerInterests.map((interest) => (
                          <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.interests as string[]).includes(interest)}
                              onChange={(e) => handleArrayChange('interests', interest, e.target.checked)}
                              className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                            />
                            <span className="text-gray-300">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Travel Experience</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="">Select your experience level</option>
                        <option value="beginner">Beginner (0-2 trips)</option>
                        <option value="intermediate">Intermediate (3-10 trips)</option>
                        <option value="experienced">Experienced (10+ trips)</option>
                        <option value="expert">Expert (Frequent traveler)</option>
                      </select>
                    </div>
                  </>
                )}

                {userType === 'business' && (
                  <>
                    <div>
                      <label className="block text-white font-semibold mb-4">Business Specialties</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {businessSpecialties.map((specialty) => (
                          <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.specialties as string[]).includes(specialty)}
                              onChange={(e) => handleArrayChange('specialties', specialty, e.target.checked)}
                              className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                            />
                            <span className="text-gray-300">{specialty}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Years in Business</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="">Select years in business</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </>
                )}

                {userType === 'influencer' && (
                  <>
                    <div>
                      <label className="block text-white font-semibold mb-4">Content Specialties</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {influencerSpecialties.map((specialty) => (
                          <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.specialties as string[]).includes(specialty)}
                              onChange={(e) => handleArrayChange('specialties', specialty, e.target.checked)}
                              className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                            />
                            <span className="text-gray-300">{specialty}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-semibold mb-2">Minimum Collaboration Fee</label>
                        <input
                          type="number"
                          name="pricing.min"
                          value={formData.pricing.min}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="e.g., 500"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-semibold mb-2">Maximum Collaboration Fee</label>
                        <input
                          type="number"
                          name="pricing.max"
                          value={formData.pricing.max}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="e.g., 5000"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 3: Social Links */}
            {step === 3 && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Connect Your Social Media</h2>
                  <p className="text-gray-300">Help others find and connect with you</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Instagram</label>
                    <input
                      type="text"
                      name="socialLinks.instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Twitter/X</label>
                    <input
                      type="text"
                      name="socialLinks.twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">LinkedIn</label>
                    <input
                      type="text"
                      name="socialLinks.linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Website</label>
                    <input
                      type="url"
                      name="socialLinks.website"
                      value={formData.socialLinks.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                >
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

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

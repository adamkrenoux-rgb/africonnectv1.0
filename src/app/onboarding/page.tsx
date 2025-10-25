'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelection = async (role: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-600 mb-4">🌍 Welcome to AFRICONNECT</h1>
          <p className="text-xl text-gray-600">
            Choose your role to get started with authentic African travel experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Traveler Card */}
          <Card 
            className={`p-8 text-center cursor-pointer transition-all ${
              selectedRole === 'TRAVELER' 
                ? 'ring-2 ring-yellow-500 bg-yellow-50' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedRole('TRAVELER')}
          >
            <div className="text-6xl mb-4">🧭</div>
            <h3 className="text-2xl font-semibold mb-4">Traveler</h3>
            <p className="text-gray-600 mb-6">
              travelers looking for authentic African experiences
            </p>
            <ul className="text-left text-sm text-gray-500 space-y-2">
              <li>• AI-powered trip discovery</li>
              <li>• Verified local businesses</li>
              <li>• Secure booking & payments</li>
              <li>• Trusted community</li>
            </ul>
          </Card>

          {/* Business Card */}
          <Card 
            className={`p-8 text-center cursor-pointer transition-all ${
              selectedRole === 'BUSINESS' 
                ? 'ring-2 ring-yellow-500 bg-yellow-50' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedRole('BUSINESS')}
          >
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-2xl font-semibold mb-4">Business</h3>
            <p className="text-gray-600 mb-6">
              Tourism businesses offering authentic experiences
            </p>
            <ul className="text-left text-sm text-gray-500 space-y-2">
              <li>• List your services</li>
              <li>• Connect with travelers</li>
              <li>• Collaborate with influencers</li>
              <li>• Grow your business</li>
            </ul>
          </Card>

          {/* Influencer Card */}
          <Card 
            className={`p-8 text-center cursor-pointer transition-all ${
              selectedRole === 'INFLUENCER' 
                ? 'ring-2 ring-yellow-500 bg-yellow-50' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedRole('INFLUENCER')}
          >
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-2xl font-semibold mb-4">Influencer</h3>
            <p className="text-gray-600 mb-6">
              Content creators promoting African tourism
            </p>
            <ul className="text-left text-sm text-gray-500 space-y-2">
              <li>• Create campaigns</li>
              <li>• Partner with businesses</li>
              <li>• Earn from collaborations</li>
              <li>• Build your audience</li>
            </ul>
          </Card>
        </div>

        {selectedRole && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => handleRoleSelection(selectedRole)}
              disabled={isLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg"
            >
              {isLoading ? 'Setting up...' : `Continue as ${selectedRole}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
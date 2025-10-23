'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
// import { UserRole } from '@prisma/client'

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
    <div className="min-h-screen bg-gradient-to-br from-africa-earth/10 via-africa-green/10 to-africa-blue/10">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-africa-earth mb-4">🌍 Welcome to AFRICONNECT</h1>
          <p className="text-xl text-gray-600">
            Choose your role to get started with authentic African travel experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Traveler Card */}
          <Card 
            className={`p-8 text-center cursor-pointer transition-all ${
              selectedRole === 'TRAVELER' 
                ? 'ring-2 ring-africa-earth bg-africa-earth/5' 
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
              selectedRole === ''BUSINESS 
                ? 'ring-2 ring-africa-earth bg-africa-earth/5' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedRole(''BUSINESS)}
          >
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-2xl font-semibold mb-4">Business</h3>
            <p className="text-gray-600 mb-6">
              Local tourism businesses offering authentic African experiences
            </p>
            <ul className="text-left text-sm text-gray-500 space-y-2">
              <li>• AI listing optimization</li>
              <li>• Verified business badge</li>
              <li>• Influencer collaborations</li>
              <li>• Global visibility</li>
            </ul>
          </Card>

          {/* Influencer Card */}
          <Card 
            className={`p-8 text-center cursor-pointer transition-all ${
              selectedRole === ''INFLUENCER 
                ? 'ring-2 ring-africa-earth bg-africa-earth/5' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedRole(''INFLUENCER)}
          >
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-2xl font-semibold mb-4">Influencer</h3>
            <p className="text-gray-600 mb-6">
              Travel influencers connecting with local businesses for collaborations
            </p>
            <ul className="text-left text-sm text-gray-500 space-y-2">
              <li>• AI campaign projections</li>
              <li>• Business partnerships</li>
              <li>• Fair pricing insights</li>
              <li>• Content collaboration</li>
            </ul>
          </Card>
        </div>

        {selectedRole && (
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-africa-earth hover:bg-africa-earth/90"
              onClick={() => handleRoleSelection(selectedRole)}
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : 'Continue as ' + selectedRole.toLowerCase()}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

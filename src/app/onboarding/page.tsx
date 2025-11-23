'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function OnboardingPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Redirect to sign-up if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('[Onboarding] User not signed in, redirecting to sign-up')
      router.push('/sign-up?redirect_url=/onboarding')
    } else if (isLoaded && isSignedIn) {
      console.log('[Onboarding] User signed in:', user?.id, 'Email:', user?.emailAddresses?.[0]?.emailAddress)
    }
  }, [isLoaded, isSignedIn, router, user])

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show sign-up prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">🌍 Welcome to Connexus</h1>
          <p className="text-gray-600 mb-6">
            Please sign up to continue
          </p>
          <Button
            onClick={() => router.push('/sign-up?redirect_url=/onboarding')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg"
          >
            Go to Sign Up
          </Button>
        </div>
      </div>
    )
  }

  const roleLabels: Record<string, string> = {
    TRAVELER: 'Traveler',
    BUSINESS: 'Business',
    INFLUENCER: 'Influencer',
    ADMIN: 'Admin'
  }

  const getNextPath = (role: string) => {
    switch (role) {
      case 'BUSINESS':
        return '/businesses/dashboard'
      case 'INFLUENCER':
        return '/influencers/dashboard'
      case 'TRAVELER':
      default:
        return '/travelers/dashboard'
    }
  }

  const handleRoleSelection = async (role: string | null) => {
    if (!role) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type')
      let data: any = null
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError)
          setError('Received an invalid response from the server. Please try again.')
          return
        }
      } else {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        setError('Server error. Please check your database connection and try again.')
        return
      }

      if (!response.ok || !data?.success) {
        const message =
          data?.error ||
          `Unable to update your role. Please try again or contact support.`
        setError(message)
        return
      }

      router.push(getNextPath(role))
    } catch (error: any) {
      console.error('Error updating user role:', error)
      const message = error.message || 'Something went wrong while setting up your account. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-600 mb-4">🌍 Welcome to Connexus</h1>
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
              {isLoading ? 'Setting up...' : `Continue as ${roleLabels[selectedRole] ?? selectedRole}`}
            </Button>
            {error && (
              <p className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
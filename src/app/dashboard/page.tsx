'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const ROLE_REDIRECTS: Record<string, string> = {
  TRAVELER: '/travelers/dashboard',
  BUSINESS: '/businesses/dashboard',
  INFLUENCER: '/influencers/dashboard',
  ADMIN: '/admin'
}

export default function Dashboard() {
  const router = useRouter()
  const hasRedirected = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) return

    // Fetch user role from API
    const fetchUserRole = async () => {
      if (hasRedirected.current) return

      try {
        const response = await fetch('/api/users/me')
        
        if (!response.ok) {
          // If API fails (401 = not authenticated), redirect to sign-in
          if (response.status === 401) {
            hasRedirected.current = true
            router.replace('/sign-in?redirect_url=/dashboard')
            return
          }
          // For other errors, default to traveler dashboard
          console.warn('[Dashboard] API failed, defaulting to traveler dashboard')
          hasRedirected.current = true
          router.replace('/travelers/dashboard')
          return
        }

        const data = await response.json()
        
        if (data.success && data.user) {
          const role = data.user.role || 'TRAVELER'
          const destination = ROLE_REDIRECTS[role] || '/travelers/dashboard'
          hasRedirected.current = true
          router.replace(destination)
        } else {
          // Default to traveler dashboard if no role found
          console.warn('[Dashboard] No user role found, defaulting to traveler dashboard')
          hasRedirected.current = true
          router.replace('/travelers/dashboard')
        }
      } catch (error: any) {
        console.error('[Dashboard] Error fetching user role:', error)
        setError(error?.message || 'Failed to load dashboard')
        // Default to traveler dashboard on error after a delay
        setTimeout(() => {
          if (!hasRedirected.current) {
            hasRedirected.current = true
            router.replace('/travelers/dashboard')
          }
        }, 2000)
      }
    }

    fetchUserRole()
  }, [router])

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              hasRedirected.current = false
              window.location.reload()
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show loading state while checking auth and fetching role
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading your dashboard...</p>
      </div>
    </div>
  )
}
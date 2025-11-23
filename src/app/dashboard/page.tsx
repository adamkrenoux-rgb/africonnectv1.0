'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

const ROLE_REDIRECTS: Record<string, string> = {
  TRAVELER: '/travelers/dashboard',
  BUSINESS: '/businesses/dashboard',
  INFLUENCER: '/influencers/dashboard',
  ADMIN: '/admin'
}

export default function Dashboard() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) return

    if (!isLoaded) return

    if (!isSignedIn) {
      hasRedirected.current = true
      router.replace('/sign-in?redirect_url=/dashboard')
      return
    }

    // Fetch user role from API
    const fetchUserRole = async () => {
      if (hasRedirected.current) return

      try {
        const response = await fetch('/api/users/me')
        if (!response.ok) {
          // If API fails, default to traveler dashboard
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
          hasRedirected.current = true
          router.replace('/travelers/dashboard')
        }
      } catch (error) {
        console.error('[Dashboard] Error fetching user role:', error)
        // Default to traveler dashboard on error
        hasRedirected.current = true
        router.replace('/travelers/dashboard')
      }
    }

    fetchUserRole()
  }, [isLoaded, isSignedIn, router])

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
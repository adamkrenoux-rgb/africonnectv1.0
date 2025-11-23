'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface UserProviderProps {
  children: React.ReactNode
}

/**
 * Provider component that syncs Clerk user with database
 * Use this to wrap your app and ensure user data is synced
 */
export function UserProvider({ children }: UserProviderProps) {
  const { user, isLoaded } = useUser()
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user to database on mount
      syncUserToDatabase()
    }
  }, [user, isLoaded])

  const syncUserToDatabase = async () => {
    if (!user || isSyncing) return
    
    setIsSyncing(true)
    try {
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || user.username,
          profilePicture: user.imageUrl,
          role: user.publicMetadata?.role || 'TRAVELER',
          bio: user.publicMetadata?.bio,
          country: user.publicMetadata?.country,
        })
      })
    } catch (error) {
      console.error('Error syncing user:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return <>{children}</>
}

/**
 * Hook to get current user data with database info
 */
export function useCurrentUser() {
  const { user, isLoaded: clerkLoaded } = useUser()
  const [dbUser, setDbUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (clerkLoaded && user) {
      fetchUserData()
    } else if (clerkLoaded && !user) {
      setIsLoading(false)
    }
  }, [user, clerkLoaded])

  const fetchUserData = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/users/me')
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Non-JSON response from /api/users/me:', contentType)
        setIsLoading(false)
        return
      }
      
      if (response.ok) {
        try {
          const data = await response.json()
          if (data.success && data.user) {
            setDbUser(data.user)
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    clerkUser: user,
    dbUser,
    isLoaded: clerkLoaded && !isLoading,
    role: dbUser?.role || user?.publicMetadata?.role || 'TRAVELER',
  }
}

export { UserButton }

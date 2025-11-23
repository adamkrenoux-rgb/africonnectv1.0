'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { safeJsonParse } from '@/lib/api-helpers'

interface TravelerDashboardData {
  profile: any | null
  recommendations: any[]
  feed: any[]
  notifications: any[]
  tripPlans: any[]
  history: any[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const response = await fetch(url, {
    credentials: 'include',
    ...init
  })

  const data = await safeJsonParse<{ success: boolean; [key: string]: any }>(response)
  if (!data || !data.success) {
    throw new Error(data?.error || `Request failed for ${url}`)
  }

  return data as unknown as T
}

export function useTravelerDashboard(): TravelerDashboardData {
  const [profile, setProfile] = useState<any | null>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [feed, setFeed] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [tripPlans, setTripPlans] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        profileResponse,
        recommendationResponse,
        feedResponse,
        notificationsResponse,
        tripPlansResponse,
        historyResponse
      ] = await Promise.allSettled([
        fetchJson<{ profile: any }>('/api/travelers/profile'),
        fetchJson<{ recommendations: any[]; provider?: string }>('/api/travelers/recommendations?take=8'),
        fetchJson<{ feed: any[]; region: string }>('/api/travelers/feed?take=6'),
        fetchJson<{ notifications: any[] }>('/api/travelers/notifications?take=5&unread=false'),
        fetchJson<{ tripPlans: any[] }>('/api/travelers/trip-plans?take=5'),
        fetchJson<{ history: any[] }>('/api/travelers/history?take=5')
      ])

      if (profileResponse.status === 'fulfilled' && profileResponse.value) {
        setProfile(profileResponse.value.profile)
      }

      if (recommendationResponse.status === 'fulfilled' && recommendationResponse.value) {
        setRecommendations(recommendationResponse.value.recommendations || [])
      }

      if (feedResponse.status === 'fulfilled' && feedResponse.value) {
        setFeed(feedResponse.value.feed || [])
      }

      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value) {
        setNotifications(notificationsResponse.value.notifications || [])
      }

      if (tripPlansResponse.status === 'fulfilled' && tripPlansResponse.value) {
        setTripPlans(tripPlansResponse.value.tripPlans || [])
      }

      if (historyResponse.status === 'fulfilled' && historyResponse.value) {
        setHistory(historyResponse.value.history || [])
      }

      const rejected = [
        profileResponse,
        recommendationResponse,
        feedResponse,
        notificationsResponse,
        tripPlansResponse,
        historyResponse
      ].filter((result) => result.status === 'rejected') as PromiseRejectedResult[]

      if (rejected.length > 0) {
        throw rejected[0].reason
      }
    } catch (error: any) {
      console.error('Failed to load traveler dashboard:', error)
      setError(error?.message || 'Failed to load traveler data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return useMemo(
    () => ({
      profile,
      recommendations,
      feed,
      notifications,
      tripPlans,
      history,
      loading,
      error,
      refresh: load
    }),
    [profile, recommendations, feed, notifications, tripPlans, history, loading, error, load]
  )
}


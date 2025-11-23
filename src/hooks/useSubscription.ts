import { useCallback, useEffect, useState } from 'react'

export type PlanTier = 'FREE' | 'BASIC' | 'PRO' | 'DIAMOND'
export type SubscriptionStatus = 'INCOMPLETE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE_EXPIRED' | 'UNPAID'

export interface SubscriptionInfo {
  id: string
  userId: string
  planTier: PlanTier
  status: SubscriptionStatus
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt: string
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [entitlements, setEntitlements] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/subscriptions', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch subscription')
      }
      setSubscription(data.subscription || null)
      const ent = (data.entitlements || []) as { key: string; value: string }[]
      setEntitlements(Object.fromEntries(ent.map(e => [e.key, e.value])))
    } catch (e: any) {
      setError(e.message || 'Failed to fetch subscription')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const startCheckout = useCallback(async (planTier: PlanTier) => {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planTier })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to start checkout')
    }
    if (data.url) window.location.href = data.url
  }, [])

  const openPortal = useCallback(async () => {
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to open portal')
    }
    if (data.url) window.location.href = data.url
  }, [])

  const hasEntitlement = useCallback((key: string, expectedValue?: string) => {
    const val = entitlements[key]
    if (val === undefined) return false
    if (expectedValue === undefined) return true
    return String(val) === String(expectedValue)
  }, [entitlements])

  return { subscription, entitlements, loading, error, refresh, startCheckout, openPortal, hasEntitlement }
}



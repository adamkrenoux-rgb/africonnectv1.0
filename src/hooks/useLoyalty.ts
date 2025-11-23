import { useCallback, useEffect, useState } from 'react'

export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUST'

export interface LoyaltyAccount {
  id: string
  points: number
  tier: string
  updatedAt: string
}

export interface LoyaltyTransaction {
  id: string
  loyaltyAccountId: string
  type: LoyaltyTransactionType
  points: number
  reason?: string
  referenceType?: 'BUSINESS' | 'LISTING' | 'CAMPAIGN' | 'ITINERARY' | 'OTHER'
  referenceId?: string
  metadata?: any
  createdAt: string
}

export function useLoyalty() {
  const [account, setAccount] = useState<LoyaltyAccount | null>(null)
  const [recent, setRecent] = useState<LoyaltyTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/loyalty', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load loyalty')
      setAccount(data.account)
      setRecent(data.recent || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load loyalty')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTransaction = useCallback(
    async (payload: { type: LoyaltyTransactionType; points: number; reason?: string; referenceType?: LoyaltyTransaction['referenceType']; referenceId?: string }) => {
      const res = await fetch('/api/loyalty/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add transaction')
      await refresh()
      return data
    },
    [refresh]
  )

  return { account, recent, loading, error, refresh, addTransaction }
}



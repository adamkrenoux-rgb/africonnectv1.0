import { useCallback, useEffect, useState } from 'react'

export type PromotionStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

export interface Promotion {
  id: string
  userId: string
  businessId?: string
  listingId?: string
  region?: string
  budgetCents: number
  status: PromotionStatus
  priorityBoost: number
  metrics?: any
  startAt?: string
  endAt?: string
  createdAt: string
  updatedAt: string
}

export function usePromotions() {
  const [items, setItems] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/promotions', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load promotions')
      setItems(data.items || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load promotions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createPromotion = useCallback(
    async (payload: { businessId?: string; listingId?: string; region?: string; budgetCents?: number; startAt?: string; endAt?: string; priorityBoost?: number }) => {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create promotion')
      await refresh()
      return data.promotion as Promotion
    },
    [refresh]
  )

  const updatePromotion = useCallback(
    async (id: string, update: Partial<Pick<Promotion, 'status' | 'budgetCents' | 'priorityBoost' | 'startAt' | 'endAt'>>) => {
      const res = await fetch(`/api/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update promotion')
      await refresh()
      return data.promotion as Promotion
    },
    [refresh]
  )

  const cancelPromotion = useCallback(async (id: string) => {
    const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to cancel promotion')
    await refresh()
  }, [refresh])

  return { items, loading, error, refresh, createPromotion, updatePromotion, cancelPromotion }
}



import { useCallback, useEffect, useState } from 'react'

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'CANCELLED'
export type DisputeTargetType = 'BOOKING' | 'CAMPAIGN' | 'APPLICATION'

export interface Dispute {
  id: string
  targetType: DisputeTargetType
  targetId: string
  createdByUserId: string
  againstUserId?: string
  reason: string
  details?: string
  status: DisputeStatus
  resolutionNotes?: string
  createdAt: string
  updatedAt: string
}

export function useDisputes(role: 'me' | 'against' | 'all' = 'all', status?: DisputeStatus) {
  const [items, setItems] = useState<Dispute[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (role) params.set('role', role)
      if (status) params.set('status', status)
      const res = await fetch(`/api/disputes?${params.toString()}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load disputes')
      }
      setItems(data.disputes || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load disputes')
    } finally {
      setLoading(false)
    }
  }, [role, status])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createDispute = useCallback(
    async (payload: { targetType: DisputeTargetType; targetId: string; reason: string; details?: string }) => {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create dispute')
      }
      await refresh()
      return data.dispute as Dispute
    },
    [refresh]
  )

  const updateStatus = useCallback(
    async (id: string, update: { status: DisputeStatus; resolutionNotes?: string }) => {
      const res = await fetch(`/api/disputes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update dispute')
      }
      await refresh()
      return data.dispute as Dispute
    },
    [refresh]
  )

  const addMessage = useCallback(async (id: string, content: string) => {
    const res = await fetch(`/api/disputes/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to add message')
    }
    return data.message
  }, [])

  return { items, loading, error, refresh, createDispute, updateStatus, addMessage }
}



import { useCallback, useEffect, useState } from 'react'

export interface WalletInfo {
  id: string
  currency: string
  available: number
  pending: number
  updatedAt: string
}

export interface WalletTransaction {
  id: string
  walletAccountId: string
  amount: number
  currency: string
  type: 'DEPOSIT' | 'HOLD' | 'RELEASE' | 'REFUND' | 'WITHDRAWAL' | 'ADJUSTMENT'
  status: 'PENDING' | 'POSTED' | 'FAILED'
  referenceType?: 'BUSINESS' | 'LISTING' | 'CAMPAIGN' | 'ITINERARY' | 'OTHER'
  referenceId?: string
  description?: string
  metadata?: any
  createdAt: string
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [recent, setRecent] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/wallet', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load wallet')
      }
      setWallet(data.wallet)
      setRecent(data.recentTransactions || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load wallet')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createAdjustment = useCallback(
    async (amount: number, description?: string) => {
      const res = await fetch('/api/wallet/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create adjustment')
      }
      await refresh()
      return data
    },
    [refresh]
  )

  return { wallet, recent, loading, error, refresh, createAdjustment }
}



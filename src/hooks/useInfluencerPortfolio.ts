import { useCallback, useEffect, useState } from 'react'

export interface InfluencerPortfolio {
  id: string
  userId: string
  headline?: string
  bio?: string
  stats?: any
  niches?: string[]
  links?: any
  media?: any
  createdAt: string
  updatedAt: string
  exportedAt?: string
}

export function useInfluencerPortfolio() {
  const [portfolio, setPortfolio] = useState<InfluencerPortfolio | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/influencers/portfolio', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load portfolio')
      setPortfolio(data.portfolio || null)
    } catch (e: any) {
      setError(e.message || 'Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const save = useCallback(async (update: Partial<InfluencerPortfolio>) => {
    const res = await fetch('/api/influencers/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save portfolio')
    setPortfolio(data.portfolio)
    return data.portfolio as InfluencerPortfolio
  }, [])

  const generate = useCallback(async (payload: { niches?: string[]; links?: any; socials?: any }) => {
    const res = await fetch('/api/influencers/portfolio/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {})
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to generate portfolio')
    setPortfolio(data.portfolio)
    return data.portfolio as InfluencerPortfolio
  }, [])

  const exportMarkdown = useCallback(async () => {
    const res = await fetch('/api/influencers/portfolio/export?format=markdown')
    if (!res.ok) throw new Error('Failed to export')
    return await res.text()
  }, [])

  return { portfolio, loading, error, refresh, save, generate, exportMarkdown }
}



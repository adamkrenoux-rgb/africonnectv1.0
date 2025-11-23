import { useCallback, useEffect, useState } from 'react'

export interface FavoriteItem {
  id: string
  userId: string
  entityType: 'BUSINESS' | 'LISTING' | 'CAMPAIGN' | 'ITINERARY' | 'OTHER'
  entityId: string
  createdAt: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/favorites', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load favorites')
      }
      setFavorites(data.favorites || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addFavorite = useCallback(
    async (entityType: FavoriteItem['entityType'], entityId: string) => {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add favorite')
      }
      await refresh()
    },
    [refresh]
  )

  const removeFavorite = useCallback(
    async (entityType: FavoriteItem['entityType'], entityId: string) => {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove favorite')
      }
      await refresh()
    },
    [refresh]
  )

  const isFavorited = useCallback(
    (entityType: FavoriteItem['entityType'], entityId: string) =>
      favorites.some(f => f.entityType === entityType && f.entityId === entityId),
    [favorites]
  )

  return { favorites, loading, error, refresh, addFavorite, removeFavorite, isFavorited }
}




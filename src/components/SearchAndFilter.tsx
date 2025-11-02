'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export interface SearchFilters {
  search?: string
  location?: string
  country?: string
  activityType?: string
  verified?: boolean
  minPrice?: number
  maxPrice?: number
  limit?: number
}

interface SearchAndFilterProps {
  onFiltersChange: (filters: SearchFilters) => void
  onResultsChange?: (results: any[]) => void
  resourceType?: 'listings' | 'businesses' | 'campaigns'
  showLocationFilter?: boolean
  showPriceFilter?: boolean
  showVerifiedFilter?: boolean
  showActivityFilter?: boolean
  className?: string
}

const ACTIVITY_TYPES = [
  'SAFARI',
  'CULTURAL',
  'ADVENTURE',
  'WILDLIFE',
  'BEACH',
  'MOUNTAIN',
  'WATER_SPORTS',
  'PHOTOGRAPHY',
  'FOOD',
  'HISTORICAL',
  'NATURE',
  'SPIRITUAL'
]

export function SearchAndFilter({
  onFiltersChange,
  onResultsChange,
  resourceType = 'listings',
  showLocationFilter = true,
  showPriceFilter = true,
  showVerifiedFilter = true,
  showActivityFilter = true,
  className = ''
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<any[]>([])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch()
      } else {
        setFilters({})
        onFiltersChange({})
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const performSearch = useCallback(async () => {
    setIsSearching(true)
    
    const currentFilters: SearchFilters = {
      ...filters,
      search: searchQuery.trim() || undefined,
    }

    try {
      let apiUrl = ''
      const params = new URLSearchParams()

      if (resourceType === 'listings') {
        apiUrl = '/api/listings'
        if (currentFilters.search) params.append('search', currentFilters.search)
        if (currentFilters.location) params.append('location', currentFilters.location)
        if (currentFilters.country) params.append('country', currentFilters.country)
        if (currentFilters.activityType) params.append('activityType', currentFilters.activityType)
        if (currentFilters.verified !== undefined) params.append('verified', String(currentFilters.verified))
        if (currentFilters.limit) params.append('limit', String(currentFilters.limit))
      } else if (resourceType === 'businesses') {
        apiUrl = '/api/businesses'
        if (currentFilters.search) params.append('search', currentFilters.search)
        if (currentFilters.country) params.append('country', currentFilters.country)
        if (currentFilters.verified !== undefined) params.append('verified', String(currentFilters.verified))
        if (currentFilters.limit) params.append('limit', String(currentFilters.limit))
      } else if (resourceType === 'campaigns') {
        apiUrl = '/api/campaigns'
        if (currentFilters.search) params.append('search', currentFilters.search)
        if (currentFilters.location) params.append('region', currentFilters.location)
        if (currentFilters.limit) params.append('limit', String(currentFilters.limit))
      }

      const response = await fetch(`${apiUrl}?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      const items = data[resourceType] || data.listings || data.businesses || data.campaigns || []

      // Apply price filter if specified
      let filteredItems = items
      if (showPriceFilter && currentFilters.minPrice !== undefined && resourceType === 'listings') {
        filteredItems = items.filter((item: any) => {
          const price = typeof item.pricing === 'number' ? item.pricing : item.pricing?.amount || 0
          const meetsMin = currentFilters.minPrice === undefined || price >= currentFilters.minPrice
          const meetsMax = currentFilters.maxPrice === undefined || price <= currentFilters.maxPrice
          return meetsMin && meetsMax
        })
      }

      setResults(filteredItems)
      setFilters(currentFilters)
      onFiltersChange(currentFilters)
      onResultsChange?.(filteredItems)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      onResultsChange?.([])
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, filters, resourceType, showPriceFilter, onFiltersChange, onResultsChange])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({})
    onFiltersChange({})
    setResults([])
    onResultsChange?.([])
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${resourceType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-24 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <div className="absolute right-2 flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-400 hover:text-white text-xs"
              >
                Clear ({activeFilterCount})
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>
        
        {isSearching && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="space-y-6">
            {/* Location Filter */}
            {showLocationFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location / Country
                </label>
                <input
                  type="text"
                  placeholder="e.g., Kenya, Tanzania, South Africa"
                  value={filters.location || filters.country || ''}
                  onChange={(e) => updateFilter(resourceType === 'businesses' ? 'country' : 'location', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            )}

            {/* Activity Type Filter */}
            {showActivityFilter && resourceType === 'listings' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Activity Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ACTIVITY_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => updateFilter('activityType', filters.activityType === type ? undefined : type)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.activityType === type
                          ? 'bg-yellow-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {filters.activityType === type && <Check className="w-3 h-3 inline mr-1" />}
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range Filter */}
            {showPriceFilter && resourceType === 'listings' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Range ($)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Verified Filter */}
            {showVerifiedFilter && (
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verified === true}
                    onChange={(e) => updateFilter('verified', e.target.checked ? true : undefined)}
                    className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-300">Verified only</span>
                </label>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Results Count */}
      {results.length > 0 && (
        <div className="text-sm text-gray-400">
          Found {results.length} {resourceType}
        </div>
      )}
    </div>
  )
}

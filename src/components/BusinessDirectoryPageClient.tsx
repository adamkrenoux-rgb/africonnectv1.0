'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, MapPin, Star, SlidersHorizontal } from 'lucide-react'
import { Pagination } from '@/components/Pagination'

type SearchParams = Record<string, string | string[] | undefined>

type SortOption = 'newest' | 'rating' | 'name' | 'views'

interface Business {
  id: string
  businessName: string
  description: string
  location: string
  city: string
  country: string
  businessType: string
  verificationBadge: boolean
  trustScore: number
  website?: string
  phone?: string
  email?: string
  user: {
    id: string
    name: string
    profilePicture?: string
  }
  listings: Array<{
    id: string
    title: string
  }>
  reviews: Array<{
    rating: number
  }>
  averageRating?: number
  reviewCount?: number
}

const getParamValue = (params: SearchParams, key: string): string => {
  const value = params[key]
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return value ?? ''
}

const getBooleanParam = (params: SearchParams, key: string): boolean => {
  return getParamValue(params, key) === 'true'
}

const getNumberParam = (params: SearchParams, key: string, fallback: number): number => {
  const raw = getParamValue(params, key)
  const parsed = parseInt(raw, 10)
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed
}

interface BusinessDirectoryPageClientProps {
  initialSearchParams: SearchParams
}

export function BusinessDirectoryPageClient({ initialSearchParams }: BusinessDirectoryPageClientProps) {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const [searchQuery, setSearchQuery] = useState(() => getParamValue(initialSearchParams, 'search'))
  const [selectedCountry, setSelectedCountry] = useState(() => getParamValue(initialSearchParams, 'country'))
  const [selectedType, setSelectedType] = useState(() => getParamValue(initialSearchParams, 'type'))
  const [verifiedOnly, setVerifiedOnly] = useState(() => getBooleanParam(initialSearchParams, 'verified'))
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const value = getParamValue(initialSearchParams, 'sort') as SortOption
    return value || 'newest'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(() => getNumberParam(initialSearchParams, 'page', 1))
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const itemsPerPage = 12

  const countries = ['Kenya', 'Tanzania', 'South Africa', 'Botswana', 'Namibia', 'Zambia', 'Zimbabwe', 'Uganda', 'Rwanda', 'Ghana', 'Morocco', 'Egypt']
  const businessTypes = ['SAFARI', 'ADVENTURE', 'CULTURAL', 'LUXURY', 'BUDGET', 'ACCOMMODATION', 'TRANSPORT', 'FOOD', 'OTHER']

  const syncStateFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    setSearchQuery(params.get('search') || '')
    setSelectedCountry(params.get('country') || '')
    setSelectedType(params.get('type') || '')
    setVerifiedOnly(params.get('verified') === 'true')
    setSortBy((params.get('sort') as SortOption) || 'newest')
    setCurrentPage(parseInt(params.get('page') || '1', 10) || 1)
  }, [])

  useEffect(() => {
    window.addEventListener('popstate', syncStateFromUrl)
    return () => {
      window.removeEventListener('popstate', syncStateFromUrl)
    }
  }, [syncStateFromUrl])

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCountry) params.append('country', selectedCountry)
      if (selectedType) params.append('type', selectedType)
      if (verifiedOnly) params.append('verified', 'true')
      params.append('page', currentPage.toString())
      params.append('pageSize', itemsPerPage.toString())

      const response = await fetch(`/api/businesses?${params.toString()}`)
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setError('Unexpected response from server. Please try again later.')
        setIsLoading(false)
        return
      }

      const data = await response.json()

      if (data.success) {
        let sortedBusinesses = [...data.businesses]
        switch (sortBy) {
          case 'rating':
            sortedBusinesses.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            break
          case 'name':
            sortedBusinesses.sort((a, b) => a.businessName.localeCompare(b.businessName))
            break
          default:
            break
        }

        setBusinesses(sortedBusinesses)
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalItems(data.pagination?.totalItems || 0)

        router.replace(`/businesses/directory?${params.toString()}`, { scroll: false })
      } else {
        setError(data.error || 'Failed to load businesses')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load businesses')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCountry, selectedType, verifiedOnly, currentPage, sortBy, router])

  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCountry('')
    setSelectedType('')
    setVerifiedOnly(false)
    setSortBy('newest')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Africonnect
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-yellow-600 font-semibold">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/sign-in">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Business Directory</h1>
          <p className="text-xl text-gray-300">Discover verified tourism businesses across Africa</p>
        </div>

        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <Button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          {showFilters && (
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value)
                      handleFilterChange()
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Business Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value)
                      handleFilterChange()
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">All Types</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as SortOption)
                      handleFilterChange()
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Verification</label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={verifiedOnly}
                      onChange={(e) => {
                        setVerifiedOnly(e.target.checked)
                        handleFilterChange()
                      }}
                      className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="verified" className="ml-2 text-gray-300">Verified Only</label>
                  </div>
                </div>
              </div>

              {(searchQuery || selectedCountry || selectedType || verifiedOnly) && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </Card>
          )}

          <div className="flex items-center justify-between text-gray-400">
            <p>
              {isLoading ? 'Loading...' : `Showing ${businesses.length} of ${totalItems} businesses`}
            </p>
          </div>
        </div>

        {error && (
          <Card className="bg-red-900/20 border-red-500/30 p-6 mb-6">
            <p className="text-red-400">{error}</p>
          </Card>
        )}

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 p-6 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-700 rounded w-3/4" />
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {businesses.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700 p-12 text-center">
                <p className="text-gray-400 text-lg mb-4">No businesses found</p>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <Button onClick={clearFilters} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {businesses.map((business) => (
                    <Link key={business.id} href={`/businesses/${business.id}`}>
                      <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer h-full">
                        <div className="relative h-48 bg-gradient-to-br from-yellow-600/20 to-orange-500/20 rounded-t-lg">
                          {business.user.profilePicture ? (
                            <Image
                              src={business.user.profilePicture}
                              alt={business.businessName}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl">🏢</span>
                            </div>
                          )}
                          {business.verificationBadge && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <span>✓</span> Verified
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{business.businessName}</h3>
                          <div className="flex items-center text-gray-400 mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{business.city}, {business.country}</span>
                          </div>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{business.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-white font-semibold">
                                {business.averageRating?.toFixed(1) || '0.0'}
                              </span>
                              <span className="text-gray-400 text-sm">
                                ({business.reviewCount || 0} reviews)
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                              {business.businessType.replace('_', ' ')}
                            </span>
                          </div>
                          {business.listings.length > 0 && (
                            <p className="text-gray-500 text-xs mt-2">
                              {business.listings.length} listing{business.listings.length !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page)
                      if (typeof window !== 'undefined') {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BusinessDirectoryPageClient

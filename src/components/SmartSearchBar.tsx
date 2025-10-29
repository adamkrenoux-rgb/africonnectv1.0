'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { aiHelper } from '@/lib/ai-helper'
import LoadingSpinner from '@/components/LoadingSpinner'

interface SearchSuggestion {
  id: string
  text: string
  type: 'destination' | 'activity' | 'business' | 'general'
  category?: string
}

interface SmartSearchBarProps {
  onSearch: (query: string, results: any[]) => void
  placeholder?: string
  className?: string
}

export default function SmartSearchBar({ 
  onSearch, 
  placeholder = "Search for experiences...",
  className = '' 
}: SmartSearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Pre-defined suggestions based on common searches
  const commonSearches: SearchSuggestion[] = [
    { id: '1', text: 'Luxury safaris in Tanzania', type: 'destination', category: 'Safari' },
    { id: '2', text: 'Cultural experiences in Kenya', type: 'activity', category: 'Culture' },
    { id: '3', text: 'Budget accommodations in Cape Town', type: 'business', category: 'Accommodation' },
    { id: '4', text: 'Photography tours in Botswana', type: 'activity', category: 'Photography' },
    { id: '5', text: 'Family-friendly activities in Morocco', type: 'general', category: 'Family' },
    { id: '6', text: 'Adventure sports in South Africa', type: 'activity', category: 'Adventure' }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = async (value: string) => {
    setQuery(value)
    
    if (value.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      // Get AI-powered suggestions
      const response = await aiHelper.generateResponse({
        prompt: `Based on the search query "${value}", suggest 5 relevant African travel experiences, destinations, or activities. Format as a simple list.`,
        maxTokens: 150,
        temperature: 0.7
      })

      if (response.success) {
        const aiSuggestions = response.data.split('\n')
          .slice(0, 5)
          .map((suggestion: string, index: number) => ({
            id: `ai-${index}`,
            text: suggestion.trim(),
            type: 'general' as const
          }))
          .filter((s: { text: string }) => s.text.length > 0)

        setSuggestions(aiSuggestions)
      } else {
        // Fallback to common searches
        const filtered = commonSearches.filter(item => 
          item.text.toLowerCase().includes(value.toLowerCase())
        )
        setSuggestions(filtered)
      }
    } catch (error) {
      console.error('Search suggestions error:', error)
      // Fallback to common searches
      const filtered = commonSearches.filter(item => 
        item.text.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
    } finally {
      setIsLoading(false)
      setShowSuggestions(true)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)
    performSearch(suggestion.text)
  }

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Add to search history
    setSearchHistory(prev => {
      const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)]
      return newHistory.slice(0, 5) // Keep only last 5 searches
    })

    setIsLoading(true)
    try {
      // Simulate search results (in real app, this would call your search API)
      const mockResults = [
        {
          id: '1',
          title: `Results for "${searchQuery}"`,
          type: 'experience',
          location: 'Tanzania',
          price: '$1200',
          rating: 4.8
        },
        {
          id: '2',
          title: `Alternative experiences for "${searchQuery}"`,
          type: 'experience',
          location: 'Kenya',
          price: '$950',
          rating: 4.6
        }
      ]

      onSearch(searchQuery, mockResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query.trim())
    }
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        performSearch(transcript)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
      }

      recognition.start()
    } else {
      alert('Voice search not supported in this browser')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          
          <Button
            type="button"
            onClick={handleVoiceSearch}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-600 rounded-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-r-md rounded-l-none"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </Button>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border-gray-700 max-h-80 overflow-y-auto"
        >
          {/* Search History */}
          {searchHistory.length > 0 && query.length < 2 && (
            <div className="p-3 border-b border-gray-700">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Searches</h4>
              <div className="space-y-1">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(item)
                      performSearch(item)
                    }}
                    className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded"
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                {isLoading ? 'Getting suggestions...' : 'AI Suggestions'}
              </h4>
              <div className="space-y-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded flex items-center"
                  >
                    <span className="mr-2">
                      {suggestion.type === 'destination' && '🌍'}
                      {suggestion.type === 'activity' && '🎯'}
                      {suggestion.type === 'business' && '🏢'}
                      {suggestion.type === 'general' && '💡'}
                    </span>
                    {suggestion.text}
                    {suggestion.category && (
                      <span className="ml-auto text-xs text-gray-500">{suggestion.category}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Common Searches */}
          {query.length < 2 && (
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Popular Searches</h4>
              <div className="space-y-1">
                {commonSearches.slice(0, 3).map((search) => (
                  <button
                    key={search.id}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded"
                  >
                    {search.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

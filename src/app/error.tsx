'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="bg-gray-800 border-gray-700 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠️</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-3 bg-gray-900 rounded text-xs text-red-400 font-mono text-left">
            {error.message}
          </div>
        )}
        
        <div className="space-y-3">
          <Button 
            onClick={reset}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button 
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}


'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'
import { captureException } from '@/lib/sentry'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error, {
      component: 'ErrorBoundary',
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="bg-gray-800 border-red-500/30 p-8 max-w-md w-full">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
          <p className="text-gray-400 mb-6">
            We've been notified and are looking into it. Please try again.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-400 text-sm font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Try Again
            </Button>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

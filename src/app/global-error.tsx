'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
          <Card className="bg-gray-800 border-gray-700 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Critical Error</h2>
            <p className="text-gray-300 mb-6">
              A critical error occurred. Please reload the page.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Reload Page
              </Button>
            </div>
          </Card>
        </div>
      </body>
    </html>
  )
}


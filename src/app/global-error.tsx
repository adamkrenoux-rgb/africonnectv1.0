'use client'

import { useEffect } from 'react'
import { captureException } from '@/lib/sentry'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to Sentry (async, won't block render)
    captureException(error, {
      component: 'GlobalErrorBoundary',
      digest: error.digest,
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #000, #1f2937)',
          color: 'white',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            background: '#1f2937',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
              Application Error
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
              A critical error occurred. We've been notified and are working on a fix.
            </p>
            <button
              onClick={reset}
              style={{
                background: '#f59e0b',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontWeight: 'semibold',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

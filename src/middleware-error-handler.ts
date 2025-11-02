/**
 * Error handler for Next.js middleware
 * This catches errors in the middleware layer
 */
import { NextResponse } from 'next/server'
import { captureException } from '@/lib/sentry'

export function handleMiddlewareError(error: Error, request: Request) {
  captureException(error, {
    component: 'Middleware',
    url: request.url,
    method: request.method,
  })

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}


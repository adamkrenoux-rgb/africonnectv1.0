/**
 * Centralized API error handling with Sentry integration
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { captureException } from './sentry'

interface ApiError extends Error {
  code?: string
  statusCode?: number
  meta?: Record<string, any>
}

export function handleApiError(error: unknown, context?: Record<string, any>): NextResponse {
  const apiError = error as ApiError
  
  // Log to Sentry
  if (error instanceof Error) {
    captureException(error, {
      component: 'API Route',
      ...context,
      errorCode: apiError.code,
      statusCode: apiError.statusCode,
    })
  } else {
    captureException(new Error(String(error)), {
      component: 'API Route',
      ...context,
      errorCode: apiError.code,
    })
  }

  // Handle Prisma errors
  if (apiError.code === 'P2002') {
    return NextResponse.json(
      { success: false, error: 'Duplicate entry' },
      { status: 409 }
    )
  }

  if (apiError.code === 'P2003') {
    return NextResponse.json(
      { success: false, error: 'Invalid reference' },
      { status: 400 }
    )
  }

  if (apiError.code === 'P2025') {
    return NextResponse.json(
      { success: false, error: 'Record not found' },
      { status: 404 }
    )
  }

  // Handle custom status codes
  if (apiError.statusCode) {
    return NextResponse.json(
      { success: false, error: apiError.message || 'An error occurred' },
      { status: apiError.statusCode }
    )
  }

  // Default 500 error
  console.error('API Error:', error)
  return NextResponse.json(
    { 
      success: false, 
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : apiError.message || 'An unexpected error occurred'
    },
    { status: 500 }
  )
}

export function apiErrorHandler(
  handler: (request: Request | NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: Request | NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleApiError(error, {
        url: request.url,
        method: request.method,
      })
    }
  }
}


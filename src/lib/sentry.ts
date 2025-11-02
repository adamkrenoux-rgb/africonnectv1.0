/**
 * Sentry Error Monitoring Setup
 * Falls back gracefully if SENTRY_DSN is not configured or package is not installed
 */

let Sentry: any = null
let isInitialized = false

// Initialize Sentry only if DSN is provided and package is installed
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  try {
    // Dynamic import to handle optional dependency
    Sentry = require('@sentry/nextjs')
    if (Sentry && Sentry.init) {
      isInitialized = true
    }
  } catch (error) {
    // Sentry is optional - gracefully fail
    console.warn('Sentry not available. Install with: npm install @sentry/nextjs')
    Sentry = null
    isInitialized = false
  }
}

export const initSentry = () => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log('Sentry not configured (NEXT_PUBLIC_SENTRY_DSN not set)')
    return false
  }

  if (!isInitialized && typeof window !== 'undefined') {
    try {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Only send errors in production
        beforeSend(event: any, hint: any) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Sentry Event (dev mode):', event, hint)
            return null // Don't send in dev
          }
          return event
        },
      })
      isInitialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize Sentry:', error)
      return false
    }
  }

  return isInitialized
}

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (!isInitialized || !Sentry) {
    console.error('Error (Sentry not configured):', error, context)
    return
  }

  try {
    Sentry.captureException(error, {
      extra: context,
    })
  } catch (err) {
    console.error('Failed to capture exception:', err)
  }
}

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) => {
  if (!isInitialized || !Sentry) {
    console.log(`[${level.toUpperCase()}] ${message}`, context)
    return
  }

  try {
    Sentry.captureMessage(message, {
      level: level as any,
      extra: context,
    })
  } catch (err) {
    console.error('Failed to capture message:', err)
  }
}

export const setUser = (user: { id: string; email?: string; username?: string }) => {
  if (!isInitialized || !Sentry) return

  try {
    Sentry.setUser(user)
  } catch (err) {
    console.error('Failed to set Sentry user:', err)
  }
}

export const addBreadcrumb = (breadcrumb: { message: string; category?: string; level?: 'info' | 'warning' | 'error'; data?: Record<string, any> }) => {
  if (!isInitialized || !Sentry) {
    console.log('Breadcrumb:', breadcrumb)
    return
  }

  try {
    Sentry.addBreadcrumb(breadcrumb)
  } catch (err) {
    console.error('Failed to add breadcrumb:', err)
  }
}


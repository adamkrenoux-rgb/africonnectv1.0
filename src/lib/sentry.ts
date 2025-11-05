/**
 * Sentry Error Monitoring Setup
 * Falls back gracefully if SENTRY_DSN is not configured or package is not installed
 * All functions are no-ops if Sentry is not available
 */

// Check if Sentry is available at runtime (not build time)
function getSentry() {
  if (typeof window === 'undefined') {
    // Server-side: try to require
    try {
      // eslint-disable-next-line
      const sentry = eval('require("@sentry/nextjs")')
      return sentry
    } catch {
      return null
    }
  } else {
    // Client-side: Sentry would need to be loaded via script tag or dynamic import
    // For now, return null if not available
    return (window as any).Sentry || null
  }
}

export const initSentry = () => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return false
  }
  
  const Sentry = getSentry()
  if (!Sentry) {
    return false
  }

  try {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event: any, hint: any) {
        if (process.env.NODE_ENV !== 'production') {
          return null
        }
        return event
      },
    })
    return true
  } catch (error) {
    console.error('Failed to initialize Sentry:', error)
    return false
  }
}

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('Error (Sentry not configured):', error, context)
    return
  }

  const Sentry = getSentry()
  if (!Sentry) {
    console.error('Error (Sentry not available):', error, context)
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
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log(`[${level.toUpperCase()}] ${message}`, context)
    return
  }

  const Sentry = getSentry()
  if (!Sentry) {
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
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  const Sentry = getSentry()
  if (!Sentry) return

  try {
    Sentry.setUser(user)
  } catch (err) {
    console.error('Failed to set Sentry user:', err)
  }
}

export const addBreadcrumb = (breadcrumb: { message: string; category?: string; level?: 'info' | 'warning' | 'error'; data?: Record<string, any> }) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log('Breadcrumb:', breadcrumb)
    return
  }

  const Sentry = getSentry()
  if (!Sentry) {
    console.log('Breadcrumb:', breadcrumb)
    return
  }

  try {
    Sentry.addBreadcrumb(breadcrumb)
  } catch (err) {
    console.error('Failed to add breadcrumb:', err)
  }
}

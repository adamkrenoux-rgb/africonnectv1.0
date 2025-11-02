/**
 * Analytics tracking utilities
 * Supports Vercel Analytics and Google Analytics (optional)
 */

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void
  }
}

/**
 * Track page views
 */
export function trackPageView(url: string) {
  // Vercel Analytics automatically tracks page views
  // Google Analytics (if configured)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    })
  }
}

/**
 * Track custom events
 */
export function trackEvent(
  action: string,
  category: string = 'general',
  label?: string,
  value?: number
) {
  // Vercel Analytics
  if (typeof window !== 'undefined') {
    // Track via Vercel Analytics custom events
    // Note: Vercel Analytics doesn't support custom events in the free tier
    // This is a placeholder for when you upgrade or use GA
    
    // Google Analytics (if configured)
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { action, category, label, value })
    }
  }
}

/**
 * Track booking events
 */
export function trackBooking(action: 'started' | 'completed' | 'cancelled', listingId?: string, amount?: number) {
  trackEvent(`booking_${action}`, 'booking', listingId, amount)
}

/**
 * Track campaign events
 */
export function trackCampaign(action: 'created' | 'applied' | 'accepted', campaignId?: string) {
  trackEvent(`campaign_${action}`, 'campaign', campaignId)
}

/**
 * Track user actions
 */
export function trackUserAction(action: 'signup' | 'login' | 'profile_update', userId?: string) {
  trackEvent(`user_${action}`, 'user', userId)
}

/**
 * Track search events
 */
export function trackSearch(query: string, filters?: Record<string, any>, resultCount?: number) {
  trackEvent('search', 'search', query, resultCount)
  if (process.env.NODE_ENV === 'development') {
    console.log('Search tracked:', { query, filters, resultCount })
  }
}

/**
 * Track conversion events
 */
export function trackConversion(type: 'booking' | 'campaign_application' | 'verification', value?: number) {
  trackEvent('conversion', 'business', type, value)
}


'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, trackEvent } from '@/lib/analytics'

/**
 * Hook to automatically track page views
 */
export function useAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname])

  return {
    trackEvent,
    trackPageView: () => pathname && trackPageView(pathname),
  }
}


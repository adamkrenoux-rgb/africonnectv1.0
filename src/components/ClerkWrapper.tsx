'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ClerkWrapperProps {
  children: ReactNode
}

/**
 * Wrapper that safely initializes ClerkProvider
 * Falls back gracefully if Clerk keys are not configured
 */
export function ClerkWrapper({ children }: ClerkWrapperProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // If Clerk is not configured, just render children
  if (!publishableKey || publishableKey === '' || publishableKey === 'your_clerk_publishable_key') {
    console.warn('Clerk not configured - app will run without authentication')
    return <>{children}</>
  }

  // Wrap with ClerkProvider if keys are present
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
    >
      {children}
    </ClerkProvider>
  )
}


'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { SignIn } from '@clerk/nextjs'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const clerkConfigured =
  publishableKey && publishableKey !== '' && publishableKey !== 'your_clerk_publishable_key'

function SignInContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard'

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('[SignIn] User already signed in, redirecting to dashboard')
      router.push(redirectUrl)
    }
  }, [isLoaded, isSignedIn, router, redirectUrl])

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If signed in, show redirect message
  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <p className="text-gray-300 mb-4">You're already signed in!</p>
          <Link href={redirectUrl} className="text-yellow-400 hover:text-yellow-300 underline">
            Continue to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">🌍 Connexus</h1>
          <p className="text-gray-300">Sign in to your account</p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
          appearance={{
            elements: {
              formButtonPrimary: 'bg-yellow-500 hover:bg-yellow-600 text-black',
              card: 'shadow-lg bg-gray-800 border-gray-700',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-300',
              socialButtonsBlockButton: 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600',
              formFieldInput: 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500',
              formFieldLabel: 'text-gray-200',
              formFieldInputShowPasswordButton: 'text-gray-400 hover:text-gray-300',
              identityPreviewText: 'text-gray-200',
              identityPreviewEditButton: 'text-yellow-400 hover:text-yellow-300',
              footerActionLink: 'text-yellow-400 hover:text-yellow-300',
              formResendCodeLink: 'text-yellow-400 hover:text-yellow-300',
              otpCodeFieldInput: 'bg-gray-700 border-gray-600 text-white',
              dividerLine: 'bg-gray-600',
              dividerText: 'text-gray-400',
              formFieldErrorText: 'text-red-400',
              alertText: 'text-yellow-300'
            }
          }}
        />
      </div>
    </div>
  )
}

export default function Page() {
  if (!clerkConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
        <div className="max-w-md w-full space-y-6 p-8 rounded-2xl border border-yellow-500/40 bg-gray-900/90 shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">🌍 Connexus</h1>
          <p className="text-gray-200">
            Authentication is currently disabled. Set your Clerk API keys to enable sign-in.
          </p>
          <div className="text-sm text-gray-400 space-y-2">
            <p>
              Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code> to your
              environment, then restart the app.
            </p>
            <p>
              Need help? See{' '}
              <Link href="/CLERK_SETUP" className="text-yellow-400 underline">
                the Clerk setup guide
              </Link>
              .
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex justify-center rounded-md bg-yellow-500 px-4 py-2 font-medium text-black hover:bg-yellow-600 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}

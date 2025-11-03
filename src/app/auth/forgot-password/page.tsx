'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would integrate with your authentication system
      console.log('Password reset request for:', email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
    } catch (err) {
      console.error('Error sending reset email:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                  AFRICONNECT
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link href="/sign-in">
                  <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-gray-800 border-yellow-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Check Your Email</h1>
            <p className="text-gray-300 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              >
                Try Again
              </Button>
              <Link href="/sign-in" className="flex-1">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                AFRICONNECT
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/sign-in">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Forgot Password?</h1>
          <p className="text-xl text-gray-300">No worries, we'll send you reset instructions</p>
        </div>

        <Card className="bg-gray-800 border-yellow-500/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 text-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Remember your password?{' '}
              <Link href="/sign-in" className="text-yellow-400 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 className="text-2xl font-bold">AFRICONNECT</h3>
          </div>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Connecting the world to authentic African experiences through AI-powered technology.
          </p>
          <p className="text-gray-400 text-sm">
            © 2024 AFRICONNECT. Connecting hearts to Africa's vibrant culture and natural beauty.
          </p>
        </div>
      </footer>
    </div>
  )
}

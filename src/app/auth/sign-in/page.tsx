'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Here you would integrate with your authentication system
      console.log('Sign in data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, redirect based on email domain
      if (formData.email.includes('business')) {
        window.location.href = '/businesses/dashboard'
      } else if (formData.email.includes('influencer')) {
        window.location.href = '/influencers/dashboard'
      } else {
        window.location.href = '/travelers/dashboard'
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
              <Link href="/sign-up">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
          <p className="text-xl text-gray-300">Sign in to your AFRICONNECT account</p>
        </div>

        <Card className="bg-gray-800 border-yellow-500/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white font-semibold mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                />
                <label htmlFor="rememberMe" className="text-gray-300 text-sm">
                  Remember me
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-yellow-400 hover:underline text-sm">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 text-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-yellow-400 hover:underline font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-gray-800 border-yellow-500/30 p-6 mt-6">
          <h3 className="text-white font-semibold mb-4 text-center">Demo Accounts</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Traveler Account</span>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                onClick={() => {
                  setFormData({ email: 'traveler@demo.com', password: 'demo123', rememberMe: false })
                }}
              >
                Use Demo
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Business Account</span>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                onClick={() => {
                  setFormData({ email: 'business@demo.com', password: 'demo123', rememberMe: false })
                }}
              >
                Use Demo
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Influencer Account</span>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                onClick={() => {
                  setFormData({ email: 'influencer@demo.com', password: 'demo123', rememberMe: false })
                }}
              >
                Use Demo
              </Button>
            </div>
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

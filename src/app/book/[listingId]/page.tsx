'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StripeCheckout } from '@/components/StripeCheckout'
import { useCurrentUser } from '@/components/UserProvider'
import { Calendar, Users, MapPin, Star, CheckCircle2, Lock, Shield } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  pricing: number
  duration: string
  activityType: string
  verified: boolean
  business: {
    id: string
    businessName: string
    city: string
    country: string
    verificationBadge: boolean
    reviews: Array<{ rating: number }>
  }
  businessRating: number
}

export default function BookListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params.listingId as string
  const { dbUser, isLoaded } = useCurrentUser()

  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  
  // Booking form state
  const [bookingDate, setBookingDate] = useState('')
  const [travelerCount, setTravelerCount] = useState(1)
  const [specialRequests, setSpecialRequests] = useState('')
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'success'>('details')
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    if (listingId) {
      fetchListing()
    }
  }, [listingId])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}`)
      const data = await response.json()

      if (data.success) {
        setListing(data.listing)
      } else {
        setError(data.error || 'Failed to load listing')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load listing')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBooking = async () => {
    if (!dbUser || !listing) return

    if (!bookingDate) {
      setError('Please select a booking date')
      return
    }

    try {
      const totalAmount = listing.pricing * travelerCount

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          travelerId: dbUser.id,
          bookingDate: new Date(bookingDate).toISOString(),
          totalAmount
        }),
      })

      const data = await response.json()

      if (data.success) {
        setBookingId(data.booking.id)
        setBookingStep('payment')
      } else {
        setError(data.error || 'Failed to create booking')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!bookingId) return

    try {
      // Update booking with payment intent ID
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripePaymentIntentId: paymentIntentId,
          paymentStatus: 'HELD_IN_ESCROW'
        }),
      })

      // Redirect to success page
      router.push(`/booking/success?bookingId=${bookingId}&paymentIntent=${paymentIntentId}`)
    } catch (err) {
      console.error('Failed to update booking:', err)
      // Still redirect to success - payment was successful
      router.push(`/booking/success?bookingId=${bookingId}&paymentIntent=${paymentIntentId}`)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!dbUser) {
    router.push('/sign-in?redirect=' + encodeURIComponent(`/book/${listingId}`))
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading listing...</div>
      </div>
    )
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <Link href="/travelers/dashboard/browse-experiences">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
              Back to Browse
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (!listing) return null

  const totalAmount = listing.pricing * travelerCount
  const minDate = new Date().toISOString().split('T')[0]

  if (bookingStep === 'payment' && bookingId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">{listing.title}</h3>
                  <p className="text-gray-400 text-sm">{listing.business.businessName}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.business.city}, {listing.business.country}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(bookingDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>{travelerCount} {travelerCount === 1 ? 'Traveler' : 'Travelers'}</span>
                </div>

                {listing.businessRating > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white">{listing.businessRating.toFixed(1)}</span>
                    <span className="text-gray-400">rating</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Price per person</span>
                  <span className="text-white">${listing.pricing}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Travelers</span>
                  <span className="text-white">{travelerCount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                  <span className="text-white">Total</span>
                  <span className="text-yellow-400">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-semibold text-white mb-1">Escrow Protection</p>
                    <p>Your payment is held securely until your experience is completed.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Form */}
            <StripeCheckout
              amount={totalAmount}
              bookingId={bookingId}
              onSuccess={handlePaymentSuccess}
              onError={(err) => setError(err)}
              metadata={{
                listingId: listing.id,
                listingTitle: listing.title,
                businessName: listing.business.businessName
              }}
            />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/experiences/${listingId}`} className="text-yellow-400 hover:text-yellow-300 text-sm mb-4 inline-block">
            ← Back to Experience
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Complete Your Booking</h1>
          <p className="text-gray-400">Book your authentic African experience with confidence</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>

            <div className="space-y-6">
              {/* Experience Info */}
              <div className="pb-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">{listing.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{listing.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.business.city}, {listing.business.country}</span>
                  </div>
                  {listing.business.verificationBadge && (
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Select Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Number of Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={4}
                  placeholder="Any dietary requirements, accessibility needs, or special requests..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleCreateBooking}
                disabled={!bookingDate}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-lg py-6 disabled:opacity-50"
              >
                Continue to Payment
              </Button>
            </div>
          </Card>

          {/* Price Summary */}
          <Card className="bg-gray-800 border-gray-700 p-6 h-fit">
            <h2 className="text-2xl font-bold text-white mb-6">Price Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Price per person</span>
                <span className="text-white font-semibold">${listing.pricing}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Travelers</span>
                <span className="text-white font-semibold">{travelerCount}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-700">
                <span className="text-white">Total</span>
                <span className="text-yellow-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>Secure payment with Stripe</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>Payment held in escrow until completion</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>Free cancellation up to 48 hours before</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


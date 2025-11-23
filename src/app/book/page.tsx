'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIItinerary } from '@/types'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BookPage() {
  const [itinerary, setItinerary] = useState<AIItinerary | null>(null)
  const [travelerDetails, setTravelerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get itinerary from session storage
    const savedItinerary = sessionStorage.getItem('selectedItinerary')
    if (savedItinerary) {
      setItinerary(JSON.parse(savedItinerary))
    } else {
      router.push('/plan-trip')
    }
  }, [router])

  const handleBooking = async () => {
    if (!itinerary) return

    setIsLoading(true)
    try {
      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: 'temp-listing-id', // This would be a real listing ID
          bookingDate: new Date().toISOString(),
          totalAmount: itinerary.totalCost,
          travelerDetails
        }),
      })

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking')
      }

      const bookingData = await bookingResponse.json()
      setBookingId(bookingData.data.id)

      // Create payment intent
      const paymentResponse = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingData.data.id,
          amount: itinerary.totalCost,
          currency: itinerary.currency.toLowerCase()
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent')
      }

      const paymentData = await paymentResponse.json()

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.confirmPayment({
          clientSecret: paymentData.data.clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/booking/success?bookingId=${bookingData.data.id}`,
          },
        })

        if (error) {
          console.error('Payment failed:', error)
        }
      }
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-africa-earth mx-auto mb-4"></div>
          <p>Loading itinerary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-africa-earth/10 via-africa-green/10 to-africa-blue/10">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-africa-earth mb-4">🧭 Complete Your Booking</h1>
          <p className="text-xl text-gray-600">
            Review your itinerary and provide your details to secure your African adventure
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Itinerary Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{itinerary.title}</h3>
                  <p className="text-gray-600">{itinerary.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">{itinerary.duration}</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Cost</p>
                    <p className="text-gray-600">${itinerary.totalCost} {itinerary.currency}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Highlights</h4>
                  <ul className="text-sm space-y-1">
                    {itinerary.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-africa-earth mr-2">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Accommodation</h4>
                  <div className="text-sm">
                    <p className="font-medium">{itinerary.accommodation.name}</p>
                    <p className="text-gray-600">{itinerary.accommodation.type}</p>
                    <p className="text-gray-600">${itinerary.accommodation.price} per night</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Activities</h4>
                  <div className="space-y-2">
                    {itinerary.activities.map((activity, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-gray-600">{activity.description}</p>
                        <p className="text-gray-600">${activity.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Traveler Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={travelerDetails.name}
                  onChange={(e) => setTravelerDetails({
                    ...travelerDetails,
                    name: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={travelerDetails.email}
                  onChange={(e) => setTravelerDetails({
                    ...travelerDetails,
                    email: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="input-field"
                  value={travelerDetails.phone}
                  onChange={(e) => setTravelerDetails({
                    ...travelerDetails,
                    phone: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  className="input-field h-20"
                  placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                  value={travelerDetails.specialRequests}
                  onChange={(e) => setTravelerDetails({
                    ...travelerDetails,
                    specialRequests: e.target.value
                  })}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💰 Payment Protection</h4>
                <p className="text-blue-700 text-sm">
                  Your payment is held securely in escrow until your trip is completed. 
                  Connexus takes a 15% commission to support the platform.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Verified Partners</h4>
                <p className="text-green-700 text-sm">
                  All businesses on Connexus are verified for authenticity and safety.
                </p>
              </div>

              <Button
                onClick={handleBooking}
                className="w-full bg-africa-earth hover:bg-africa-earth/90"
                disabled={!travelerDetails.name || !travelerDetails.email || !travelerDetails.phone || isLoading}
              >
                {isLoading ? 'Processing...' : `Pay $${itinerary.totalCost} ${itinerary.currency}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

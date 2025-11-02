'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Calendar, Users, MapPin } from 'lucide-react'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const paymentIntent = searchParams.get('paymentIntent')
  
  const [booking, setBooking] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetchBooking()
    } else {
      setIsLoading(false)
    }
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`)
      const data = await response.json()

      if (data.success) {
        setBooking(data.booking)
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                AFRICONNECT
              </Link>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-8">
            <span className="text-4xl text-white">✓</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Booking Confirmed!
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your African adventure has been successfully booked. You will receive a confirmation email with all the details shortly.
          </p>
          
          {booking ? (
            <Card className="bg-gray-800 border-yellow-500/30 p-8 max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6 text-left mb-6">
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Trip Information
                  </h3>
                  <p className="text-gray-300 mb-2">
                    <span className="font-semibold">{booking.listing?.title || 'Experience'}</span>
                  </p>
                  <p className="text-gray-300 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {booking.business?.city && booking.business?.country 
                      ? `${booking.business.city}, ${booking.business.country}`
                      : booking.listing?.business?.city && booking.listing?.business?.country
                      ? `${booking.listing.business.city}, ${booking.listing.business.country}`
                      : 'Location TBD'}
                  </p>
                  <p className="text-gray-300 mb-1">
                    Date: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 mb-1">
                    Duration: {booking.listing?.duration || 'TBD'}
                  </p>
                  <p className="text-gray-300 mb-1">
                    Business: {booking.business?.businessName || booking.listing?.business?.businessName || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-2">Payment Details</h3>
                  <p className="text-gray-300 mb-1">
                    Total Amount: <span className="text-yellow-400 font-bold">${booking.totalAmount?.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-300 mb-1">
                    Payment Method: {paymentIntent ? 'Credit Card (Stripe)' : 'Credit Card'}
                  </p>
                  <p className="text-gray-300 mb-1">
                    Booking ID: {booking.id}
                  </p>
                  <p className="text-gray-300 mb-1">
                    Status: <span className={`font-semibold ${
                      booking.status === 'CONFIRMED' || booking.status === 'PENDING' 
                        ? 'text-yellow-400' 
                        : booking.status === 'COMPLETED' 
                        ? 'text-green-400' 
                        : 'text-gray-400'
                    }`}>
                      {booking.status}
                    </span>
                  </p>
                  <p className="text-gray-300 mb-1">
                    Payment Status: <span className={`font-semibold ${
                      booking.paymentStatus === 'HELD_IN_ESCROW' 
                        ? 'text-yellow-400' 
                        : booking.paymentStatus === 'COMPLETED' 
                        ? 'text-green-400' 
                        : 'text-gray-400'
                    }`}>
                      {booking.paymentStatus || 'PENDING'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h3 className="text-yellow-400 font-semibold mb-2">What's Next?</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• You will receive a detailed itinerary within 24 hours</li>
                  <li>• Our local partner will contact you directly</li>
                  <li>• Prepare for your amazing African adventure!</li>
                </ul>
              </div>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-yellow-500/30 p-8 max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Booking Confirmed!</h2>
              <p className="text-gray-300">
                Your booking has been successfully processed. Check your email for confirmation details.
              </p>
              {bookingId && (
                <p className="text-gray-400 text-sm mt-2">Booking ID: {bookingId}</p>
              )}
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h3 className="text-yellow-400 font-semibold mb-2">What's Next?</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• You will receive a detailed itinerary within 24 hours</li>
                  <li>• Our local partner will contact you directly</li>
                  <li>• Prepare for your amazing African adventure!</li>
                </ul>
              </div>
            </Card>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold shadow-lg">
                View Dashboard
              </Button>
            </Link>
            <Link href="/plan-trip">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg font-semibold">
                Plan Another Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
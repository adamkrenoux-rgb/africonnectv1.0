'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BookingPage() {
  const [bookingData, setBookingData] = useState({
    experience: 'Maasai Mara Safari Adventure',
    business: 'Serengeti Safari Tours',
    travelers: 2,
    dates: 'March 15-17, 2024',
    totalAmount: 900,
    travelerName: '',
    travelerEmail: '',
    specialRequests: ''
  })

  const [step, setStep] = useState(1)

  const handleInputChange = (field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBookingSubmit = () => {
    // Show immediate impact
    alert('🎉 Booking confirmed! Payment is held in escrow for your protection. The business has been notified and will contact you within 24 hours with trip details. You\'ll receive booking confirmation via email.')
    
    // In real app, this would:
    // 1. Create booking in database
    // 2. Process payment through Stripe (held in escrow)
    // 3. Send notification to business owner
    // 4. Send confirmation email to traveler
    // 5. Update business dashboard with new booking
    // 6. Update traveler dashboard with booking
    // 7. Send welcome email with next steps
    // 8. Redirect to booking confirmation page
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
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Profile</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Complete Your Booking</h1>
          <p className="text-xl text-gray-300">Secure booking with escrow protection</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-yellow-500/30 p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{bookingData.experience}</h4>
                  <p className="text-gray-300 text-sm">by {bookingData.business}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Travelers</span>
                    <span className="text-white">{bookingData.travelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dates</span>
                    <span className="text-white">{bookingData.dates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Price per person</span>
                    <span className="text-white">${bookingData.totalAmount / bookingData.travelers}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-yellow-400">${bookingData.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">🛡️ Escrow Protection</h4>
                  <p className="text-gray-300 text-sm">
                    Your payment is held securely until after your trip. Full refund if expectations aren't met.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-yellow-500/30 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Traveler Information</h3>
              
              <form onSubmit={(e) => { e.preventDefault(); handleBookingSubmit(); }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={bookingData.travelerName}
                      onChange={(e) => handleInputChange('travelerName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={bookingData.travelerEmail}
                      onChange={(e) => handleInputChange('travelerEmail', e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Special Requests</label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">✅ What Happens Next?</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Payment is held securely in escrow</li>
                    <li>• Business owner receives notification</li>
                    <li>• You'll receive trip details within 24 hours</li>
                    <li>• Payment released after successful trip</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/experiences/1">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Back to Experience
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Complete Booking
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
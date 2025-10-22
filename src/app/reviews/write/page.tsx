'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Booking {
  id: string
  listing: {
    title: string
    description: string
  }
  business: {
    businessName: string
    user: {
      name: string
      profileImage?: string
    }
  }
  bookingDate: string
  totalAmount: number
  status: string
}

export default function WriteReviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [review, setReview] = useState({
    rating: 0,
    comment: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch completed bookings that don't have reviews
    fetch('/api/bookings?status=COMPLETED')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter out bookings that already have reviews
          const bookingsWithoutReviews = data.data.filter((booking: any) => !booking.review)
          setBookings(bookingsWithoutReviews)
        }
      })
      .catch(error => {
        console.error('Error fetching bookings:', error)
      })
  }, [])

  const handleSubmitReview = async () => {
    if (!selectedBooking) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          rating: review.rating,
          comment: review.comment
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-africa-earth/10 via-africa-green/10 to-africa-blue/10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">No Reviews to Write</h3>
              <p className="text-gray-600 mb-4">
                You don't have any completed trips that need reviews yet.
              </p>
              <Button asChild className="bg-africa-earth hover:bg-africa-earth/90">
                <a href="/dashboard">Back to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-africa-earth/10 via-africa-green/10 to-africa-blue/10">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-africa-earth mb-4">⭐ Write a Review</h1>
          <p className="text-xl text-gray-600">
            Share your experience to help other travelers
          </p>
        </div>

        {!selectedBooking ? (
          /* Booking Selection */
          <Card>
            <CardHeader>
              <CardTitle>Select a Trip to Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{booking.listing.title}</h3>
                        <p className="text-gray-600 text-sm">{booking.listing.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Business: {booking.business.businessName}</p>
                          <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                          <p>Amount: ${booking.totalAmount}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Review This Trip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Review Form */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBooking.listing.title}</h3>
                    <p className="text-gray-600">{selectedBooking.listing.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Business</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {selectedBooking.business.user.profileImage ? (
                          <img 
                            src={selectedBooking.business.user.profileImage} 
                            alt={selectedBooking.business.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600">🏢</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{selectedBooking.business.businessName}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.business.user.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Amount</p>
                      <p className="text-gray-600">${selectedBooking.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReview({ ...review, rating: star })}
                        className={`text-2xl ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {review.rating === 0 && 'Select a rating'}
                    {review.rating === 1 && 'Poor'}
                    {review.rating === 2 && 'Fair'}
                    {review.rating === 3 && 'Good'}
                    {review.rating === 4 && 'Very Good'}
                    {review.rating === 5 && 'Excellent'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    placeholder="Share your experience with this business..."
                    className="input-field h-32"
                    value={review.comment}
                    onChange={(e) => setReview({
                      ...review,
                      comment: e.target.value
                    })}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Review Guidelines</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Be honest and constructive</li>
                    <li>• Focus on your experience</li>
                    <li>• Help other travelers make informed decisions</li>
                    <li>• Reviews are public and help build trust</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedBooking(null)}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    className="bg-africa-earth hover:bg-africa-earth/90"
                    disabled={review.rating === 0 || isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


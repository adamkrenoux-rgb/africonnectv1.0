'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, User } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  traveler: {
    id: string
    name: string | null
    profilePicture: string | null
    country: string | null
  }
  booking?: {
    listing?: {
      title: string
    }
  }
}

interface ReviewsListProps {
  businessId?: string
  listingId?: string
  limit?: number
  showHeader?: boolean
  className?: string
}

export function ReviewsList({
  businessId,
  listingId,
  limit = 10,
  showHeader = true,
  className = ''
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchReviews()
  }, [businessId, listingId])

  const fetchReviews = async () => {
    if (!businessId && !listingId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      let apiUrl = '/api/reviews?'
      
      if (businessId) {
        apiUrl += `businessId=${businessId}&`
      }
      
      if (limit) {
        apiUrl += `limit=${limit}`
      }

      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.success) {
        // If listingId is provided, filter reviews for that listing
        let filteredReviews = data.reviews || []
        
        if (listingId) {
          filteredReviews = filteredReviews.filter((review: Review) => 
            review.booking?.listing?.title // This will need to match the actual structure
          )
        }

        setReviews(filteredReviews)
      } else {
        setError(data.error || 'Failed to load reviews')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className={className}>
        {showHeader && (
          <h3 className="text-2xl font-bold text-white mb-6">Reviews</h3>
        )}
        <div className="text-center py-8">
          <p className="text-gray-400">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        {showHeader && (
          <h3 className="text-2xl font-bold text-white mb-6">Reviews</h3>
        )}
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className={className}>
        {showHeader && (
          <h3 className="text-2xl font-bold text-white mb-6">Reviews</h3>
        )}
        <Card className="bg-gray-800 border-gray-700 p-8 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h4 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h4>
          <p className="text-gray-400">
            Be the first to review this business!
          </p>
        </Card>
      </div>
    )
  }

  // Calculate average rating
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Reviews</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-semibold text-white ml-1">
                  {avgRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {review.traveler.profilePicture ? (
                  <Image
                    src={review.traveler.profilePicture}
                    alt={review.traveler.name || 'Traveler'}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">
                      {review.traveler.name || 'Anonymous Traveler'}
                    </h4>
                    {review.traveler.country && (
                      <p className="text-sm text-gray-400">
                        from {review.traveler.country}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(review.createdAt)}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-3">
                  {renderStars(review.rating)}
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {/* Listing Info */}
                {review.booking?.listing?.title && (
                  <p className="text-sm text-gray-500 mt-2">
                    Experience: {review.booking.listing.title}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

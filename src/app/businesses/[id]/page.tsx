'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Share2, 
  Heart,
  Calendar,
  Users,
  MessageSquare,
  ExternalLink
} from 'lucide-react'
import BusinessMap from '@/components/BusinessMap'
import InquiryForm from '@/components/InquiryForm'
import ImageGallery from '@/components/ImageGallery'
import SocialLinks from '@/components/SocialLinks'

interface Business {
  id: string
  businessName: string
  description: string
  location: string
  city: string
  country: string
  coordinates?: [number, number]
  businessType: string
  verificationBadge: boolean
  trustScore: number
  website?: string
  phone?: string
  email?: string
  user: {
    id: string
    name: string
    profilePicture?: string
    socialLinks?: any
  }
  listings: Array<{
    id: string
    title: string
    description: string
    pricing: any
    activityType: string
    images?: string[]
  }>
  reviews: Array<{
    id: string
    rating: number
    comment?: string
    traveler: {
      name: string
      profilePicture?: string
    }
    createdAt: string
  }>
  averageRating?: number
  reviewCount?: number
  images?: string[] // Business gallery images
}

interface RelatedBusiness {
  id: string
  businessName: string
  city: string
  country: string
  businessType: string
  verificationBadge: boolean
  averageRating?: number
}

function BusinessDetailContent() {
  const params = useParams()
  const router = useRouter()
  const businessId = params.id as string
  
  const [business, setBusiness] = useState<Business | null>(null)
  const [relatedBusinesses, setRelatedBusinesses] = useState<RelatedBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'reviews'>('overview')
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (businessId) {
      fetchBusiness()
      fetchRelatedBusinesses()
      // Track page view
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'page_view',
          entityType: 'business',
          entityId: businessId
        })
      }).catch(() => {}) // Silently fail if tracking fails
    }
  }, [businessId])

  const fetchBusiness = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/businesses/${businessId}`)
      const data = await response.json()

      if (data.success) {
        setBusiness(data.business)
      } else {
        setError(data.error || 'Business not found')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load business')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedBusinesses = async () => {
    try {
      const response = await fetch(`/api/businesses?country=${business?.country || ''}&limit=4`)
      const data = await response.json()
      
      if (data.success) {
        // Filter out current business
        const related = data.businesses
          .filter((b: any) => b.id !== businessId)
          .slice(0, 3)
        setRelatedBusinesses(related)
      }
    } catch (err) {
      console.error('Failed to fetch related businesses:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business?.businessName,
          text: business?.description,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading business details...</div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="bg-gray-800 border-red-500/30 p-8 max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error || 'Business not found'}</p>
          <Link href="/businesses/directory">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Back to Directory
            </Button>
          </Link>
        </Card>
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
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-yellow-600 font-semibold">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/businesses/directory">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                  Back to Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">{business.businessName}</h1>
                {business.verificationBadge && (
                  <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{business.city}, {business.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">
                    {business.averageRating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-gray-400">
                    ({business.reviewCount || 0} reviews)
                  </span>
                </div>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                  {business.businessType.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsFavorite(!isFavorite)}
                variant="outline"
                className={`border-gray-600 ${isFavorite ? 'text-red-400 border-red-400' : 'text-gray-300'}`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400' : ''}`} />
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Photo Gallery</h3>
              {business.images && business.images.length > 0 ? (
                <ImageGallery images={business.images} businessName={business.businessName} />
              ) : (
                <div className="relative h-64 bg-gradient-to-br from-yellow-600/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                  {business.user.profilePicture ? (
                    <Image
                      src={business.user.profilePicture}
                      alt={business.businessName}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-8xl">🏢</span>
                  )}
                </div>
              )}
            </Card>

            {/* Tabs */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="border-b border-gray-700 flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-yellow-500 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                    activeTab === 'listings'
                      ? 'border-yellow-500 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Listings ({business.listings.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-yellow-500 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Reviews ({business.reviewCount || 0})
                </button>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">About</h3>
                      <p className="text-gray-300 leading-relaxed">{business.description}</p>
                    </div>

                    {/* Map */}
                    {business.coordinates && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">Location</h3>
                        <BusinessMap
                          coordinates={business.coordinates}
                          businessName={business.businessName}
                          address={`${business.location}, ${business.city}, ${business.country}`}
                        />
                      </div>
                    )}

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Contact Information</h3>
                      <div className="space-y-2 mb-4">
                        {business.phone && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${business.phone}`} className="hover:text-yellow-400">
                              {business.phone}
                            </a>
                          </div>
                        )}
                        {business.email && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${business.email}`} className="hover:text-yellow-400">
                              {business.email}
                            </a>
                          </div>
                        )}
                        {business.website && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Globe className="w-4 h-4" />
                            <a 
                              href={business.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-yellow-400 flex items-center gap-1"
                            >
                              Visit Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {/* Social Media Links */}
                      {business.user.socialLinks && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Follow Us</h4>
                          <SocialLinks socialLinks={business.user.socialLinks} />
                        </div>
                      )}
                    </div>

                    {/* Trust Score */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Trust Score</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-yellow-500 h-3 rounded-full"
                            style={{ width: `${business.trustScore}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-semibold">{business.trustScore}%</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        Based on verified bookings, reviews, and business history
                      </p>
                    </div>
                  </div>
                )}

                {/* Listings Tab */}
                {activeTab === 'listings' && (
                  <div className="space-y-4">
                    {business.listings.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No listings available</p>
                    ) : (
                      business.listings.map((listing) => (
                        <Card key={listing.id} className="bg-gray-700/50 border-gray-600 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white mb-2">{listing.title}</h4>
                              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{listing.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="bg-gray-600 px-2 py-1 rounded">
                                  {listing.activityType.replace('_', ' ')}
                                </span>
                                {listing.pricing && typeof listing.pricing === 'object' && (
                                  <span className="text-yellow-400 font-semibold">
                                    ${listing.pricing.basePrice || 'N/A'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Link href={`/experiences/${listing.id}`}>
                              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {business.reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">No reviews yet</p>
                        <p className="text-gray-500 text-sm">Be the first to review this business!</p>
                      </div>
                    ) : (
                      business.reviews.map((review) => (
                        <Card key={review.id} className="bg-gray-700/50 border-gray-600 p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              {review.traveler.profilePicture ? (
                                <Image
                                  src={review.traveler.profilePicture}
                                  alt={review.traveler.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <span className="text-gray-400">{review.traveler.name[0]}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-white">{review.traveler.name}</span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-gray-500 text-xs">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="text-gray-300 text-sm">{review.comment}</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Contact Business</h3>
              <InquiryForm businessId={business.id} businessName={business.businessName} />
            </Card>

            {/* Owner Info */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Business Owner</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  {business.user.profilePicture ? (
                    <Image
                      src={business.user.profilePicture}
                      alt={business.user.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-gray-400">{business.user.name[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white">{business.user.name}</p>
                  <p className="text-gray-400 text-sm">Owner</p>
                </div>
              </div>
            </Card>

            {/* Related Businesses */}
            {relatedBusinesses.length > 0 && (
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Related Businesses</h3>
                <div className="space-y-3">
                  {relatedBusinesses.map((related) => (
                    <Link key={related.id} href={`/businesses/${related.id}`}>
                      <div className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm">{related.businessName}</span>
                          {related.verificationBadge && (
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-xs">{related.city}, {related.country}</p>
                        {related.averageRating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-gray-300 text-xs">{related.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BusinessDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <BusinessDetailContent />
    </Suspense>
  )
}


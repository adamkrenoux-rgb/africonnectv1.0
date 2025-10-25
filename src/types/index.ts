// Essential types for the application

export interface AIItinerary {
  id: string
  title: string
  description: string
  duration: string
  totalCost: number
  currency: string
  accommodation: {
    name: string
    type: string
    price: number
    location: string
  }
  activities: {
    name: string
    description: string
    duration: string
    price: number
    business: {
      name: string
      verified: boolean
      rating: number
    }
  }[]
  meals: {
    name: string
    type: string
    price: number
    business: {
      name: string
      verified: boolean
    }
  }[]
  transport: {
    type: string
    description: string
    price: number
  }[]
  highlights: string[]
  aiGenerated: boolean
}

export interface BusinessListing {
  id: string
  title: string
  description: string
  pricing: {
    basePrice: number
    currency: string
    pricingType: 'per_person' | 'per_group' | 'per_night' | 'fixed'
  }
  duration: string
  activityType: string
  tags: string[]
  business: {
    id: string
    name: string
    verified: boolean
    trustScore: number
    location: {
      country: string
      city: string
      coordinates: [number, number]
    }
  }
  media: {
    photos: string[]
    videos: string[]
    stories: string[]
  }
  availability: {
    startDate: string
    endDate: string
    maxCapacity: number
  }
  aiGenerated: boolean
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  organization?: string
  country?: string
  profileImage?: string
  verificationStatus: string
}

export interface BusinessProfile extends UserProfile {
  business: {
    id: string
    businessName: string
    description: string
    businessType: string
    location: {
      country: string
      city: string
      coordinates: [number, number]
    }
    verificationBadge: boolean
    trustScore: number
    website?: string
    phone?: string
    email?: string
  }
}

export interface InfluencerProfile extends UserProfile {
  socialStats: {
    followers: number
    engagementRate: number
    platforms: string[]
    niche: string[]
  }
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface BusinessOnboardingForm {
  businessName: string
  description: string
  businessType: string
  location: {
    country: string
    city: string
    coordinates: [number, number]
  }
  website?: string
  phone?: string
  email?: string
}

export interface CampaignCreationForm {
  title: string
  description: string
  targetRegion: string[]
  deliverables: {
    posts: number
    reels: number
    stories: number
    other?: string
  }
  audienceDemographics: {
    ageRange: [number, number]
    interests: string[]
    location: string[]
  }
  collaborationTerms: string
  budget?: number
}

export interface ApplicationForm {
  proposalText: string
  contentSamples?: File[]
  proposedPrice?: number
}

// Notification types
export interface Notification {
  id: string
  type: 'booking' | 'campaign' | 'verification' | 'application' | 'review'
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: any
}

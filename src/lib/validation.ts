import { z } from 'zod'

// Shared enums
const entityTypeEnum = z.enum(['BUSINESS', 'LISTING', 'CAMPAIGN', 'ITINERARY', 'OTHER'])
const disputeTargetTypeEnum = z.enum(['BOOKING', 'CAMPAIGN', 'APPLICATION'])
const disputeStatusEnum = z.enum(['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CANCELLED'])
const promotionStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'])

// Business validation schemas
export const createBusinessSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  businessName: z.string().min(1, 'Business name is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  location: z.string().min(1, 'Location is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  coordinates: z.array(z.number()).length(2).optional(), // [lat, lng]
  businessType: z.enum(['SAFARI', 'ADVENTURE', 'CULTURAL', 'LUXURY', 'BUDGET', 'ACCOMMODATION', 'TRANSPORT', 'FOOD', 'OTHER']),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal(''))
})

// Influencer portfolio
export const influencerPortfolioUpsertSchema = z.object({
  headline: z.string().max(200).optional(),
  bio: z.string().max(5000).optional(),
  stats: z.record(z.any()).optional(),
  niches: z.array(z.string()).optional(),
  links: z
    .object({
      instagram: z.string().url().optional().or(z.literal('')),
      youtube: z.string().url().optional().or(z.literal('')),
      tiktok: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      website: z.string().url().optional().or(z.literal(''))
    })
    .partial()
    .optional(),
  media: z.array(z.object({ type: z.enum(['image', 'video']), url: z.string().url(), caption: z.string().optional() })).optional()
})

export const updateBusinessSchema = createBusinessSchema.partial().extend({
  id: z.string().min(1, 'Business ID is required')
})

// Listing validation schemas
export const createListingSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  pricing: z.object({
    basePrice: z.number().positive('Price must be positive'),
    currency: z.string().default('USD'),
    pricingType: z.enum(['per_person', 'per_group', 'per_day', 'fixed']).default('per_person')
  }),
  duration: z.string().min(1, 'Duration is required'),
  activityType: z.enum([
    'WILDLIFE_SAFARI',
    'MOUNTAIN_CLIMBING',
    'CULTURAL_TOUR',
    'BEACH_ACTIVITY',
    'CITY_TOUR',
    'ADVENTURE_SPORT',
    'CULINARY_EXPERIENCE',
    'PHOTOGRAPHY_TOUR',
    'VOLUNTEER_WORK',
    'OTHER'
  ]),
  tags: z.array(z.string()).optional().default([]),
  maxCapacity: z.number().int().positive().default(1),
  availability: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional()
  }).optional()
})

export const updateListingSchema = createListingSchema.partial().extend({
  id: z.string().min(1, 'Listing ID is required')
})

// Favorites
export const createFavoriteSchema = z.object({
  entityType: entityTypeEnum,
  entityId: z.string().min(1, 'Entity ID is required')
})

export const deleteFavoriteSchema = z.object({
  entityType: entityTypeEnum,
  entityId: z.string().min(1, 'Entity ID is required')
})

// Promotions
export const createPromotionSchema = z.object({
  businessId: z.string().optional(),
  listingId: z.string().optional(),
  region: z.string().optional(),
  budgetCents: z.number().int().nonnegative().default(0),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  priorityBoost: z.number().int().min(0).max(100).optional()
}).refine((data) => Boolean(data.businessId || data.listingId), {
  message: 'Either businessId or listingId is required'
})

export const updatePromotionSchema = z.object({
  status: promotionStatusEnum.optional(),
  budgetCents: z.number().int().nonnegative().optional(),
  priorityBoost: z.number().int().min(0).max(100).optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional()
})

// Disputes
export const createDisputeSchema = z.object({
  targetType: disputeTargetTypeEnum,
  targetId: z.string().min(1, 'Target ID is required'),
  reason: z.string().min(3).max(500),
  details: z.string().max(5000).optional()
})

export const updateDisputeStatusSchema = z.object({
  status: disputeStatusEnum,
  resolutionNotes: z.string().max(5000).optional()
})

export const addDisputeMessageSchema = z.object({
  content: z.string().min(1).max(5000)
})

// Booking validation schemas
export const createBookingSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  travelerId: z.string().min(1, 'Traveler ID is required'),
  bookingDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)), // ISO date string
  totalAmount: z.number().positive('Total amount must be positive'),
  stripePaymentIntentId: z.string().optional()
})

export const updateBookingSchema = z.object({
  id: z.string().min(1, 'Booking ID is required'),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'HELD_IN_ESCROW']).optional()
})

// Campaign validation schemas
export const createCampaignSchema = z.object({
  influencerId: z.string().min(1, 'Influencer ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  targetRegion: z.array(z.string()).min(1, 'At least one target region is required'),
  deliverables: z.object({
    posts: z.number().int().nonnegative().optional(),
    reels: z.number().int().nonnegative().optional(),
    stories: z.number().int().nonnegative().optional()
  }),
  audienceDemographics: z.object({
    ageRange: z.array(z.number()).length(2).optional(),
    interests: z.array(z.string()).optional(),
    location: z.array(z.string()).optional()
  }).optional(),
  collaborationTerms: z.string().max(2000).optional(),
  status: z.enum(['DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional()
})

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  id: z.string().min(1, 'Campaign ID is required')
})

// Application validation schemas
export const createApplicationSchema = z.object({
  campaignId: z.string().min(1, 'Campaign ID is required'),
  businessId: z.string().min(1, 'Business ID is required'),
  proposalText: z.string().min(10, 'Proposal must be at least 10 characters').max(2000),
  contentSamples: z.object({
    images: z.array(z.string().url()).optional(),
    videos: z.array(z.string().url()).optional()
  }).optional(),
  proposedPrice: z.number().positive().optional()
})

export const updateApplicationSchema = z.object({
  id: z.string().min(1, 'Application ID is required'),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED']).optional(),
  aiInsights: z.any().optional()
})

// Review validation schemas
export const createReviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  travelerId: z.string().min(1, 'Traveler ID is required'),
  businessId: z.string().min(1, 'Business ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(2000).optional(),
  response: z.string().max(2000).optional(),
  travelerType: z.enum(['EXPAT', 'DIPLOMAT', 'TOURIST', 'LOCAL', 'OTHER']).optional(),
  isVerifiedReviewer: z.boolean().optional(),
  verificationEvidence: z.record(z.any()).optional(),
  language: z.string().max(10).optional()
})

export const updateReviewSchema = z.object({
  id: z.string().min(1, 'Review ID is required'),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(2000).optional(),
  response: z.string().max(2000).optional()
})

// Traveler schemas
export const travelerProfileSchema = z.object({
  travelerType: z.enum(['EXPAT', 'DIPLOMAT', 'TOURIST', 'LOCAL', 'OTHER']).optional(),
  homeBase: z.string().max(200).optional(),
  preferredBudgetRange: z
    .object({
      currency: z.string().max(3).optional(),
      min: z.number().int().nonnegative().optional(),
      max: z.number().int().nonnegative().optional()
    })
    .optional(),
  preferredActivities: z.array(z.string()).optional(),
  preferredLanguages: z.array(z.string()).optional(),
  mobilityNeeds: z.string().max(500).optional(),
  accessibilityNotes: z.string().max(1000).optional(),
  aiSetupCompleted: z.boolean().optional(),
  introSummary: z.string().max(2000).optional(),
  identityVerified: z.boolean().optional(),
  verificationDocumentUrl: z.string().url().optional().or(z.literal('')),
  verificationDocumentType: z
    .enum(['BUSINESS_LICENSE', 'GOVERNMENT_ID', 'TAX_CERTIFICATE', 'INSURANCE_CERTIFICATE', 'OTHER'])
    .optional()
})

export const travelerPreferenceSchema = z.object({
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().nonnegative().optional(),
  preferredDistanceKm: z.number().int().nonnegative().optional(),
  travelPace: z.string().max(200).optional(),
  dietaryNeeds: z.string().max(500).optional(),
  riskTolerance: z.string().max(200).optional(),
  accommodationPreferences: z.string().max(1000).optional(),
  transportationPreferences: z.string().max(1000).optional(),
  priorities: z.record(z.any()).optional()
})

export const tripPlanSchema = z.object({
  title: z.string().min(1, 'Trip title is required').max(200),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  destinations: z.array(z.record(z.any())).optional(),
  activities: z.array(z.record(z.any())).optional()
})

export const tripHealthCheckRequestSchema = z.object({
  tripPlanId: z.string().min(1, 'Trip plan ID is required'),
  context: z.record(z.any()).optional()
})

export const travelerNotificationSchema = z.object({
  notificationType: z
    .enum(['OFFER', 'NEW_TRIP', 'SAFETY_ALERT', 'MESSAGE', 'RECOMMENDATION', 'GENERAL'])
    .optional(),
  read: z.boolean().optional()
})

// User validation schemas
export const createUserSchema = z.object({
  clerkId: z.string().optional(),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  name: z.string().max(200).optional(),
  role: z.enum(['TRAVELER', 'BUSINESS', 'INFLUENCER', 'ADMIN']).optional().default('TRAVELER'),
  profilePicture: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(1000).optional(),
  country: z.string().optional()
})

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().max(200).optional(),
  bio: z.string().max(1000).optional(),
  profilePicture: z.string().url().optional().or(z.literal('')),
  country: z.string().optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal(''))
  }).optional()
})

// Helper function to validate request body
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): Promise<{ success: true; data: T } | { success: false; error: string; details?: any }> {
  try {
    const data = await schema.parseAsync(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return {
        success: false,
        error: firstError.message || 'Validation failed',
        details: error.errors
      }
    }
    return {
      success: false,
      error: 'Validation failed'
    }
  }
}


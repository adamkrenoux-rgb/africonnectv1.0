import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import {
  generateTravelerRecommendations,
  RecommendationCandidate,
  RecommendationCandidateType
} from '@/lib/ai/traveler-recommendations'

export const dynamic = 'force-dynamic'

export const POST = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can generate recommendations' },
      { status: 403 }
    )
  }

  const profile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id },
    include: {
      preferences: true,
      tripPlans: {
        select: { id: true, title: true, destinations: true }
      },
      tripHistory: {
        select: { id: true, tags: true }
      }
    }
  })

  if (!profile) {
    return NextResponse.json(
      { success: false, error: 'Traveler profile not found' },
      { status: 404 }
    )
  }

  const listings = await prisma.listing.findMany({
    where: { verified: true },
    take: 25,
    orderBy: { updatedAt: 'desc' },
    include: {
      business: {
        select: {
          id: true,
          businessName: true,
          city: true,
          country: true,
          businessType: true
        }
      }
    }
  })

  const experiences = await prisma.culturalExperience.findMany({
    take: 15,
    orderBy: { updatedAt: 'desc' },
    include: {
      business: {
        select: {
          id: true,
          businessName: true,
          country: true
        }
      }
    }
  })

  const businesses = await prisma.business.findMany({
    where: {
      verificationBadge: true
    },
    take: 15,
    orderBy: { trustScore: 'desc' },
    select: {
      id: true,
      businessName: true,
      city: true,
      country: true,
      businessType: true,
      trustScore: true,
      website: true,
      phone: true,
      email: true,
      listings: {
        take: 2,
        select: {
          id: true,
          title: true,
          tags: true
        }
      }
    }
  })

  const candidateMap = new Map<string, { type: RecommendationCandidateType; data: any }>()

  const candidates: RecommendationCandidate[] = [
    ...listings.map((listing) => {
      candidateMap.set(listing.id, { type: 'listing', data: listing })
      return {
        id: listing.id,
        type: 'listing' as const,
        title: listing.title,
        tags: listing.tags,
        region: listing.business?.country || null,
        metadata: {
          businessName: listing.business?.businessName,
          pricing: listing.pricing,
          activityType: listing.activityType
        }
      }
    }),
    ...experiences.map((experience) => {
      candidateMap.set(experience.id, { type: 'experience', data: experience })
      return {
        id: experience.id,
        type: 'experience' as const,
        title: experience.title,
        tags: experience.tags,
        region: experience.region,
        metadata: {
          verified: experience.verified
        }
      }
    }),
    ...businesses.map((business) => {
      candidateMap.set(business.id, { type: 'business', data: business })
      return {
        id: business.id,
        type: 'business' as const,
        title: business.businessName,
        tags: business.listings.flatMap((listing) => listing.tags || []),
        region: business.country,
        metadata: {
          city: business.city,
          businessType: business.businessType,
          trustScore: business.trustScore
        }
      }
    })
  ]

  const recommendationResult = await generateTravelerRecommendations(
    {
      profile,
      preferences: profile.preferences ?? undefined,
      history: profile.tripHistory ?? undefined,
      tripPlans: profile.tripPlans?.map((plan) => ({
        id: plan.id,
        title: plan.title,
        tags: Array.isArray(plan.destinations)
          ? plan.destinations
              .map((destination: any) =>
                typeof destination === 'string'
                  ? destination
                  : destination?.name || destination?.label || null
              )
              .filter((value: unknown): value is string => typeof value === 'string' && value.length > 0)
          : []
      }))
    },
    candidates,
    { topK: 10 }
  )

  const storedRecommendations = await prisma.$transaction(async (tx) => {
    await tx.travelerRecommendation.deleteMany({
      where: {
        travelerProfileId: profile.id,
        recommendationSource: 'AI'
      }
    })

    if (!recommendationResult.recommendations.length) {
      return []
    }

    const created = await Promise.all(
      recommendationResult.recommendations.map(async (rec) => {
        const candidate = candidateMap.get(rec.id)
        if (!candidate) return null

        const data: any = {
          travelerProfileId: profile.id,
          recommendationSource: 'AI',
          score: rec.score,
          reason: { text: rec.reason }
        }

        if (candidate.type === 'listing') {
          data.listingId = candidate.data.id
        } else if (candidate.type === 'experience') {
          data.culturalExperienceId = candidate.data.id
        } else {
          data.businessId = candidate.data.id
        }

        return tx.travelerRecommendation.create({
          data,
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                pricing: true,
                tags: true,
                business: {
                  select: {
                    id: true,
                    businessName: true,
                    city: true,
                    country: true,
                    businessType: true
                  }
                }
              }
            },
            culturalExperience: {
              select: {
                id: true,
                title: true,
                description: true,
                tags: true,
                region: true,
                verified: true
              }
            },
            business: {
              select: {
                id: true,
                businessName: true,
                city: true,
                country: true,
                businessType: true,
                trustScore: true,
                verificationBadge: true
              }
            }
          }
        })
      })
    )

    return created.filter(Boolean)
  })

  return NextResponse.json({
    success: true,
    provider: recommendationResult.provider,
    recommendations: storedRecommendations
  })
})


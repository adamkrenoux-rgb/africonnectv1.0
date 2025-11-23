import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RecommendationSource } from '@prisma/client'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const GET = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const nextRequest = request as NextRequest
  const searchParams = nextRequest.nextUrl.searchParams
  const source = searchParams.get('source')
  const take = Number(searchParams.get('take')) || 20

  const profile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) {
    return NextResponse.json({ success: true, recommendations: [] })
  }

  let normalizedSource: RecommendationSource | undefined
  if (typeof source === 'string') {
    const candidate = source.toUpperCase() as keyof typeof RecommendationSource
    if (Object.prototype.hasOwnProperty.call(RecommendationSource, candidate)) {
      normalizedSource = RecommendationSource[candidate]
    }
  }

  const recommendations = await prisma.travelerRecommendation.findMany({
    where: {
      travelerProfileId: profile.id,
      ...(normalizedSource ? { recommendationSource: normalizedSource } : {})
    },
    orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
    take,
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          pricing: true,
          tags: true,
          culturalHighlights: true
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
      }
    }
  })

  return NextResponse.json({
    success: true,
    recommendations
  })
})


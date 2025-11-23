import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const GET = apiErrorHandler(async (request: Request) => {
  const nextRequest = request as NextRequest
  const searchParams = nextRequest.nextUrl.searchParams
  const businessId = searchParams.get('businessId')
  const listingId = searchParams.get('listingId')
  const region = searchParams.get('region')

  if (!businessId && !listingId && !region) {
    return NextResponse.json(
      { success: false, error: 'Provide businessId, listingId, or region' },
      { status: 400 }
    )
  }

  if (businessId || listingId) {
    const conditions: Array<{ businessId?: string; listingId?: string }> = []
    if (businessId) conditions.push({ businessId })
    if (listingId) conditions.push({ listingId })

    const safetyProfile = await prisma.safetyProfile.findFirst({
      where: {
        OR: conditions
      },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            country: true,
            city: true,
            verificationBadge: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            tags: true,
            activityType: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      safety: safetyProfile
    })
  }

  const regionalProfiles = await prisma.safetyProfile.findMany({
    where: {
      region: region || undefined
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: {
      business: {
        select: {
          id: true,
          businessName: true,
          city: true,
          country: true,
          verificationBadge: true
        }
      },
      listing: {
        select: {
          id: true,
          title: true,
          activityType: true,
          tags: true
        }
      }
    }
  })

  return NextResponse.json({
    success: true,
    safety: regionalProfiles
  })
})


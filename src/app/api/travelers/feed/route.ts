import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ContentFeedType } from '@prisma/client'

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
  const region = searchParams.get('region')
  const type = searchParams.get('type')
  const take = Number(searchParams.get('take')) || 20

  const profile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id },
    select: { homeBase: true, preferredLanguages: true }
  })

  const effectiveRegion = region || profile?.homeBase || user.country || 'global'

  let normalizedType: ContentFeedType | undefined
  if (typeof type === 'string') {
    const candidate = type.toUpperCase() as keyof typeof ContentFeedType
    if (Object.prototype.hasOwnProperty.call(ContentFeedType, candidate)) {
      normalizedType = ContentFeedType[candidate]
    }
  }

  const feedItems = await prisma.travelerFeedItem.findMany({
    where: {
      region: effectiveRegion,
      ...(normalizedType ? { contentType: normalizedType } : {}),
      AND: [
        {
          OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }]
        },
        {
          OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }]
        }
      ]
    },
    orderBy: [
      { priority: 'desc' },
      { publishAt: 'desc' }
    ],
    take,
    include: {
      relatedListing: {
        select: { id: true, title: true, pricing: true, tags: true }
      },
      relatedExperience: {
        select: { id: true, title: true, tags: true, region: true }
      }
    }
  })

  return NextResponse.json({
    success: true,
    region: effectiveRegion,
    feed: feedItems
  })
})


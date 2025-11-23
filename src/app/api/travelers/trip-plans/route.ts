import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { tripPlanSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export const GET = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can access trip plans' },
      { status: 403 }
    )
  }

  const profile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) {
    return NextResponse.json({ success: true, tripPlans: [] })
  }

  const nextRequest = request as NextRequest
  const searchParams = nextRequest.nextUrl.searchParams
  const take = Number(searchParams.get('take')) || 20

  const tripPlans = await prisma.tripPlan.findMany({
    where: { travelerProfileId: profile.id },
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      healthChecks: {
        orderBy: { createdAt: 'desc' },
        take: 3
      },
      recommendations: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          listing: { select: { id: true, title: true, pricing: true } },
          business: { select: { id: true, businessName: true } },
          culturalExperience: { select: { id: true, title: true } }
        }
      }
    }
  })

  return NextResponse.json({
    success: true,
    tripPlans
  })
})

export const POST = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can create trip plans' },
      { status: 403 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const parsed = await tripPlanSchema.safeParseAsync(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid trip plan data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const profile = await prisma.travelerProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, travelerType: 'TOURIST' }
  })

  const tripPlan = await prisma.tripPlan.create({
    data: {
      travelerProfileId: profile.id,
      ...parsed.data
    },
    include: {
      healthChecks: true,
      recommendations: true
    }
  })

  return NextResponse.json({
    success: true,
    tripPlan
  })
})


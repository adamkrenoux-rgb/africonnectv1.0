import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { tripPlanSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

async function ensureTravelerOwnership(userId: string, tripPlanId: string) {
  const tripPlan = await prisma.tripPlan.findFirst({
    where: {
      id: tripPlanId,
      travelerProfile: {
        userId
      }
    }
  })

  if (!tripPlan) {
    return null
  }

  return tripPlan
}

export const GET = apiErrorHandler(async (_request: Request, { params }: { params: { id: string } }) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json({ success: false, error: 'Only travelers can access trip plans' }, { status: 403 })
  }

  const tripPlan = await prisma.tripPlan.findFirst({
    where: {
      id: params.id,
      travelerProfile: {
        userId: user.id
      }
    },
    include: {
      healthChecks: {
        orderBy: { createdAt: 'desc' }
      },
      recommendations: {
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { select: { id: true, title: true, pricing: true } },
          business: { select: { id: true, businessName: true } },
          culturalExperience: { select: { id: true, title: true } }
        }
      }
    }
  })

  if (!tripPlan) {
    return NextResponse.json({ success: false, error: 'Trip plan not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, tripPlan })
})

export const PUT = apiErrorHandler(async (request: Request, { params }: { params: { id: string } }) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json({ success: false, error: 'Only travelers can update trip plans' }, { status: 403 })
  }

  const existingTripPlan = await ensureTravelerOwnership(user.id, params.id)
  if (!existingTripPlan) {
    return NextResponse.json({ success: false, error: 'Trip plan not found' }, { status: 404 })
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

  const parsed = await tripPlanSchema.partial().safeParseAsync(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid trip plan data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const updatedPlan = await prisma.tripPlan.update({
    where: { id: existingTripPlan.id },
    data: parsed.data,
    include: {
      healthChecks: {
        orderBy: { createdAt: 'desc' }
      },
      recommendations: {
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { select: { id: true, title: true, pricing: true } },
          business: { select: { id: true, businessName: true } },
          culturalExperience: { select: { id: true, title: true } }
        }
      }
    }
  })

  return NextResponse.json({ success: true, tripPlan: updatedPlan })
})

export const DELETE = apiErrorHandler(async (_request: Request, { params }: { params: { id: string } }) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json({ success: false, error: 'Only travelers can delete trip plans' }, { status: 403 })
  }

  const existingTripPlan = await ensureTravelerOwnership(user.id, params.id)
  if (!existingTripPlan) {
    return NextResponse.json({ success: false, error: 'Trip plan not found' }, { status: 404 })
  }

  await prisma.tripPlan.delete({
    where: { id: existingTripPlan.id }
  })

  return NextResponse.json({ success: true })
})


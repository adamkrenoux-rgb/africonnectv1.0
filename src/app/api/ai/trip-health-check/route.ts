import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { tripHealthCheckRequestSchema } from '@/lib/validation'
import { runTripHealthCheck } from '@/lib/ai/trip-health-check'

export const dynamic = 'force-dynamic'

export const POST = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can run trip health checks' },
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

  const parsed = await tripHealthCheckRequestSchema.safeParseAsync(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid request data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const tripPlan = await prisma.tripPlan.findFirst({
    where: {
      id: parsed.data.tripPlanId,
      travelerProfile: { userId: user.id }
    },
    include: {
      travelerProfile: {
        include: {
          preferences: true
        }
      }
    }
  })

  if (!tripPlan) {
    return NextResponse.json(
      { success: false, error: 'Trip plan not found' },
      { status: 404 }
    )
  }

  const result = await runTripHealthCheck({
    tripPlan: {
      title: tripPlan.title,
      destinations: tripPlan.destinations,
      activities: tripPlan.activities,
      startDate: tripPlan.startDate ? tripPlan.startDate.toISOString() : undefined,
      endDate: tripPlan.endDate ? tripPlan.endDate.toISOString() : undefined
    },
    travelerProfile: {
      travelerType: tripPlan.travelerProfile?.travelerType,
      preferredBudgetRange: tripPlan.travelerProfile?.preferredBudgetRange,
      preferredActivities: tripPlan.travelerProfile?.preferredActivities,
      mobilityNeeds: tripPlan.travelerProfile?.mobilityNeeds,
      accessibilityNotes: tripPlan.travelerProfile?.accessibilityNotes
    },
    context: parsed.data.context
  })

  const tripHealthCheck = await prisma.tripHealthCheck.create({
    data: {
      tripPlanId: tripPlan.id,
      aiAnalysisId: result.provider === 'openai' ? 'openai' : 'mock',
      issues: result.issues,
      recommendations: result.recommendations,
      status: result.issues.some((issue) => issue.severity === 'critical') ? 'critical' : 'ok'
    }
  })

  await prisma.tripPlan.update({
    where: { id: tripPlan.id },
    data: {
      lastHealthCheckId: tripHealthCheck.id
    }
  })

  if (result.issues.some((issue) => issue.severity !== 'info')) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        travelerProfileId: tripPlan.travelerProfile?.id,
        notificationType: 'SAFETY_ALERT',
        title: `Trip health check found ${result.issues.length} considerations`,
        message: result.summary,
        data: {
          tripPlanId: tripPlan.id,
          healthCheckId: tripHealthCheck.id,
          issues: result.issues
        }
      }
    })
  }

  return NextResponse.json({
    success: true,
    healthCheck: {
      id: tripHealthCheck.id,
      summary: result.summary,
      issues: result.issues,
      recommendations: result.recommendations,
      provider: result.provider
    }
  })
})


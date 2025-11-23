import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { generateOnboardingStep } from '@/lib/ai/traveler-onboarding'

export const dynamic = 'force-dynamic'

export const POST = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can access onboarding' },
      { status: 403 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const answers = Array.isArray(body?.answers) ? body.answers : []

  const travelerProfile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id }
  })

  const result = await generateOnboardingStep({
    answers,
    travelerProfile: travelerProfile || undefined
  })

  return NextResponse.json({
    success: true,
    provider: result.provider,
    step: result.step,
    summary: result.summary
  })
})


import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { travelerPreferenceSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export const GET = apiErrorHandler(async () => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can access preferences' },
      { status: 403 }
    )
  }

  const profile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id },
    include: { preferences: true }
  })

  return NextResponse.json({
    success: true,
    preferences: profile?.preferences || null
  })
})

export const PUT = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can update preferences' },
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

  const parsed = await travelerPreferenceSchema.safeParseAsync(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid preference data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const profile = await prisma.travelerProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, travelerType: 'TOURIST' }
  })

  const preferences = await prisma.travelerPreference.upsert({
    where: { travelerProfileId: profile.id },
    update: parsed.data,
    create: {
      travelerProfileId: profile.id,
      ...parsed.data
    }
  })

  return NextResponse.json({
    success: true,
    preferences
  })
})


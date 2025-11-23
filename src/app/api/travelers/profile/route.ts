import { NextResponse } from 'next/server'
import { TravelerType } from '@prisma/client'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { travelerPreferenceSchema, travelerProfileSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

function normalizeTravelerType(type?: string | null) {
  if (!type) return undefined
  const upper = type.toUpperCase()
  if (Object.prototype.hasOwnProperty.call(TravelerType, upper)) {
    return upper as TravelerType
  }
  return undefined
}

export const GET = apiErrorHandler(async () => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can access this resource' },
      { status: 403 }
    )
  }

  const profile = await prisma.travelerProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      travelerType: user.country ? 'EXPAT' : 'TOURIST'
    },
    include: {
      user: true,
      preferences: true,
      tripPlans: {
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      recommendations: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          listing: { select: { id: true, title: true, pricing: true, tags: true } },
          business: { select: { id: true, businessName: true, country: true, city: true } },
          culturalExperience: { select: { id: true, title: true, region: true } }
        }
      },
      notifications: {
        orderBy: { sentAt: 'desc' },
        take: 10
      }
    }
  })

  return NextResponse.json({ success: true, profile })
})

export const PUT = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can update this resource' },
      { status: 403 }
    )
  }

  let body: any = {}
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const { preferences: preferencesPayload, primaryLanguage, preferredLocales, ...profilePayload } = body

  const profileValidation = await travelerProfileSchema.safeParseAsync(profilePayload)
  if (!profileValidation.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid profile data',
        details: profileValidation.error.flatten()
      },
      { status: 400 }
    )
  }

  let preferencesValidationResult:
    | { success: true; data: any }
    | { success: false; error: string; details?: any } = { success: true, data: undefined }

  if (typeof preferencesPayload !== 'undefined') {
    const parsed = await travelerPreferenceSchema.safeParseAsync(preferencesPayload)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid preference data',
          details: parsed.error.flatten()
        },
        { status: 400 }
      )
    }
    preferencesValidationResult = { success: true, data: parsed.data }
  }

  const travelerType = normalizeTravelerType(profileValidation.data.travelerType)

  const updatedProfile = await prisma.$transaction(async (tx) => {
    const profileRecord = await tx.travelerProfile.upsert({
      where: { userId: user.id },
      update: {
        ...profileValidation.data,
        travelerType: travelerType ?? profileValidation.data.travelerType ?? undefined
      },
      create: {
        userId: user.id,
        ...profileValidation.data,
        travelerType: travelerType ?? profileValidation.data.travelerType ?? 'TOURIST'
      }
    })

    if (preferencesValidationResult.success && preferencesValidationResult.data) {
      await tx.travelerPreference.upsert({
        where: { travelerProfileId: profileRecord.id },
        update: preferencesValidationResult.data,
        create: {
          travelerProfileId: profileRecord.id,
          ...preferencesValidationResult.data
        }
      })
    }

    if (typeof primaryLanguage === 'string' || Array.isArray(preferredLocales)) {
      await tx.user.update({
        where: { id: user.id },
        data: {
          primaryLanguage: typeof primaryLanguage === 'string' ? primaryLanguage : undefined,
          preferredLocales: Array.isArray(preferredLocales)
            ? preferredLocales.filter((locale) => typeof locale === 'string')
            : undefined
        }
      })
    }

    return tx.travelerProfile.findUnique({
      where: { id: profileRecord.id },
      include: {
          user: true,
        preferences: true,
        tripPlans: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        recommendations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            listing: { select: { id: true, title: true, pricing: true, tags: true } },
            business: { select: { id: true, businessName: true, country: true, city: true } },
            culturalExperience: { select: { id: true, title: true, region: true } }
          }
        },
        notifications: {
          orderBy: { sentAt: 'desc' },
          take: 10
        }
      }
    })
  })

  if (!updatedProfile) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load traveler profile after update'
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    profile: updatedProfile
  })
})


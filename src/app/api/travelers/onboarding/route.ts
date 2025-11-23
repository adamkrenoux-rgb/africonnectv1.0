import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const POST = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can complete onboarding' },
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

  const { answers } = body || {}
  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Answers array is required' },
      { status: 400 }
    )
  }

  // Get or create traveler profile
  const travelerProfile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id }
  })

  if (!travelerProfile) {
    return NextResponse.json(
      { success: false, error: 'Traveler profile not found' },
      { status: 404 }
    )
  }

  // Extract preferences from answers - map to actual schema fields
  const preferences: any = {}
  const profileUpdates: any = {}
  const priorities: string[] = []

  answers.forEach((answer: any) => {
    const category = answer.category?.toLowerCase()
    const answerText = answer.answer?.toLowerCase() || ''

    // Budget category - map to budgetMin/budgetMax
    if (category === 'budget') {
      if (answerText.includes('budget-friendly') || answerText.includes('500-1500')) {
        preferences.budgetMin = 500
        preferences.budgetMax = 1500
      } else if (answerText.includes('mid-range') || answerText.includes('1500-3000')) {
        preferences.budgetMin = 1500
        preferences.budgetMax = 3000
      } else if (answerText.includes('premium') || answerText.includes('3000+')) {
        preferences.budgetMin = 3000
        preferences.budgetMax = 10000
      }
    }

    // Preferences category
    if (category === 'preferences') {
      if (answerText.includes('wildlife') || answerText.includes('safari')) {
        priorities.push('wildlife')
      }
      if (answerText.includes('culture') || answerText.includes('cultural')) {
        priorities.push('culture')
      }
      if (answerText.includes('relaxation') || answerText.includes('beach')) {
        priorities.push('relaxation')
      }
      if (answerText.includes('guided') || answerText.includes('tour')) {
        preferences.travelPace = 'relaxed'
      } else if (answerText.includes('independent')) {
        preferences.travelPace = 'fast'
      } else if (answerText.includes('mix')) {
        preferences.travelPace = 'moderate'
      }
      if (answerText.includes('luxury')) {
        preferences.accommodationPreferences = 'luxury'
      } else if (answerText.includes('budget')) {
        preferences.accommodationPreferences = 'budget'
      } else if (answerText.includes('mid-range')) {
        preferences.accommodationPreferences = 'mid-range'
      }
    }

    // Logistics category
    if (category === 'logistics') {
      if (answerText.includes('private')) {
        preferences.transportationPreferences = 'private'
      } else if (answerText.includes('shared') || answerText.includes('group')) {
        preferences.transportationPreferences = 'shared'
      } else if (answerText.includes('public')) {
        preferences.transportationPreferences = 'public'
      }
      if (answerText.includes('short') || answerText.includes('relaxed')) {
        preferences.travelPace = 'relaxed'
      } else if (answerText.includes('long')) {
        preferences.travelPace = 'fast'
      }
    }

    // Safety category - store in introSummary
    if (category === 'safety') {
      if (!profileUpdates.introSummary) {
        profileUpdates.introSummary = `Safety considerations: ${answer.answer}`
      } else {
        profileUpdates.introSummary += `\n\nSafety: ${answer.answer}`
      }
    }

    // Culture category - add to priorities
    if (category === 'culture') {
      if (answerText.includes('music') || answerText.includes('dance')) {
        priorities.push('music_dance')
      }
      if (answerText.includes('cuisine') || answerText.includes('food')) {
        priorities.push('cuisine')
      }
      if (answerText.includes('art') || answerText.includes('crafts')) {
        priorities.push('art_crafts')
      }
    }
  })

  // Add priorities to preferences if we have any
  if (priorities.length > 0) {
    preferences.priorities = priorities
  }

  // Update traveler profile and preferences
  try {
    await prisma.$transaction(async (tx) => {
      // Update profile
      await tx.travelerProfile.update({
        where: { id: travelerProfile.id },
        data: {
          ...profileUpdates,
          aiSetupCompleted: true
        }
      })

      // Update or create preferences
      if (Object.keys(preferences).length > 0) {
        await tx.travelerPreference.upsert({
          where: { travelerProfileId: travelerProfile.id },
          update: preferences,
          create: {
            travelerProfileId: travelerProfile.id,
            ...preferences
          }
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully'
    })
  } catch (error: any) {
    console.error('Error saving onboarding data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to save onboarding data. Please try again.'
      },
      { status: 500 }
    )
  }
})


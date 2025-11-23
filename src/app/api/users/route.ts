import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

// GET /api/users - Get all users or filter by role
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const verified = searchParams.get('verified')

    const where: any = {}
    if (role) where.role = role
    if (verified) where.isVerified = verified === 'true'

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
        profilePicture: true,
        bio: true,
        isVerified: true,
        country: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ success: true, users }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerkId, email, name, role, profilePicture, bio, country } = body

    // Validate required fields
    if (!clerkId || !email) {
      return NextResponse.json(
        { success: false, error: 'clerkId and email are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        name,
        role: role || 'TRAVELER',
        profilePicture,
        bio,
        country
      }
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update current user's profile/role
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { role, primaryLanguage, preferredLocales, ...rest } = body || {}

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role is required' },
        { status: 400 }
      )
    }

    const normalizedRole = String(role).toUpperCase() as UserRole
    if (!['TRAVELER', 'BUSINESS', 'INFLUENCER', 'ADMIN'].includes(normalizedRole)) {
      return NextResponse.json(
        { success: false, error: `Unsupported role: ${role}` },
        { status: 400 }
      )
    }

    const dbUser = await getCurrentUser()
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Build update data object
    const updateData: any = {
      role: normalizedRole,
    }

    // Only include optional fields if they're provided
    if (primaryLanguage) {
      updateData.primaryLanguage = primaryLanguage
    }
    if (Array.isArray(preferredLocales)) {
      updateData.preferredLocales = preferredLocales.filter((item: unknown) => typeof item === 'string')
    }

    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: updateData
    })

    // If the user is a traveler, ensure a TravelerProfile exists
    if (normalizedRole === 'TRAVELER') {
      const existingProfile = await prisma.travelerProfile.findUnique({
        where: { userId: updatedUser.id }
      })

      const profileData: any = {
        aiSetupCompleted: false, // Mark for AI onboarding
      }

      // Only set preferredLanguages if we have data
      const languages: string[] = []
      if (updatedUser.primaryLanguage) {
        languages.push(updatedUser.primaryLanguage)
      }
      if (Array.isArray(updatedUser.preferredLocales) && updatedUser.preferredLocales.length > 0) {
        languages.push(...updatedUser.preferredLocales.filter((l: unknown) => typeof l === 'string'))
      }
      if (Array.isArray(preferredLocales) && preferredLocales.length > 0) {
        languages.push(...preferredLocales.filter((l: unknown) => typeof l === 'string'))
      }

      if (languages.length > 0) {
        profileData.preferredLanguages = Array.from(new Set(languages))
      }

      if (!existingProfile) {
        await prisma.travelerProfile.create({
          data: {
            userId: updatedUser.id,
            ...profileData
          }
        })
      } else {
        // Only update if we have new language data
        if (languages.length > 0) {
          await prisma.travelerProfile.update({
            where: { userId: updatedUser.id },
            data: {
              preferredLanguages: Array.from(new Set(languages))
            }
          })
        }
      }
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to update user'
    if (error.code === 'P1001' || error.message?.includes('connect') || error.message?.includes('database')) {
      errorMessage = 'Database connection failed. Please check your configuration.'
    } else if (error.code === 'P2025') {
      errorMessage = 'User not found'
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, createUserSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = await validateRequest(createUserSchema, body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: validation.error,
        error: validation.error,
        details: validation.details
      }, { status: 400 })
    }

    const { clerkId, email, name, role, profilePicture, bio, country } = validation.data

    // If clerkId is provided, check if user already exists
    if (clerkId) {
      const existingUser = await prisma.user.findUnique({
        where: { clerkId }
      })

      if (existingUser) {
        return NextResponse.json({
          success: true,
          user: existingUser,
          message: 'User already exists'
        }, { status: 200 })
      }
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json({
        success: false,
        message: 'Email already registered',
        error: 'A user with this email already exists'
      }, { status: 409 })
    }

    // Generate a temporary clerkId if not provided (for non-Clerk signups)
    const tempClerkId = clerkId || `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Create user in database
    const user = await prisma.user.create({
      data: {
        clerkId: tempClerkId,
        email,
        name: name || email.split('@')[0],
        role: role || 'TRAVELER',
        profilePicture,
        bio,
        country
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture,
        bio: user.bio,
        country: user.country,
        createdAt: user.createdAt
      },
      message: 'Account created successfully!'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating account:', error)
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        message: 'Account with this information already exists',
        error: error.meta?.target || 'Unique constraint violation'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create account',
      error: error.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { details: error })
    }, { status: 500 })
  }
}

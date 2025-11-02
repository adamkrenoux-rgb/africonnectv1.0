import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/users/sync - Sync Clerk user data to database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerkId, email, name, profilePicture, role, bio, country } = body

    if (!clerkId || !email) {
      return NextResponse.json(
        { success: false, error: 'clerkId and email are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          name: name || existingUser.name,
          profilePicture: profilePicture || existingUser.profilePicture,
          role: role ? role.toUpperCase() : existingUser.role,
          bio: bio !== undefined ? bio : existingUser.bio,
          country: country || existingUser.country,
        }
      })

      return NextResponse.json({ success: true, user: updatedUser }, { status: 200 })
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          profilePicture,
          role: role ? role.toUpperCase() : 'TRAVELER',
          bio,
          country,
        }
      })

      return NextResponse.json({ success: true, user: newUser }, { status: 201 })
    }
  } catch (error: any) {
    console.error('Error syncing user:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'User with this email or clerkId already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to sync user',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}


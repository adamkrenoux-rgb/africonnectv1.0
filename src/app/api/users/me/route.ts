import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'

// GET /api/users/me - Get current user's database record
export async function GET(request: NextRequest) {
  try {
    // Check if Clerk is configured
    let clerkUser = null
    try {
      clerkUser = await currentUser()
    } catch (clerkError: any) {
      // Clerk not configured or error - return gracefully
      console.warn('Clerk error (may not be configured):', clerkError?.message || 'Unknown error')
      return NextResponse.json(
        { success: false, error: 'Authentication not configured', clerkConfigured: false },
        { status: 401 }
      )
    }

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check database connection
    try {
      // Find user in database
      let dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: {
          businesses: {
            select: {
              id: true,
              businessName: true,
              verificationBadge: true
            }
          }
        }
      })

      // If user doesn't exist, create them
      if (!dbUser) {
        const newUser = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: clerkUser.firstName && clerkUser.lastName
              ? `${clerkUser.firstName} ${clerkUser.lastName}`
              : clerkUser.firstName || clerkUser.username || null,
            profilePicture: clerkUser.imageUrl || null,
            role: ((clerkUser.publicMetadata?.role as string)?.toUpperCase() as UserRole) || 'TRAVELER',
            bio: clerkUser.publicMetadata?.bio as string || null,
            country: clerkUser.publicMetadata?.country as string || null,
          }
        })
        
        // Fetch with relations
        dbUser = await prisma.user.findUnique({
          where: { id: newUser.id },
          include: {
            businesses: {
              select: {
                id: true,
                businessName: true,
                verificationBadge: true
              }
            }
          }
        })
      }

      return NextResponse.json({ success: true, user: dbUser }, { status: 200 })
    } catch (dbError: any) {
      // Database connection error
      console.error('Database error:', dbError?.message || 'Unknown database error')
      return NextResponse.json(
        { success: false, error: 'Database connection failed', dbConfigured: false },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error fetching current user:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}


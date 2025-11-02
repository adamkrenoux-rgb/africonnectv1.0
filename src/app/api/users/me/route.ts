import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/users/me - Get current user's database record
export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

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
      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.username || null,
          profilePicture: clerkUser.imageUrl || null,
          role: (clerkUser.publicMetadata?.role as string)?.toUpperCase() || 'TRAVELER',
          bio: clerkUser.publicMetadata?.bio as string || null,
          country: clerkUser.publicMetadata?.country as string || null,
        },
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
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}


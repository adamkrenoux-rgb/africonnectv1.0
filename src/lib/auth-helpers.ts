import { prisma } from '@/lib/prisma'
import type { User } from '@prisma/client'
import { UserRole, VerificationStatus } from '@prisma/client'

/**
 * Get the current user from Clerk and sync with database
 * Returns the database user record with role and additional info
 */
export async function getCurrentUser() {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const secretKey = process.env.CLERK_SECRET_KEY

    if (!publishableKey || !secretKey || publishableKey === 'your_clerk_publishable_key') {
      return null
    }

    const clerkModule: (typeof import('@clerk/nextjs/server')) | null = await import('@clerk/nextjs/server').catch((error) => {
      console.warn('Failed to load Clerk server helpers:', error)
      return null
    })

    if (!clerkModule?.currentUser) {
      return null
    }

    const clerkUser = await clerkModule.currentUser()
    
    if (!clerkUser) {
      return null
    }

    const derivedRole =
      ((clerkUser.publicMetadata?.role as string)?.toUpperCase() as UserRole) || UserRole.TRAVELER

    const fallbackUser: User = {
      id: `clerk_${clerkUser.id}`,
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name:
        clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.username || null,
      role: derivedRole,
      profilePicture: clerkUser.imageUrl || null,
      bio: (clerkUser.publicMetadata?.bio as string) || null,
      socialLinks: null,
      isVerified: Boolean(clerkUser.publicMetadata?.isVerified),
      country: (clerkUser.publicMetadata?.country as string) || null,
      verificationStatus: VerificationStatus.PENDING,
      primaryLanguage: (clerkUser.publicMetadata?.primaryLanguage as string) || null,
      preferredLocales: Array.isArray(clerkUser.publicMetadata?.preferredLocales)
        ? (clerkUser.publicMetadata?.preferredLocales as string[])
        : [],
      lastActiveAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      // Find or create user in database
      let dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      })

      // If user doesn't exist in DB, create them
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name:
              clerkUser.firstName && clerkUser.lastName
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.firstName || clerkUser.username || null,
            profilePicture: clerkUser.imageUrl || null,
            role: derivedRole,
            bio: (clerkUser.publicMetadata?.bio as string) || null,
            country: (clerkUser.publicMetadata?.country as string) || null,
          },
        })
      } else {
        // Update user info from Clerk
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            email: clerkUser.emailAddresses[0]?.emailAddress || dbUser.email,
            name:
              clerkUser.firstName && clerkUser.lastName
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.firstName || clerkUser.username || dbUser.name,
            profilePicture: clerkUser.imageUrl || dbUser.profilePicture,
            role: derivedRole,
          },
        })
      }

      return dbUser
    } catch (databaseError: any) {
      console.error('[getCurrentUser] Database error:', databaseError?.message || databaseError)
      // If database is unavailable, return null instead of fallback to prevent false authentication
      if (databaseError?.code === 'P1001' || databaseError?.code === 'P1012' || 
          databaseError?.message?.includes('database') || 
          databaseError?.message?.includes('DATABASE_URL') ||
          databaseError?.message?.includes('Can\'t reach database')) {
        console.warn('[getCurrentUser] Database unavailable, returning null')
        return null
      }
      // For other database errors, use fallback user
      console.warn('[getCurrentUser] Database error (non-connection), using fallback user')
      return fallbackUser
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get user's role from database
 */
export async function getUserRole() {
  const user = await getCurrentUser()
  return user?.role || 'TRAVELER'
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: string) {
  const userRole = await getUserRole()
  return userRole === role.toUpperCase()
}

/**
 * Get user by Clerk ID (server-side)
 */
export async function getUserByClerkId(clerkId: string) {
  if (!clerkId) return null
  try {
    return await prisma.user.findUnique({
      where: { clerkId }
    })
  } catch (error: any) {
    console.error('[getUserByClerkId] Database error:', error?.message || error)
    // Return null if database is unavailable
    if (error?.code === 'P1001' || error?.code === 'P1012' || 
        error?.message?.includes('database') || 
        error?.message?.includes('DATABASE_URL')) {
      return null
    }
    throw error
  }
}


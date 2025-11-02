import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * Get the current user from Clerk and sync with database
 * Returns the database user record with role and additional info
 */
export async function getCurrentUser() {
  try {
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return null
    }

    // Find or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    // If user doesn't exist in DB, create them
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
        }
      })
    } else {
      // Update user info from Clerk
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email: clerkUser.emailAddresses[0]?.emailAddress || dbUser.email,
          name: clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.username || dbUser.name,
          profilePicture: clerkUser.imageUrl || dbUser.profilePicture,
          role: (clerkUser.publicMetadata?.role as string)?.toUpperCase() || dbUser.role,
        }
      })
    }

    return dbUser
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
  return await prisma.user.findUnique({
    where: { clerkId }
  })
}


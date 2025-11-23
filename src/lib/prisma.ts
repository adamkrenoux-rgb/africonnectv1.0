import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection on startup with better error handling
if (typeof window === 'undefined') {
  prisma.$connect().catch((error: any) => {
    console.error('[Prisma] Failed to connect to database:', error?.message || error)
    if (error?.code === 'P1001') {
      console.error('[Prisma] Cannot reach database server. Check DATABASE_URL and network connectivity.')
    } else if (error?.code === 'P1012') {
      console.error('[Prisma] Database URL is missing. Set DATABASE_URL environment variable.')
    } else {
      console.warn('[Prisma] Database connection failed. Some features may not work properly.')
    }
  })
}

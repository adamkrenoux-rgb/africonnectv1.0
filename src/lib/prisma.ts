import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection on startup
if (typeof window === 'undefined') {
  prisma.$connect().catch((error) => {
    console.error('Failed to connect to database:', error)
    console.warn('Database connection failed. Some features may not work properly.')
  })
}

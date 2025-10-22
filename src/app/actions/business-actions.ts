'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createBusinessSchema = z.object({
  userId: z.string(),
  businessName: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  businessType: z.enum(['SAFARI', 'LODGE', 'TOUR_OPERATOR', 'RESTAURANT', 'ADVENTURE', 'CULTURAL', 'ACCOMMODATION']),
  coordinates: z.string().optional(),
})

const updateBusinessSchema = z.object({
  id: z.string(),
  businessName: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  businessType: z.enum(['SAFARI', 'LODGE', 'TOUR_OPERATOR', 'RESTAURANT', 'ADVENTURE', 'CULTURAL', 'ACCOMMODATION']).optional(),
  coordinates: z.string().optional(),
})

export async function createBusiness(data: z.infer<typeof createBusinessSchema>) {
  try {
    const validatedData = createBusinessSchema.parse(data)

    const business = await prisma.business.create({
      data: {
        ...validatedData,
        verificationBadge: false,
        trustScore: 0.0,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            verificationStatus: true,
          }
        }
      }
    })

    revalidatePath('/businesses/dashboard')
    return { success: true, business }
  } catch (error) {
    console.error('Error creating business:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to create business' 
    }
  }
}

export async function updateBusiness(data: z.infer<typeof updateBusinessSchema>) {
  try {
    const { id, ...updateData } = updateBusinessSchema.parse(data)

    const business = await prisma.business.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            verificationStatus: true,
          }
        }
      }
    })

    revalidatePath('/businesses/dashboard')
    return { success: true, business }
  } catch (error) {
    console.error('Error updating business:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to update business' 
    }
  }
}

export async function verifyBusiness(businessId: string, verifiedBy: string) {
  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: {
        verificationBadge: true,
        trustScore: 1.0, // Set to maximum for verified businesses
      }
    })

    // Create verification record
    await prisma.verification.create({
      data: {
        businessId,
        documentType: 'BUSINESS_LICENSE',
        documentUrl: 'verified',
        verificationStatus: 'VERIFIED',
        verifiedBy,
        verifiedAt: new Date(),
      }
    })

    revalidatePath('/businesses/dashboard')
    revalidatePath('/admin/verifications')
    return { success: true, business }
  } catch (error) {
    console.error('Error verifying business:', error)
    return { success: false, error: 'Failed to verify business' }
  }
}

export async function getBusinessById(id: string) {
  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            verificationStatus: true,
          }
        },
        listings: {
          where: { verified: true },
          select: {
            id: true,
            title: true,
            pricing: true,
            activityType: true,
          }
        },
        verifications: {
          select: {
            id: true,
            documentType: true,
            verificationStatus: true,
            verifiedAt: true,
          }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          }
        }
      }
    })

    return { success: true, business }
  } catch (error) {
    console.error('Error fetching business:', error)
    return { success: false, error: 'Failed to fetch business' }
  }
}

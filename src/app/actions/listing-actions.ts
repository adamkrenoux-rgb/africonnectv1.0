'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createListingSchema = z.object({
  businessId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  pricing: z.number().positive(),
  duration: z.string().min(1),
  activityType: z.string().min(1),
  tags: z.array(z.string()).default([]),
  maxCapacity: z.number().positive().optional(),
  availability: z.string().optional(),
})

const updateListingSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  pricing: z.number().positive().optional(),
  duration: z.string().min(1).optional(),
  activityType: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  maxCapacity: z.number().positive().optional(),
  availability: z.string().optional(),
})

export async function createListing(data: z.infer<typeof createListingSchema>) {
  try {
    const validatedData = createListingSchema.parse(data)

    const listing = await prisma.listing.create({
      data: {
        ...validatedData,
        verified: false,
      },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            location: true,
            city: true,
            country: true,
            businessType: true,
            verificationBadge: true,
            trustScore: true,
          }
        }
      }
    })

    revalidatePath('/businesses/dashboard')
    return { success: true, listing }
  } catch (error) {
    console.error('Error creating listing:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to create listing' 
    }
  }
}

export async function updateListing(data: z.infer<typeof updateListingSchema>) {
  try {
    const { id, ...updateData } = updateListingSchema.parse(data)

    const listing = await prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        business: {
          select: {
            businessName: true,
            location: true,
            city: true,
            country: true,
            businessType: true,
            verificationBadge: true,
            trustScore: true,
          }
        }
      }
    })

    revalidatePath('/businesses/dashboard')
    return { success: true, listing }
  } catch (error) {
    console.error('Error updating listing:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to update listing' 
    }
  }
}

export async function deleteListing(id: string) {
  try {
    await prisma.listing.delete({
      where: { id }
    })

    revalidatePath('/businesses/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting listing:', error)
    return { success: false, error: 'Failed to delete listing' }
  }
}

export async function verifyListing(id: string) {
  try {
    const listing = await prisma.listing.update({
      where: { id },
      data: { verified: true }
    })

    revalidatePath('/businesses/dashboard')
    revalidatePath('/travelers/dashboard/businesses')
    return { success: true, listing }
  } catch (error) {
    console.error('Error verifying listing:', error)
    return { success: false, error: 'Failed to verify listing' }
  }
}

export async function getListingById(id: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            location: true,
            city: true,
            country: true,
            businessType: true,
            verificationBadge: true,
            trustScore: true,
            user: {
              select: {
                name: true,
                verificationStatus: true,
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true,
          }
        }
      }
    })

    return { success: true, listing }
  } catch (error) {
    console.error('Error fetching listing:', error)
    return { success: false, error: 'Failed to fetch listing' }
  }
}

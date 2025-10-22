'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createBookingSchema = z.object({
  listingId: z.string(),
  travelerId: z.string(),
  businessId: z.string(),
  bookingDate: z.string().datetime(),
  totalAmount: z.number().positive(),
  stripePaymentIntentId: z.string().optional(),
})

const updateBookingStatusSchema = z.object({
  id: z.string(),
  paymentStatus: z.enum(['PENDING', 'HELD_IN_ESCROW', 'COMPLETED', 'REFUNDED']),
})

export async function createBooking(data: z.infer<typeof createBookingSchema>) {
  try {
    const validatedData = createBookingSchema.parse(data)

    // Calculate commission (15%)
    const commission = validatedData.totalAmount * 0.15

    const booking = await prisma.booking.create({
      data: {
        ...validatedData,
        bookingDate: new Date(validatedData.bookingDate),
        commission,
        paymentStatus: 'PENDING',
      },
      include: {
        listing: {
          select: {
            title: true,
            activityType: true,
            business: {
              select: {
                businessName: true,
                location: true,
              }
            }
          }
        },
        traveler: {
          select: {
            name: true,
            email: true,
          }
        },
        business: {
          select: {
            businessName: true,
            location: true,
          }
        }
      }
    })

    revalidatePath('/travelers/dashboard')
    revalidatePath('/businesses/dashboard')
    return { success: true, booking }
  } catch (error) {
    console.error('Error creating booking:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to create booking' 
    }
  }
}

export async function updateBookingStatus(data: z.infer<typeof updateBookingStatusSchema>) {
  try {
    const { id, paymentStatus } = updateBookingStatusSchema.parse(data)

    const booking = await prisma.booking.update({
      where: { id },
      data: { paymentStatus },
      include: {
        listing: {
          select: {
            title: true,
            business: {
              select: {
                businessName: true,
              }
            }
          }
        },
        traveler: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    revalidatePath('/travelers/dashboard')
    revalidatePath('/businesses/dashboard')
    return { success: true, booking }
  } catch (error) {
    console.error('Error updating booking status:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? 'Invalid input data' : 'Failed to update booking status' 
    }
  }
}

export async function getBookingsByTraveler(travelerId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { travelerId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            activityType: true,
            pricing: true,
            business: {
              select: {
                businessName: true,
                location: true,
                city: true,
                country: true,
                verificationBadge: true,
              }
            }
          }
        },
        business: {
          select: {
            businessName: true,
            location: true,
            city: true,
            country: true,
          }
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, bookings }
  } catch (error) {
    console.error('Error fetching traveler bookings:', error)
    return { success: false, error: 'Failed to fetch bookings' }
  }
}

export async function getBookingsByBusiness(businessId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { businessId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            activityType: true,
          }
        },
        traveler: {
          select: {
            name: true,
            email: true,
            verificationStatus: true,
          }
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, bookings }
  } catch (error) {
    console.error('Error fetching business bookings:', error)
    return { success: false, error: 'Failed to fetch bookings' }
  }
}

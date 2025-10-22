import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const bookingId = searchParams.get('bookingId')

    const where: any = {}
    
    if (businessId) {
      where.businessId = businessId
    }
    
    if (bookingId) {
      where.bookingId = bookingId
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        traveler: {
          select: {
            name: true,
            profileImage: true
          }
        },
        business: {
          select: {
            businessName: true
          }
        },
        booking: {
          select: {
            listing: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, rating, comment } = body

    // Verify user owns the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        business: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.travelerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'Review already exists for this booking' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        travelerId: userId,
        businessId: booking.businessId,
        rating,
        comment
      },
      include: {
        traveler: {
          select: {
            name: true,
            profileImage: true
          }
        },
        business: {
          select: {
            businessName: true
          }
        }
      }
    })

    // Update business trust score
    await updateBusinessTrustScore(booking.businessId)

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function updateBusinessTrustScore(businessId: string) {
  try {
    // Get all reviews for the business
    const reviews = await prisma.review.findMany({
      where: { businessId }
    })

    if (reviews.length === 0) return

    // Calculate average rating
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

    // Get business verification status
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        bookings: {
          where: { status: 'COMPLETED' }
        }
      }
    })

    if (!business) return

    // Calculate completion rate
    const totalBookings = business.bookings.length
    const completedBookings = business.bookings.filter(b => b.status === 'COMPLETED').length
    const completionRate = totalBookings > 0 ? completedBookings / totalBookings : 0

    // Calculate trust score (weighted average)
    const verificationWeight = business.verificationBadge ? 0.3 : 0
    const ratingWeight = 0.4
    const completionWeight = 0.3

    const trustScore = 
      (verificationWeight * 1.0) + 
      (ratingWeight * (averageRating / 5.0)) + 
      (completionWeight * completionRate)

    // Update business trust score
    await prisma.business.update({
      where: { id: businessId },
      data: { trustScore: Math.round(trustScore * 100) / 100 }
    })
  } catch (error) {
    console.error('Error updating trust score:', error)
  }
}


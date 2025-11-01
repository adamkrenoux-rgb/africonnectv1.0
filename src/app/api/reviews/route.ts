import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, createReviewSchema } from '@/lib/validation'

// GET /api/reviews - Get all reviews with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const businessId = searchParams.get('businessId')
    const travelerId = searchParams.get('travelerId')
    const minRating = searchParams.get('minRating')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (businessId) where.businessId = businessId
    if (travelerId) where.travelerId = travelerId
    if (minRating) {
      where.rating = {
        gte: parseInt(minRating)
      }
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        traveler: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            country: true
          }
        },
        business: {
          select: {
            id: true,
            businessName: true,
            verificationBadge: true
          }
        },
        booking: {
          include: {
            listing: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: parseInt(limit) })
    })

    return NextResponse.json({ success: true, reviews }, { status: 200 })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = await validateRequest(createReviewSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const {
      bookingId,
      travelerId,
      businessId,
      rating,
      comment
    } = validation.data

    // Verify booking exists and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Can only review completed bookings' },
        { status: 400 }
      )
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId }
    })

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review already exists for this booking' },
        { status: 409 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId,
        travelerId,
        businessId,
        rating,
        comment
      },
      include: {
        traveler: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        },
        business: {
          select: {
            id: true,
            businessName: true
          }
        }
      }
    })

    // Update business trust score
    const allReviews = await prisma.review.findMany({
      where: { businessId }
    })

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    const trustScore = (avgRating / 5) * 100 // Convert to 0-100 scale

    await prisma.business.update({
      where: { id: businessId },
      data: { trustScore }
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Review already exists for this booking' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { success: false, error: 'Invalid booking, traveler, or business reference' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create review',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}

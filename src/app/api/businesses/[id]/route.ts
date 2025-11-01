import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, updateBusinessSchema } from '@/lib/validation'

// GET /api/businesses/[id] - Get a specific business
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true
          }
        },
        listings: {
          include: {
            bookings: {
              select: {
                id: true,
                status: true,
                totalAmount: true
              }
            }
          }
        },
        reviews: {
          include: {
            traveler: {
              select: {
                id: true,
                name: true,
                profilePicture: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        verifications: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating = business.reviews.length > 0
      ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
      : 0

    return NextResponse.json({
      success: true,
      business: {
        ...business,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: business.reviews.length
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch business' },
      { status: 500 }
    )
  }
}

// PATCH /api/businesses/[id] - Update a specific business
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = await validateRequest(updateBusinessSchema, { ...body, id: params.id })
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id }
    })

    if (!existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    const {
      businessName,
      description,
      location,
      city,
      country,
      coordinates,
      businessType,
      website,
      phone,
      email
    } = validation.data

    const business = await prisma.business.update({
      where: { id: params.id },
      data: {
        ...(businessName && { businessName }),
        ...(description && { description }),
        ...(location && { location }),
        ...(city && { city }),
        ...(country && { country }),
        ...(coordinates && { coordinates }),
        ...(businessType && { businessType }),
        ...(website !== undefined && { website }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, business }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating business:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update business',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}

// DELETE /api/businesses/[id] - Delete a specific business
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if business has active bookings
    const activeBookings = await prisma.booking.findFirst({
      where: {
        businessId: params.id,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (activeBookings) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete business with active bookings' },
        { status: 400 }
      )
    }

    await prisma.business.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { success: true, message: 'Business deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting business:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete business',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}


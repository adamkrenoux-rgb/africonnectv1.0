import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    } = body

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
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update business' },
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
    await prisma.business.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { success: true, message: 'Business deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}


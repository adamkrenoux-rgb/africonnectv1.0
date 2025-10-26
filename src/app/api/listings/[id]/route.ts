import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/listings/[id] - Get a specific listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        business: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true
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
              },
              take: 10
            }
          }
        },
        bookings: {
          select: {
            id: true,
            status: true,
            bookingDate: true,
            totalAmount: true
          },
          orderBy: {
            bookingDate: 'desc'
          }
        }
      }
    })

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Calculate business stats
    const businessRating = listing.business.reviews.length > 0
      ? listing.business.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.business.reviews.length
      : 0

    return NextResponse.json({
      success: true,
      listing: {
        ...listing,
        businessRating: Math.round(businessRating * 10) / 10,
        reviewCount: listing.business.reviews.length,
        bookingCount: listing.bookings.length
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

// PATCH /api/listings/[id] - Update a specific listing
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      pricing,
      duration,
      activityType,
      tags,
      maxCapacity,
      availability
    } = body

    const listing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(pricing && { pricing }),
        ...(duration && { duration }),
        ...(activityType && { activityType }),
        ...(tags && { tags }),
        ...(maxCapacity && { maxCapacity }),
        ...(availability && { availability })
      },
      include: {
        business: {
          select: {
            id: true,
            businessName: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, listing }, { status: 200 })
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

// DELETE /api/listings/[id] - Delete a specific listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if listing has any bookings
    const bookings = await prisma.booking.findMany({
      where: {
        listingId: params.id,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (bookings.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete listing with active bookings' },
        { status: 400 }
      )
    }

    await prisma.listing.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { success: true, message: 'Listing deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}


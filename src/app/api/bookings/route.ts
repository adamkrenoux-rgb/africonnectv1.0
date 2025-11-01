import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, createBookingSchema } from '@/lib/validation'

// GET /api/bookings - Get all bookings with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const travelerId = searchParams.get('travelerId')
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (travelerId) where.travelerId = travelerId
    if (businessId) where.businessId = businessId
    if (status) where.status = status

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        listing: {
          include: {
            business: {
              select: {
                id: true,
                businessName: true,
                verificationBadge: true
              }
            }
          }
        },
        traveler: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true
          }
        },
        business: {
          select: {
            id: true,
            businessName: true,
            email: true,
            phone: true
          }
        },
        review: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: parseInt(limit) })
    })

    return NextResponse.json({ success: true, bookings }, { status: 200 })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = await validateRequest(createBookingSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const {
      listingId,
      travelerId,
      bookingDate,
      totalAmount,
      stripePaymentIntentId
    } = validation.data

    // Get listing and verify it exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        business: true
      }
    })

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Calculate commission (15% as specified in plan)
    const commission = totalAmount * 0.15

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        listingId,
        travelerId,
        businessId: listing.businessId,
        bookingDate: new Date(bookingDate),
        totalAmount,
        commission,
        paymentStatus: stripePaymentIntentId ? 'HELD_IN_ESCROW' : 'PENDING',
        status: 'PENDING',
        stripePaymentIntentId
      },
      include: {
        listing: {
          include: {
            business: {
              select: {
                id: true,
                businessName: true
              }
            }
          }
        },
        traveler: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, booking }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Booking already exists' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { success: false, error: 'Invalid listing or traveler reference' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create booking',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}


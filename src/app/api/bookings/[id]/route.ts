import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, updateBookingSchema } from '@/lib/validation'

// GET /api/bookings/[id] - Get a specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        listing: {
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
                }
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
        business: true,
        review: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, booking }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching booking:', error)
    
    // Check if it's a database connection error
    if (error.code === 'P1001' || error.message?.includes('connect') || error.message?.includes('database')) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed', dbConfigured: false },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Update a specific booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = await validateRequest(updateBookingSchema, { ...body, id: params.id })
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    const { status, paymentStatus } = validation.data

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
      },
      include: {
        listing: true,
        traveler: {
          select: {
            id: true,
            name: true,
            email: true
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

    // If booking is completed, update payment status
    if (status === 'COMPLETED' && booking.paymentStatus === 'HELD_IN_ESCROW') {
      await prisma.booking.update({
        where: { id: params.id },
        data: { paymentStatus: 'COMPLETED' }
      })
    }

    return NextResponse.json({ success: true, booking }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating booking:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update booking',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Cancel a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Don't allow cancellation of completed bookings
    if (booking.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel completed booking' },
        { status: 400 }
      )
    }

    // Update to cancelled instead of deleting
    await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: booking.paymentStatus === 'HELD_IN_ESCROW' ? 'REFUNDED' : booking.paymentStatus
      }
    })

    return NextResponse.json(
      { success: true, message: 'Booking cancelled successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error cancelling booking:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to cancel booking',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}


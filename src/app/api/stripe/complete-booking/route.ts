import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId } = body

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          include: {
            business: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user owns the booking
    if (booking.travelerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update booking status to completed
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'COMPLETED',
        paymentStatus: 'COMPLETED'
      }
    })

    // TODO: Release funds to business
    // TODO: Send completion emails
    // TODO: Request review from traveler

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

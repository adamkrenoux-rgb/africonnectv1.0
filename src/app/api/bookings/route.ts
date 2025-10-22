import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBookingSchema = z.object({
  listingId: z.string(),
  travelerId: z.string(),
  businessId: z.string(),
  bookingDate: z.string().datetime(),
  totalAmount: z.number().positive(),
  stripePaymentIntentId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const travelerId = searchParams.get('travelerId')
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (travelerId) where.travelerId = travelerId
    if (businessId) where.businessId = businessId
    if (status) where.paymentStatus = status

    // Temporarily return empty array until database is set up
    const bookings = []

    return NextResponse.json({
      success: true,
      bookings
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bookings',
      error: (error as Error).message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBookingSchema.parse(body)

    // Calculate commission (15%)
    const commission = validatedData.totalAmount * 0.15

    // Temporarily return mock data until database is set up
    const booking = {
      id: 'temp-id',
      ...validatedData,
      bookingDate: new Date(validatedData.bookingDate),
      commission,
      paymentStatus: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      booking
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid input data',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create booking',
      error: (error as Error).message
    }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const businessId = searchParams.get('businessId')
    const listingId = searchParams.get('listingId')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'businessId is required' },
        { status: 400 }
      )
    }

    const currentMonth = month ? parseInt(month) : new Date().getMonth()
    const currentYear = year ? parseInt(year) : new Date().getFullYear()

    // Calculate date range for the month
    const startDate = new Date(currentYear, currentMonth, 1)
    const endDate = new Date(currentYear, currentMonth + 1, 0)

    // Build where clause
    const where: any = {
      businessId,
      bookingDate: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (listingId) {
      where.listingId = listingId
    }

    // Fetch bookings for the month
    const monthBookings = await prisma.booking.findMany({
      where,
      include: {
        listing: {
          select: {
            id: true,
            maxCapacity: true,
          }
        },
        traveler: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        bookingDate: 'asc'
      }
    })

    // Get listing capacity (if listingId provided, use that; otherwise use default)
    let defaultCapacity = 10
    if (listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { maxCapacity: true }
      })
      if (listing) {
        defaultCapacity = listing.maxCapacity || 10
      }
    }

    // Group bookings by date
    const bookingsByDate = new Map<string, typeof monthBookings>()

    monthBookings.forEach(booking => {
      const dateString = booking.bookingDate.toISOString().split('T')[0]
      if (!bookingsByDate.has(dateString)) {
        bookingsByDate.set(dateString, [])
      }
      bookingsByDate.get(dateString)!.push(booking)
    })

    // Build calendar slots for all days in month
    const slots: Array<{
      date: string
      bookings: Array<{
        id: string
        travelerName: string
        status: string
        time?: string
      }>
      available: boolean
      capacity: number
      booked: number
    }> = []

    const daysInMonth = endDate.getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dateString = date.toISOString().split('T')[0]
      
      const dayBookings = bookingsByDate.get(dateString) || []
      const bookedCount = dayBookings.filter(b => 
        b.status === 'PENDING' || b.status === 'CONFIRMED'
      ).length

      const capacity = dayBookings[0]?.listing?.maxCapacity || defaultCapacity
      const available = bookedCount < capacity

      slots.push({
        date: dateString,
        bookings: dayBookings.map(booking => ({
          id: booking.id,
          travelerName: booking.traveler?.name || 'Unknown',
          status: booking.status,
          time: booking.bookingDate.toTimeString().split(' ')[0].slice(0, 5)
        })),
        available,
        capacity,
        booked: bookedCount
      })
    }

    return NextResponse.json({
      success: true,
      bookings: slots
    })
  } catch (error) {
    console.error('Error fetching booking calendar:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking calendar' },
      { status: 500 }
    )
  }
}


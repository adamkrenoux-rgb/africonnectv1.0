import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBusinessSchema = z.object({
  userId: z.string(),
  businessName: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  businessType: z.enum(['SAFARI', 'LODGE', 'TOUR_OPERATOR', 'RESTAURANT', 'ADVENTURE', 'CULTURAL', 'ACCOMMODATION']),
  coordinates: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const businessType = searchParams.get('businessType')
    const verified = searchParams.get('verified')

    const where: any = {}
    
    if (country) where.country = country
    if (businessType) where.businessType = businessType
    if (verified === 'true') where.verificationBadge = true

    // Mock businesses for demonstration
    const businesses = [
      {
        id: 'demo-1',
        businessName: 'Serengeti Safari Lodge',
        description: 'Authentic safari experiences in the heart of Tanzania',
        location: 'Serengeti National Park',
        city: 'Arusha',
        country: 'Tanzania',
        businessType: 'SAFARI',
        verificationBadge: true,
        trustScore: 0.95,
        listings: [
          {
            id: 'listing-1',
            title: '3-Day Serengeti Safari',
            pricing: 450,
            activityType: 'Wildlife Safari'
          }
        ],
        _count: {
          reviews: 23,
          bookings: 156
        }
      },
      {
        id: 'demo-2',
        businessName: 'Cape Town Adventures',
        description: 'Mountain hiking and coastal experiences',
        location: 'Table Mountain',
        city: 'Cape Town',
        country: 'South Africa',
        businessType: 'ADVENTURE',
        verificationBadge: true,
        trustScore: 0.88,
        listings: [
          {
            id: 'listing-2',
            title: 'Table Mountain Hike',
            pricing: 120,
            activityType: 'Hiking'
          }
        ],
        _count: {
          reviews: 18,
          bookings: 89
        }
      }
    ]

    return NextResponse.json({
      success: true,
      businesses
    })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch businesses',
      error: (error as Error).message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBusinessSchema.parse(body)

    // Temporarily return mock data until database is set up
    const business = {
      id: 'temp-id',
      ...validatedData,
      verificationBadge: false,
      trustScore: 0.0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      business
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating business:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid input data',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create business',
      error: (error as Error).message
    }, { status: 500 })
  }
}
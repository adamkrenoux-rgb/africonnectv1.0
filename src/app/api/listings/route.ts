import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createListingSchema = z.object({
  businessId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  pricing: z.number().positive(),
  duration: z.string().min(1),
  activityType: z.string().min(1),
  tags: z.array(z.string()).default([]),
  maxCapacity: z.number().positive().optional(),
  availability: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const country = searchParams.get('country')
    const activityType = searchParams.get('activityType')
    const verified = searchParams.get('verified')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const where: any = {}
    
    if (businessId) where.businessId = businessId
    if (activityType) where.activityType = activityType
    if (verified === 'true') where.verified = true
    if (minPrice || maxPrice) {
      where.pricing = {}
      if (minPrice) where.pricing.gte = parseFloat(minPrice)
      if (maxPrice) where.pricing.lte = parseFloat(maxPrice)
    }

    // If filtering by country, we need to join with business
    if (country) {
      where.business = {
        country: country
      }
    }

    // Temporarily return empty array until database is set up
    const listings: any[] = []

    return NextResponse.json({
      success: true,
      listings
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch listings',
      error: (error as Error).message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createListingSchema.parse(body)

    // Temporarily return mock data until database is set up
    const listing = {
      id: 'temp-id',
      ...validatedData,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      listing
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid input data',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create listing',
      error: (error as Error).message
    }, { status: 500 })
  }
}
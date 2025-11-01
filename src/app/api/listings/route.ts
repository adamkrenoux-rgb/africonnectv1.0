import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, createListingSchema } from '@/lib/validation'

// GET /api/listings - Get all listings with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const verified = searchParams.get('verified')
    const activityType = searchParams.get('activityType')
    const businessId = searchParams.get('businessId')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')

    const where: any = {}
    if (verified) where.verified = verified === 'true'
    if (activityType) where.activityType = activityType
    if (businessId) where.businessId = businessId
    if (search) {
      const sanitizedSearch = search.trim().slice(0, 100) // Limit search length
      where.OR = [
        { title: { contains: sanitizedSearch, mode: 'insensitive' } },
        { description: { contains: sanitizedSearch, mode: 'insensitive' } }
      ]
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        business: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          }
        },
        bookings: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: Math.min(parseInt(limit) || 100, 100) }) // Max 100 items
    })

    // Calculate stats for each listing
    const listingsWithStats = listings.map(listing => {
      const businessRating = listing.business.reviews.length > 0
        ? listing.business.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.business.reviews.length
        : 0
      
      return {
        ...listing,
        businessRating: Math.round(businessRating * 10) / 10,
        bookingCount: listing.bookings.length
      }
    })

    return NextResponse.json({ success: true, listings: listingsWithStats }, { status: 200 })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = await validateRequest(createListingSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const data = validation.data

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: data.businessId }
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        businessId: data.businessId,
        title: data.title.trim(),
        description: data.description.trim(),
        pricing: data.pricing,
        duration: data.duration.trim(),
        activityType: data.activityType,
        tags: data.tags || [],
        maxCapacity: data.maxCapacity || 1,
        availability: data.availability || null,
        verified: business.verificationBadge // Auto-verify if business is verified
      },
      include: {
        business: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ success: true, listing }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating listing:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Listing with this information already exists' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { success: false, error: 'Invalid business reference' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create listing',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}


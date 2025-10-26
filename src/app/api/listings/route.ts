import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
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
      ...(limit && { take: parseInt(limit) })
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
    const {
      businessId,
      title,
      description,
      pricing,
      duration,
      activityType,
      tags,
      maxCapacity,
      availability
    } = body

    // Validate required fields
    if (!businessId || !title || !description || !pricing || !duration || !activityType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId }
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
        businessId,
        title,
        description,
        pricing,
        duration,
        activityType,
        tags: tags || [],
        maxCapacity: maxCapacity || 1,
        availability,
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
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}


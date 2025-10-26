import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/businesses - Get all businesses with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const verified = searchParams.get('verified')
    const country = searchParams.get('country')
    const businessType = searchParams.get('type')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (verified) where.verificationBadge = verified === 'true'
    if (country) where.country = country
    if (businessType) where.businessType = businessType

    const businesses = await prisma.business.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true
          }
        },
        listings: {
          select: {
            id: true,
            title: true,
            pricing: true,
            verified: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: parseInt(limit) })
    })

    // Calculate average ratings
    const businessesWithRatings = businesses.map(business => {
      const avgRating = business.reviews.length > 0
        ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
        : 0
      
      return {
        ...business,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: business.reviews.length
      }
    })

    return NextResponse.json({ success: true, businesses: businessesWithRatings }, { status: 200 })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}

// POST /api/businesses - Create a new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      businessName,
      description,
      location,
      city,
      country,
      coordinates,
      businessType,
      website,
      phone,
      email
    } = body

    // Validate required fields
    if (!userId || !businessName || !description || !location || !city || !country || !businessType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create business
    const business = await prisma.business.create({
      data: {
        userId,
        businessName,
        description,
        location,
        city,
        country,
        coordinates,
        businessType,
        website,
        phone,
        email
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, business }, { status: 201 })
  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create business' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, createBusinessSchema } from '@/lib/validation'
import { Prisma } from '@prisma/client'

// GET /api/businesses - Get all businesses with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const verified = searchParams.get('verified')
    const country = searchParams.get('country')
    const businessType = searchParams.get('type')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')

    // Validate and sanitize inputs
    const where: any = {}
    if (verified) {
      const verifiedValue = verified === 'true'
      where.verificationBadge = verifiedValue
    }
    if (country) {
      where.country = country.trim()
    }
    if (businessType) {
      where.businessType = businessType.trim().toUpperCase()
    }
    if (search) {
      const sanitizedSearch = search.trim().slice(0, 100)
      where.OR = [
        { businessName: { contains: sanitizedSearch, mode: 'insensitive' } },
        { description: { contains: sanitizedSearch, mode: 'insensitive' } },
        { location: { contains: sanitizedSearch, mode: 'insensitive' } },
        { city: { contains: sanitizedSearch, mode: 'insensitive' } },
        { country: { contains: sanitizedSearch, mode: 'insensitive' } }
      ]
    }

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
      ...(limit && { take: Math.min(parseInt(limit) || 100, 100) }) // Max 100 items
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

    // Validate request body
    const validation = await validateRequest(createBusinessSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const data = validation.data

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user already has a business (optional: allow multiple businesses)
    // For now, we'll allow multiple businesses per user

    // Create business
    const business = await prisma.business.create({
      data: {
        userId: data.userId,
        businessName: data.businessName.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        city: data.city.trim(),
        country: data.country.trim(),
        ...(data.coordinates && Array.isArray(data.coordinates) && { coordinates: data.coordinates as Prisma.InputJsonValue }),
        businessType: data.businessType,
        website: data.website || null,
        phone: data.phone || null,
        email: data.email || null
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
  } catch (error: any) {
    console.error('Error creating business:', error)
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Business with this information already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create business',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}


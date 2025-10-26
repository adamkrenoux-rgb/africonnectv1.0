import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/applications - Get all applications with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const campaignId = searchParams.get('campaignId')
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (campaignId) where.campaignId = campaignId
    if (businessId) where.businessId = businessId
    if (status) where.status = status

    const applications = await prisma.application.findMany({
      where,
      include: {
        campaign: {
          include: {
            influencer: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true
              }
            }
          }
        },
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: parseInt(limit) })
    })

    // Add business ratings
    const applicationsWithRatings = applications.map(app => {
      const avgRating = app.business.reviews.length > 0
        ? app.business.reviews.reduce((sum, review) => sum + review.rating, 0) / app.business.reviews.length
        : 0
      
      return {
        ...app,
        business: {
          ...app.business,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: app.business.reviews.length
        }
      }
    })

    return NextResponse.json({ success: true, applications: applicationsWithRatings }, { status: 200 })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST /api/applications - Create a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      campaignId,
      businessId,
      proposalText,
      contentSamples,
      proposedPrice
    } = body

    // Validate required fields
    if (!campaignId || !businessId || !proposalText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify campaign exists and is open
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (campaign.status !== 'OPEN') {
      return NextResponse.json(
        { success: false, error: 'Campaign is not accepting applications' },
        { status: 400 }
      )
    }

    // Check if business already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        campaignId,
        businessId
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this campaign' },
        { status: 409 }
      )
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        campaignId,
        businessId,
        proposalText,
        contentSamples,
        proposedPrice,
        status: 'PENDING'
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            influencer: {
              select: {
                id: true,
                name: true
              }
            }
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

    return NextResponse.json({ success: true, application }, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    )
  }
}


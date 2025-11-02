import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, createApplicationSchema } from '@/lib/validation'
import { sendEmail, emailTemplates } from '@/lib/email'

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

    // Validate request body
    const validation = await validateRequest(createApplicationSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const {
      campaignId,
      businessId,
      proposalText,
      contentSamples,
      proposedPrice
    } = validation.data

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

    // Get influencer email for notification
    const influencer = await prisma.user.findUnique({
      where: { id: campaign.influencerId },
      select: { email: true, name: true }
    })

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

    // Send email notification to influencer
    if (influencer?.email) {
      const emailResult = await sendEmail({
        to: influencer.email,
        ...emailTemplates.campaignApplication({
          businessName: application.business.businessName,
          campaignTitle: application.campaign.title,
          influencerName: influencer.name || 'Influencer',
          proposalText: proposalText || 'No proposal provided'
        })
      })
      
      if (!emailResult.success) {
        console.error('Failed to send application notification email:', emailResult.error)
        // Don't fail application creation if email fails
      }
    }

    return NextResponse.json({ success: true, application }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating application:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Application already exists' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign or business reference' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create application',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequest, createCampaignSchema } from '@/lib/validation'

// GET /api/campaigns - Get all campaigns with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const influencerId = searchParams.get('influencerId')
    const status = searchParams.get('status')
    const region = searchParams.get('region')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (influencerId) where.influencerId = influencerId
    if (status) where.status = status
    if (region) {
      where.targetRegion = {
        has: region
      }
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        influencer: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            role: true
          }
        },
        applications: {
          include: {
            business: {
              select: {
                id: true,
                businessName: true,
                verificationBadge: true
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

    // Add stats to each campaign
    const campaignsWithStats = campaigns.map(campaign => ({
      ...campaign,
      applicationCount: campaign.applications.length,
      pendingApplications: campaign.applications.filter(app => app.status === 'PENDING').length
    }))

    return NextResponse.json({ success: true, campaigns: campaignsWithStats }, { status: 200 })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = await validateRequest(createCampaignSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const {
      influencerId,
      title,
      description,
      targetRegion,
      deliverables,
      audienceDemographics,
      collaborationTerms,
      status
    } = validation.data

    // Verify user is an influencer
    const user = await prisma.user.findUnique({
      where: { id: influencerId }
    })

    if (!user || user.role !== 'INFLUENCER') {
      return NextResponse.json(
        { success: false, error: 'Only influencers can create campaigns' },
        { status: 403 }
      )
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        influencerId,
        title,
        description,
        targetRegion: Array.isArray(targetRegion) ? targetRegion : [targetRegion],
        deliverables,
        audienceDemographics: audienceDemographics || {},
        collaborationTerms,
        status: status || 'DRAFT'
      },
      include: {
        influencer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, campaign }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating campaign:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Campaign with this information already exists' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { success: false, error: 'Invalid influencer reference' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create campaign',
        ...(process.env.NODE_ENV === 'development' && { details: error })
      },
      { status: 500 }
    )
  }
}


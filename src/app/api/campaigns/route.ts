import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCampaignSchema = z.object({
  influencerId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  targetRegion: z.string().min(1),
  deliverables: z.record(z.any()), // JSON object
  audienceDemographics: z.record(z.any()), // JSON object
  collaborationTerms: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const influencerId = searchParams.get('influencerId')
    const targetRegion = searchParams.get('targetRegion')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (influencerId) where.influencerId = influencerId
    if (targetRegion) where.targetRegion = targetRegion
    if (status) where.status = status

    // Mock campaigns for demonstration
    const campaigns = [
      {
        id: 'campaign-1',
        title: 'Luxury Safari Experience Campaign',
        description: 'Showcase our premium safari packages to luxury travelers',
        targetRegion: 'East Africa',
        status: 'OPEN',
        influencer: {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          verificationStatus: 'VERIFIED'
        },
        applications: [],
        _count: {
          applications: 0
        },
        createdAt: new Date()
      },
      {
        id: 'campaign-2',
        title: 'Adventure Tourism Promotion',
        description: 'Highlight mountain climbing and outdoor activities',
        targetRegion: 'Southern Africa',
        status: 'OPEN',
        influencer: {
          name: 'Mike Chen',
          email: 'mike@example.com',
          verificationStatus: 'VERIFIED'
        },
        applications: [],
        _count: {
          applications: 0
        },
        createdAt: new Date()
      }
    ]

    return NextResponse.json({
      success: true,
      campaigns
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch campaigns',
      error: (error as Error).message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCampaignSchema.parse(body)

    // Temporarily return mock data until database is set up
    const campaign = {
      id: 'temp-id',
      ...validatedData,
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      data: {
        ...validatedData,
        status: 'OPEN',
      },
      include: {
        influencer: {
          select: {
            name: true,
            email: true,
            verificationStatus: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      campaign
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid input data',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create campaign',
      error: (error as Error).message
    }, { status: 500 })
  }
}
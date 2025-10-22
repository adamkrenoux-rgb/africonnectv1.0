import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createApplicationSchema = z.object({
  campaignId: z.string(),
  businessId: z.string(),
  proposalText: z.string().min(1),
  contentSamples: z.record(z.any()).optional(), // JSON object
  aiInsights: z.record(z.any()).optional(), // JSON object
  proposedPrice: z.number().positive().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (campaignId) where.campaignId = campaignId
    if (businessId) where.businessId = businessId
    if (status) where.status = status

    // Temporarily return empty array until database is set up
    const applications = []
      where,
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            description: true,
            targetRegion: true,
            status: true,
            influencer: {
              select: {
                name: true,
                email: true,
                verificationStatus: true,
              }
            }
          }
        },
        business: {
          select: {
            id: true,
            businessName: true,
            location: true,
            city: true,
            country: true,
            businessType: true,
            verificationBadge: true,
            trustScore: true,
            user: {
              select: {
                name: true,
                verificationStatus: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      applications
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch applications',
      error: (error as Error).message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createApplicationSchema.parse(body)

    // Temporarily return mock data until database is set up
    const application = {
      id: 'temp-id',
      ...validatedData,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      data: {
        ...validatedData,
        status: 'PENDING',
      },
      include: {
        campaign: {
          select: {
            title: true,
            description: true,
            targetRegion: true,
            influencer: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        },
        business: {
          select: {
            businessName: true,
            location: true,
            city: true,
            country: true,
            businessType: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      application
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid input data',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create application',
      error: (error as Error).message
    }, { status: 500 })
  }
}
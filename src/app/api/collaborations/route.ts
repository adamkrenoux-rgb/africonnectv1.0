import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {
      OR: [
        { campaign: { influencerId: userId } },
        { application: { business: { userId } } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    const collaborations = await prisma.collaboration.findMany({
      where,
      include: {
        campaign: {
          include: {
            influencer: {
              select: {
                name: true,
                profileImage: true
              }
            }
          }
        },
        application: {
          include: {
            business: {
              include: {
                user: {
                  select: {
                    name: true,
                    profileImage: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: collaborations })
  } catch (error) {
    console.error('Error fetching collaborations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { applicationId, agreedPrice, deliverables, timeline } = body

    // Get application details
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        campaign: true,
        business: true
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Verify user is the influencer
    if (application.campaign.influencerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create collaboration
    const collaboration = await prisma.collaboration.create({
      data: {
        applicationId,
        campaignId: application.campaignId,
        businessId: application.businessId,
        agreedPrice,
        deliverables,
        timeline,
        status: 'PENDING_PAYMENT'
      },
      include: {
        campaign: {
          include: {
            influencer: {
              select: {
                name: true,
                profileImage: true
              }
            }
          }
        },
        application: {
          include: {
            business: {
              include: {
                user: {
                  select: {
                    name: true,
                    profileImage: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Update application status
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'ACCEPTED' }
    })

    return NextResponse.json({ success: true, data: collaboration })
  } catch (error) {
    console.error('Error creating collaboration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


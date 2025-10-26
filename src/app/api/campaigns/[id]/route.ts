import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/campaigns/[id] - Get a specific campaign
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        influencer: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            bio: true
          }
        },
        applications: {
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
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Add stats
    const campaignWithStats = {
      ...campaign,
      applicationCount: campaign.applications.length,
      pendingApplications: campaign.applications.filter(app => app.status === 'PENDING').length,
      acceptedApplications: campaign.applications.filter(app => app.status === 'ACCEPTED').length
    }

    return NextResponse.json({ success: true, campaign: campaignWithStats }, { status: 200 })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}

// PATCH /api/campaigns/[id] - Update a specific campaign
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      targetRegion,
      deliverables,
      audienceDemographics,
      collaborationTerms,
      status
    } = body

    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(targetRegion && { targetRegion }),
        ...(deliverables && { deliverables }),
        ...(audienceDemographics && { audienceDemographics }),
        ...(collaborationTerms !== undefined && { collaborationTerms }),
        ...(status && { status })
      },
      include: {
        influencer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, campaign }, { status: 200 })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

// DELETE /api/campaigns/[id] - Delete a specific campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        applications: {
          where: {
            status: 'ACCEPTED'
          }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Don't allow deletion if there are accepted applications
    if (campaign.applications.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete campaign with accepted applications' },
        { status: 400 }
      )
    }

    await prisma.campaign.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { success: true, message: 'Campaign deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}


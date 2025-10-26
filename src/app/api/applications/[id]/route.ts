import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/applications/[id] - Get a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        campaign: {
          include: {
            influencer: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
                bio: true
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
            listings: {
              take: 5,
              orderBy: {
                createdAt: 'desc'
              }
            },
            reviews: true
          }
        }
      }
    })

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    // Calculate business rating
    const avgRating = application.business.reviews.length > 0
      ? application.business.reviews.reduce((sum, review) => sum + review.rating, 0) / application.business.reviews.length
      : 0

    return NextResponse.json({
      success: true,
      application: {
        ...application,
        business: {
          ...application.business,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: application.business.reviews.length
        }
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

// PATCH /api/applications/[id] - Update application status or details
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, aiInsights, proposalText, proposedPrice } = body

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(aiInsights && { aiInsights }),
        ...(proposalText && { proposalText }),
        ...(proposedPrice && { proposedPrice })
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true
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

    // If application is accepted, update campaign status if needed
    if (status === 'ACCEPTED') {
      const campaign = await prisma.campaign.findUnique({
        where: { id: application.campaignId }
      })

      if (campaign && campaign.status === 'OPEN') {
        await prisma.campaign.update({
          where: { id: application.campaignId },
          data: { status: 'IN_PROGRESS' }
        })
      }
    }

    return NextResponse.json({ success: true, application }, { status: 200 })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE /api/applications/[id] - Withdraw an application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id }
    })

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    // Only pending applications can be withdrawn
    if (application.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Can only withdraw pending applications' },
        { status: 400 }
      )
    }

    await prisma.application.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { success: true, message: 'Application withdrawn successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to withdraw application' },
      { status: 500 }
    )
  }
}


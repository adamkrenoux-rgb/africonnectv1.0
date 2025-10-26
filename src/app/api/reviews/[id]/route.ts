import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reviews/[id] - Get a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        traveler: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            country: true
          }
        },
        business: {
          select: {
            id: true,
            businessName: true,
            verificationBadge: true
          }
        },
        booking: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                description: true
              }
            }
          }
        }
      }
    })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, review }, { status: 200 })
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

// PATCH /api/reviews/[id] - Update review or add business response
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { comment, rating, response } = body

    // Get existing review
    const existingReview = await prisma.review.findUnique({
      where: { id: params.id }
    })

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...(comment !== undefined && { comment }),
        ...(rating && { rating }),
        ...(response !== undefined && { response })
      },
      include: {
        traveler: {
          select: {
            id: true,
            name: true
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

    // Recalculate trust score if rating changed
    if (rating && rating !== existingReview.rating) {
      const allReviews = await prisma.review.findMany({
        where: { businessId: review.businessId }
      })

      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      const trustScore = (avgRating / 5) * 100

      await prisma.business.update({
        where: { id: review.businessId },
        data: { trustScore }
      })
    }

    return NextResponse.json({ success: true, review }, { status: 200 })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: params.id }
    })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    await prisma.review.delete({
      where: { id: params.id }
    })

    // Recalculate trust score
    const allReviews = await prisma.review.findMany({
      where: { businessId: review.businessId }
    })

    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      const trustScore = (avgRating / 5) * 100

      await prisma.business.update({
        where: { id: review.businessId },
        data: { trustScore }
      })
    } else {
      await prisma.business.update({
        where: { id: review.businessId },
        data: { trustScore: 0 }
      })
    }

    return NextResponse.json(
      { success: true, message: 'Review deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}


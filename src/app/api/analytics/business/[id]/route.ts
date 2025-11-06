import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

// GET /api/analytics/business/[id] - Get analytics for a business
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify business belongs to user
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        listings: {
          include: {
            bookings: {
              select: {
                id: true,
                status: true,
                totalAmount: true,
                createdAt: true
              }
            }
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            createdAt: true
          }
        }
      }
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    if (business.userId !== dbUser.id && dbUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const timeRange = searchParams.get('range') || '30days'
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    switch (timeRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7)
        break
      case '30days':
        startDate.setDate(now.getDate() - 30)
        break
      case '90days':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get bookings in time range
    const bookings = business.listings.flatMap(listing => 
      listing.bookings.filter(booking => 
        new Date(booking.createdAt) >= startDate
      )
    )

    // Calculate metrics
    const totalBookings = bookings.length
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length
    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    const commission = totalRevenue * 0.15
    const netRevenue = totalRevenue - commission

    // Get inquiries (from inquiries API - you'd need to track these)
    // For now, we'll estimate based on bookings
    const inquiries = totalBookings * 2 // Rough estimate

    // Get reviews in time range
    const recentReviews = business.reviews.filter(
      review => new Date(review.createdAt) >= startDate
    )
    const averageRating = recentReviews.length > 0
      ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length
      : 0

    // Calculate conversion rate (bookings / inquiries)
    const conversionRate = inquiries > 0 ? (totalBookings / inquiries) * 100 : 0

    // Get listing views (would need tracking - for now estimate)
    const listingViews = business.listings.length * 50 // Rough estimate

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalBookings,
          confirmedBookings,
          totalRevenue,
          commission,
          netRevenue,
          inquiries,
          conversionRate: Math.round(conversionRate * 10) / 10,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: recentReviews.length,
          listingViews
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: bookings.filter(b => b.status === 'PENDING').length,
          completed: bookings.filter(b => b.status === 'COMPLETED').length,
          cancelled: bookings.filter(b => b.status === 'CANCELLED').length
        },
        revenue: {
          total: totalRevenue,
          commission,
          net: netRevenue,
          averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0
        },
        engagement: {
          inquiries,
          conversionRate: Math.round(conversionRate * 10) / 10,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: recentReviews.length
        },
        listings: business.listings.map(listing => ({
          id: listing.id,
          title: listing.title,
          bookings: listing.bookings.length,
          revenue: listing.bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
        }))
      }
    })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}


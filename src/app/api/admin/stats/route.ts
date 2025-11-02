import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (you can add role check here)
    const clerkUser = await currentUser()
    
    // TODO: Add proper admin role check
    // For now, allow access (in production, check user.role === 'ADMIN')
    
    // Get all stats from database
    const [
      totalUsers,
      totalBusinesses,
      totalListings,
      totalBookings,
      totalCampaigns,
      pendingVerifications,
      recentBookings,
      pendingVerificationsList,
      totalRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.listing.count(),
      prisma.booking.count(),
      prisma.campaign.count({
        where: { status: 'OPEN' }
      }),
      prisma.verification.count({
        where: { status: 'PENDING' }
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            select: { title: true }
          },
          traveler: {
            select: { name: true, email: true }
          },
          business: {
            select: { businessName: true }
          }
        }
      }),
      prisma.verification.findMany({
        where: { status: 'PENDING' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          business: {
            select: {
              id: true,
              businessName: true,
              city: true,
              country: true,
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }),
      prisma.booking.aggregate({
        where: {
          paymentStatus: { in: ['HELD_IN_ESCROW', 'COMPLETED'] }
        },
        _sum: {
          totalAmount: true,
          commission: true
        }
      })
    ])

    // Calculate revenue
    const revenue = totalRevenue._sum.totalAmount || 0
    const platformCommission = totalRevenue._sum.commission || 0

    // Get user counts by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    })

    // Get bookings by status
    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    // Get businesses by verification status
    const businessesByVerification = await prisma.business.groupBy({
      by: ['verificationBadge'],
      _count: {
        verificationBadge: true
      }
    })

    const stats = {
      totalUsers,
      totalBusinesses,
      totalListings,
      totalBookings,
      totalCampaigns,
      pendingVerifications,
      revenue: {
        total: revenue,
        commission: platformCommission,
        net: revenue - platformCommission
      },
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role
        return acc
      }, {} as Record<string, number>),
      bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>),
      verifiedBusinesses: businessesByVerification.find(b => b.verificationBadge)?._count.verificationBadge || 0,
      unverifiedBusinesses: businessesByVerification.find(b => !b.verificationBadge)?._count.verificationBadge || 0,
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        listingTitle: booking.listing?.title || 'N/A',
        travelerName: booking.traveler?.name || 'Unknown',
        travelerEmail: booking.traveler?.email || '',
        businessName: booking.business?.businessName || 'N/A',
        amount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt
      })),
      pendingVerificationsList: pendingVerificationsList.map(verification => ({
        id: verification.id,
        businessId: verification.businessId,
        businessName: verification.business.businessName,
        city: verification.business.city,
        country: verification.business.country,
        ownerName: verification.business.user?.name || 'Unknown',
        ownerEmail: verification.business.user?.email || '',
        status: verification.status,
        submittedAt: verification.createdAt
      }))
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
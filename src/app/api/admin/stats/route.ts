import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get platform statistics
    const [
      totalUsers,
      totalBusinesses,
      totalBookings,
      totalRevenue,
      pendingVerifications,
      activeCampaigns,
      recentBookings,
      pendingVerificationsList
    ] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.verification.count({
        where: { verificationStatus: 'PENDING' }
      }),
      prisma.campaign.count({
        where: { status: 'OPEN' }
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            select: { title: true }
          },
          business: {
            select: { businessName: true }
          }
        }
      }),
      prisma.verification.findMany({
        where: { verificationStatus: 'PENDING' },
        include: {
          business: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    const stats = {
      totalUsers,
      totalBusinesses,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingVerifications,
      activeCampaigns,
      recentBookings,
      pendingVerificationsList
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


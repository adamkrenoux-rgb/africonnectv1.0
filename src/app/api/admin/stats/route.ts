import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock admin stats for demo
    const stats = {
      totalUsers: 0,
      totalBusinesses: 0,
      totalBookings: 0,
      totalRevenue: 0,
      pendingVerifications: 0,
      activeCampaigns: 0,
      recentBookings: [],
      pendingVerificationsList: []
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
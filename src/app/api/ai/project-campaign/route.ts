import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, businessId } = body

    // Mock campaign projection for demo
    const projection = {
      estimatedReach: 10000,
      engagementRate: 0.05,
      clickThroughRate: 0.02,
      conversionRate: 0.01,
      estimatedConversions: 2,
      recommendedPrice: 500,
      roi: 2.5,
      nicheMatch: 0.85,
      audienceAlignment: 0.78
    }

    return NextResponse.json({ success: true, data: projection })
  } catch (error) {
    console.error('Error generating campaign projection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
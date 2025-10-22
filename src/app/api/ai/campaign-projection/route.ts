import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { influencerData, businessData } = await request.json()
    
    // Only process verified influencers and businesses
    if (!influencerData.verified || !businessData.verified) {
      return NextResponse.json({
        success: false,
        message: 'No verified results match your search. Only verified influencers and businesses are used for campaign projections.'
      })
    }
    
    // Campaign Projection Formula: Reach x CTR x Conversion Rate
    const calculateCampaignProjection = (influencer: any, business: any) => {
      // Influencer metrics
      const reach = influencer.followerCount || 0
      const engagementRate = influencer.engagementRate || 0.03 // Default 3%
      const avgViews = Math.round(reach * engagementRate)
      
      // CTR (Click-Through Rate) - industry average for travel content
      const ctr = influencer.ctr || 0.05 // Default 5% for travel content
      
      // Business conversion rate from analytics
      const conversionRate = business.conversionRate || 0.02 // Default 2%
      
      // Calculate projections
      const projectedClicks = Math.round(avgViews * ctr)
      const projectedConversions = Math.round(projectedClicks * conversionRate)
      
      // Calculate ROI
      const avgBookingValue = business.avgBookingValue || 500
      const projectedRevenue = projectedConversions * avgBookingValue
      
      // Fair collaboration price (typically 5-10% of projected revenue)
      const collaborationPrice = Math.round(projectedRevenue * 0.07)
      
      return {
        reach: avgViews,
        projectedClicks,
        projectedConversions,
        projectedRevenue,
        collaborationPrice,
        metrics: {
          reach,
          engagementRate: (engagementRate * 100).toFixed(1) + '%',
          ctr: (ctr * 100).toFixed(1) + '%',
          conversionRate: (conversionRate * 100).toFixed(1) + '%'
        }
      }
    }
    
    const projection = calculateCampaignProjection(influencerData, businessData)
    
    return NextResponse.json({
      success: true,
      projection
    })
  } catch (error) {
    console.error('Error calculating campaign projection:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate campaign projection' },
      { status: 500 }
    )
  }
}

// Business data seeding for AI itinerary generation
// This would be replaced with actual database queries in production

export const seedBusinessData = {
  // No business listings yet - will be populated when real businesses create listings
  listings: [],

  // No business analytics yet - will be populated when real businesses have activity
  businessAnalytics: [],

  // No influencers yet - will be populated when real influencers join the platform
  influencers: []
}

// Function to get verified business data for AI itinerary generation
export const getBusinessDataForAI = (destination: string, businessType?: string) => {
  return seedBusinessData.listings.filter(listing => 
    listing.location === destination && 
    (!businessType || listing.businessType === businessType) &&
    listing.verified === true
  )
}

// Function to get verified analytics data for a business
export const getBusinessAnalytics = (businessId: string) => {
  const analytics = seedBusinessData.businessAnalytics.find(analytics => 
    analytics.businessId === businessId
  )
  
  // Only return analytics for verified businesses
  if (!analytics || !analytics.verified) {
    return null
  }
  
  return analytics
}

// Function to get verified influencer data for campaign projections
export const getInfluencerData = (influencerId: string) => {
  const influencer = seedBusinessData.influencers.find(influencer => 
    influencer.id === influencerId
  )
  
  // Only return verified influencers
  if (!influencer || !influencer.verified) {
    return null
  }
  
  return influencer
}

// Function to calculate campaign projection using the formula (verified only)
export const calculateCampaignProjection = (influencer: any, business: any) => {
  // Only calculate for verified influencers and businesses
  if (!influencer.verified || !business.verified) {
    return {
      error: 'No verified results match your search. Only verified influencers and businesses are used for campaign projections.'
    }
  }
  
  // Formula: Reach x CTR x Conversion Rate
  const reach = influencer.followerCount * influencer.engagementRate
  const projectedClicks = Math.round(reach * influencer.ctr)
  const projectedConversions = Math.round(projectedClicks * (business.conversionRate / 100))
  const projectedRevenue = projectedConversions * business.avgBookingValue
  const collaborationPrice = Math.round(projectedRevenue * 0.07) // 7% of projected revenue
  
  return {
    reach: Math.round(reach),
    projectedClicks,
    projectedConversions,
    projectedRevenue,
    collaborationPrice,
    metrics: {
      reach: influencer.followerCount,
      engagementRate: (influencer.engagementRate * 100).toFixed(1) + '%',
      ctr: (influencer.ctr * 100).toFixed(1) + '%',
      conversionRate: business.conversionRate.toFixed(1) + '%'
    }
  }
}

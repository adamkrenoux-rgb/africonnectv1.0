import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { campaignId, businessId } = body

    // Get campaign and business data
    const [campaign, business] = await Promise.all([
      prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          influencer: true
        }
      }),
      prisma.business.findUnique({
        where: { id: businessId },
        include: {
          listings: true,
          reviews: true
        }
      })
    ])

    if (!campaign || !business) {
      return NextResponse.json({ error: 'Campaign or business not found' }, { status: 404 })
    }

    // Call AI service for campaign projection
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000'
    
    const response = await fetch(`${aiServiceUrl}/project-campaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        influencerMetrics: {
          followers: 50000, // Mock data - would come from social media API
          engagementRate: 0.05,
          niche: ['travel', 'adventure'],
          geography: campaign.targetRegion
        },
        businessProfile: {
          businessType: business.businessType,
          trustScore: business.trustScore,
          verificationBadge: business.verificationBadge,
          averageRating: business.reviews.length > 0 
            ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
            : 0,
          nicheMatch: calculateNicheMatch(campaign, business)
        },
        campaignDetails: {
          deliverables: campaign.deliverables,
          targetRegion: campaign.targetRegion,
          collaborationTerms: campaign.collaborationTerms,
          contentQuality: 0.8, // Mock quality score
          marketDemand: 0.7 // Mock market demand
        }
      })
    })

    if (!response.ok) {
      throw new Error('AI service error')
    }

    const projection = await response.json()

    // Store AI analysis
    await prisma.aIAnalysis.create({
      data: {
        entityType: 'CAMPAIGN_PROJECTION',
        entityId: campaignId,
        inputData: { campaignId, businessId },
        outputData: projection,
        modelUsed: 'campaign-projection-v1'
      }
    })

    return NextResponse.json({ success: true, data: projection })
  } catch (error) {
    console.error('Error generating campaign projection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateNicheMatch(campaign: any, business: any) {
  // Simple niche matching algorithm
  const campaignInterests = campaign.audienceDemographics?.interests || []
  const businessType = business.businessType.toLowerCase()
  
  const interestMatches = {
    'Wildlife & Safari': ['safari', 'wildlife'],
    'Adventure Sports': ['adventure'],
    'Culture & Heritage': ['culture', 'heritage'],
    'Beach & Coastal': ['beach', 'coastal'],
    'Photography': ['photography'],
    'Culinary': ['culinary', 'food']
  }

  let matchScore = 0
  for (const interest of campaignInterests) {
    if (interestMatches[interest]) {
      for (const keyword of interestMatches[interest]) {
        if (businessType.includes(keyword)) {
          matchScore += 0.2
        }
      }
    }
  }

  return Math.min(matchScore, 1.0)
}


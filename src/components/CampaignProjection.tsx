'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CampaignProjectionProps {
  campaignId: string
  businessId: string
  onAccept?: () => void
  onReject?: () => void
}

interface ProjectionData {
  predictedReach: number
  engagementRate: number
  estimatedBookings: {
    min: number
    max: number
  }
  recommendedPrice: {
    min: number
    max: number
    currency: string
  }
  confidence: number
  factors: {
    influencerEngagement: number
    audienceMatch: number
    contentQuality: number
    marketDemand: number
  }
}

export default function CampaignProjection({ campaignId, businessId, onAccept, onReject }: CampaignProjectionProps) {
  const [projection, setProjection] = useState<ProjectionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    generateProjection()
  }, [campaignId, businessId])

  const generateProjection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/project-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId, businessId }),
      })

      if (response.ok) {
        const data = await response.json()
        setProjection(data.data)
      }
    } catch (error) {
      console.error('Error generating projection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-africa-earth mx-auto mb-4"></div>
          <p>Generating AI projection...</p>
        </CardContent>
      </Card>
    )
  }

  if (!projection) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Unable to generate projection</p>
          <Button onClick={generateProjection} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Projection Header */}
      <Card className="border-africa-earth/20 bg-africa-earth/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🤖</span>
            <span>AI Campaign Projection</span>
            <span className="text-sm font-normal text-gray-600">
              ({Math.round(projection.confidence * 100)}% confidence)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Our AI has analyzed this collaboration and generated performance predictions based on 
            historical data, influencer metrics, and business profile.
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-africa-earth">
              {projection.predictedReach.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Predicted Reach</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-africa-earth">
              {(projection.engagementRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Engagement Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-africa-earth">
              {projection.estimatedBookings.min}-{projection.estimatedBookings.max}
            </div>
            <div className="text-sm text-gray-600">Estimated Bookings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-africa-earth">
              ${projection.recommendedPrice.min}-${projection.recommendedPrice.max}
            </div>
            <div className="text-sm text-gray-600">Recommended Price</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Influencer Engagement</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(projection.factors.influencerEngagement * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-africa-earth h-2 rounded-full" 
                    style={{ width: `${projection.factors.influencerEngagement * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Audience Match</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(projection.factors.audienceMatch * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-africa-earth h-2 rounded-full" 
                    style={{ width: `${projection.factors.audienceMatch * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Content Quality</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(projection.factors.contentQuality * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-africa-earth h-2 rounded-full" 
                    style={{ width: `${projection.factors.contentQuality * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Market Demand</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(projection.factors.marketDemand * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-africa-earth h-2 rounded-full" 
                    style={{ width: `${projection.factors.marketDemand * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">💰 Revenue Potential</h4>
                <div className="text-green-700 text-sm space-y-1">
                  <p>Estimated bookings: {projection.estimatedBookings.min}-{projection.estimatedBookings.max}</p>
                  <p>Average booking value: $500-800</p>
                  <p>Total revenue potential: $2,500-6,400</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Campaign Metrics</h4>
                <div className="text-blue-700 text-sm space-y-1">
                  <p>Expected reach: {projection.predictedReach.toLocaleString()} people</p>
                  <p>Engagement rate: {(projection.engagementRate * 100).toFixed(1)}%</p>
                  <p>Cost per reach: ${(projection.recommendedPrice.min / projection.predictedReach * 1000).toFixed(2)} per 1K</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Risk Factors</h4>
                <div className="text-yellow-700 text-sm space-y-1">
                  <p>• Market demand: {projection.factors.marketDemand < 0.6 ? 'Low' : 'Good'}</p>
                  <p>• Audience alignment: {projection.factors.audienceMatch < 0.7 ? 'Needs improvement' : 'Strong'}</p>
                  <p>• Content quality: {projection.factors.contentQuality < 0.8 ? 'Could be better' : 'Excellent'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {(onAccept || onReject) && (
        <div className="flex justify-center space-x-4">
          {onReject && (
            <Button variant="outline" onClick={onReject}>
              Decline Collaboration
            </Button>
          )}
          {onAccept && (
            <Button 
              className="bg-africa-earth hover:bg-africa-earth/90"
              onClick={onAccept}
            >
              Accept Collaboration
            </Button>
          )}
        </div>
      )}
    </div>
  )
}


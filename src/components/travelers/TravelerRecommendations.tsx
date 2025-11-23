'use client'

import Link from 'next/link'
import { Compass, Star, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TravelerRecommendationsProps {
  recommendations: any[]
  onRefresh: () => void
  loading?: boolean
}

function RecommendationCard({ recommendation }: { recommendation: any }) {
  const listing = recommendation.listing
  const experience = recommendation.culturalExperience
  const business = recommendation.business || listing?.business || experience?.business
  const tags =
    listing?.tags || experience?.tags || (business?.listings || []).flatMap((item: any) => item.tags || [])

  const href =
    listing ? `/experiences/${listing.id}` : business ? `/businesses/${business.id}` : '/travelers/dashboard'

  return (
    <Link href={href} className="block">
      <Card className="bg-slate-900/70 border-slate-700/60 hover:border-yellow-500/40 transition-colors p-5 h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-yellow-300">
              <Star className="w-3.5 h-3.5" />
              Recommended for you
            </div>
            <h3 className="text-lg font-semibold text-white">
              {listing?.title || experience?.title || business?.businessName || 'Suggested Experience'}
            </h3>
            {business && (
              <p className="text-sm text-slate-300">
                Hosted by <span className="font-medium text-yellow-200">{business.businessName}</span>
                {business.city ? ` • ${business.city}, ${business.country}` : ''}
              </p>
            )}
            {listing?.pricing?.basePrice && (
              <p className="text-sm text-slate-200">
                From{' '}
                <span className="font-semibold text-yellow-300">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: listing.pricing.currency || 'USD',
                    maximumFractionDigits: 0
                  }).format(listing.pricing.basePrice)}
                </span>{' '}
                • {listing.pricing.pricingType?.replace(/_/g, ' ')}
              </p>
            )}
            {recommendation.reason?.text && (
              <p className="text-sm text-slate-300 leading-relaxed">{recommendation.reason.text}</p>
            )}
          </div>
          <div className="shrink-0 p-3 rounded-full bg-yellow-500/10 border border-yellow-400/20">
            <Compass className="w-6 h-6 text-yellow-300" />
          </div>
        </div>
        {tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 6).map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center text-xs bg-slate-800/80 border border-slate-700/80 text-slate-200 px-2.5 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </Card>
    </Link>
  )
}

export function TravelerRecommendations({ recommendations, onRefresh, loading }: TravelerRecommendationsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-yellow-300" />
            Personalized Suggestions
          </h3>
          <p className="text-sm text-slate-300">
            Curated matches aligned with your travel style and preferences.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-slate-600 text-slate-200 hover:bg-slate-800/70"
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <Card className="bg-slate-900/70 border-slate-700/60 p-8 text-center text-slate-300">Loading recommendations...</Card>
      ) : recommendations.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      ) : (
        <Card className="bg-slate-900/70 border-slate-700/60 p-8 text-center text-slate-300">
          <Users className="mx-auto mb-3 w-8 h-8 text-slate-500" />
          <p>No recommendations yet. Launch the smart setup wizard to personalize your journey.</p>
        </Card>
      )}
    </div>
  )
}


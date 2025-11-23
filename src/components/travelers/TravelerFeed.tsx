'use client'

import { Activity, MapPin, Rss } from 'lucide-react'

import { Card } from '@/components/ui/card'

interface TravelerFeedProps {
  items: any[]
  regionLabel?: string
}

export function TravelerFeed({ items, regionLabel }: TravelerFeedProps) {
  return (
    <Card className="bg-slate-900/70 border-slate-700/60 p-6 text-slate-100 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Rss className="w-5 h-5 text-orange-300" />
            Local Pulse
          </h3>
          <p className="text-sm text-slate-300">
            Latest happenings and authentic experiences near {regionLabel || 'you'}.
          </p>
        </div>
      </div>

      {items.length ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-700/60 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <Activity className="w-4 h-4 text-yellow-300" />
                  {item.contentType?.replace(/_/g, ' ') || 'Experience'}
                </div>
                {item.publishAt && (
                  <span className="text-xs text-slate-500">
                    {new Date(item.publishAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
              <h4 className="text-lg font-semibold text-white">{item.title}</h4>
              {item.summary && <p className="text-sm text-slate-300">{item.summary}</p>}
              {item.body && (
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">{item.body}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {item.region && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                    {item.region}
                  </span>
                )}
                {item.relatedListing && (
                  <span className="text-slate-300">
                    Experience: <strong className="text-yellow-200">{item.relatedListing.title}</strong>
                  </span>
                )}
                {item.relatedExperience && (
                  <span className="text-slate-300">
                    Cultural highlight: <strong className="text-yellow-200">{item.relatedExperience.title}</strong>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-300">No updates yet. Follow more regions to unlock local insights.</p>
      )}
    </Card>
  )
}


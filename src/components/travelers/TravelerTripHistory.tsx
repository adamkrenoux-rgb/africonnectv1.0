'use client'

import { CalendarClock, HeartPulse, History, Map } from 'lucide-react'

import { Card } from '@/components/ui/card'

interface TravelerTripHistoryProps {
  history: any[]
}

export function TravelerTripHistory({ history }: TravelerTripHistoryProps) {
  return (
    <Card className="bg-slate-900/70 border-slate-700/60 p-6 text-slate-200 space-y-4">
      <div className="flex items-center gap-2">
        <History className="w-5 h-5 text-teal-300" />
        <h3 className="text-lg font-semibold text-white">Trip Memory Lane</h3>
      </div>
      {history.length ? (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <CalendarClock className="w-3.5 h-3.5 text-yellow-200" />
                  {entry.booking?.bookingDate
                    ? new Date(entry.booking.bookingDate).toLocaleDateString()
                    : 'Date unknown'}
                </span>
                {entry.booking?.listing?.title && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Map className="w-3.5 h-3.5 text-emerald-300" />
                    {entry.booking.listing.title}
                  </span>
                )}
              </div>
              {entry.summary && <p className="text-sm text-slate-200">{entry.summary}</p>}
              {entry.learnings && (
                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-700/60 pt-2">
                  Insights: {Object.values(entry.learnings).join(' • ')}
                </p>
              )}
              {entry.tags?.length ? (
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wide text-slate-400">
                  {entry.tags.map((tag: string) => (
                    <span key={tag} className="bg-slate-800/50 border border-slate-700/60 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <HeartPulse className="w-5 h-5 text-pink-300" />
          No recorded trips yet. Your future adventures will land here.
        </div>
      )}
    </Card>
  )
}


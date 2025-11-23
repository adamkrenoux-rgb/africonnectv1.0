'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Ambulance, MapPinned, Satellite, ShieldCheck } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { safeJsonParse } from '@/lib/api-helpers'

interface SafetyProfile {
  region?: string | null
  cellCoverage?: string | null
  emergencyContacts?: Record<string, string>
  healthAdvisories?: Record<string, string>
  medicalFacilities?: Record<string, string>
  transportationNotes?: string | null
  remotenessLevel?: string | null
  business?: { businessName: string; city?: string | null; country?: string | null }
  listing?: { title: string; activityType?: string }
}

interface TravelerSafetyInsightsProps {
  regionHint?: string | null
  businessId?: string
  listingId?: string
}

export function TravelerSafetyInsights({ regionHint, businessId, listingId }: TravelerSafetyInsightsProps) {
  const [safetyProfiles, setSafetyProfiles] = useState<SafetyProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (businessId) params.set('businessId', businessId)
        if (listingId) params.set('listingId', listingId)
        if (!businessId && !listingId && regionHint) params.set('region', regionHint)

        if (!businessId && !listingId && !regionHint) {
          setSafetyProfiles([])
          setLoading(false)
          return
        }

        const response = await fetch(`/api/safety/insights?${params.toString()}`, {
          credentials: 'include'
        })
        const data = await safeJsonParse<{
          success: boolean
          safety: SafetyProfile | SafetyProfile[]
          error?: string
        }>(response)

        if (!cancelled) {
          if (!data || !data.success) {
            throw new Error(data?.error || 'Failed to load safety insights')
          }
          const payload = Array.isArray(data.safety) ? data.safety : data.safety ? [data.safety] : []
          setSafetyProfiles(payload)
        }
      } catch (error: any) {
        if (!cancelled) {
          console.error('Failed to load safety insights:', error)
          setError(error?.message || 'Unable to load safety information right now.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [regionHint, businessId, listingId])

  return (
    <Card className="bg-slate-900/70 border-slate-700/60 p-6 text-slate-200 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-300" />
        <h3 className="text-lg font-semibold text-white">Safety & Logistics Snapshot</h3>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading safety intel...</p>
      ) : error ? (
        <p className="text-sm text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </p>
      ) : safetyProfiles.length ? (
        <div className="space-y-4">
          {safetyProfiles.slice(0, 2).map((profile, index) => (
            <div key={index} className="rounded-lg border border-slate-700/60 p-4 bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {profile.listing?.title || profile.business?.businessName || profile.region || 'Destination'}
                  </p>
                  {profile.business?.city && (
                    <p className="text-xs text-slate-400">
                      {profile.business.city}, {profile.business.country}
                    </p>
                  )}
                </div>
                {profile.remotenessLevel && (
                  <span className="text-xs uppercase tracking-wide text-amber-300">{profile.remotenessLevel}</span>
                )}
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
                {profile.cellCoverage && (
                  <div className="flex items-start gap-2">
                    <Satellite className="w-4 h-4 text-blue-300 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">Cell Coverage</p>
                      <p className="mt-1 leading-relaxed text-slate-300/90">{profile.cellCoverage}</p>
                    </div>
                  </div>
                )}
                {profile.emergencyContacts && (
                  <div className="flex items-start gap-2">
                    <Ambulance className="w-4 h-4 text-red-300 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">Emergency Contacts</p>
                      <ul className="mt-1 space-y-1">
                        {Object.entries(profile.emergencyContacts).map(([label, value]) => (
                          <li key={label} className="flex justify-between gap-4">
                            <span className="text-slate-400">{label}</span>
                            <span className="text-slate-200">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {profile.transportationNotes && (
                <div className="mt-3 flex items-start gap-2 text-xs text-slate-300">
                  <MapPinned className="w-4 h-4 text-yellow-300 mt-0.5" />
                  <p className="leading-relaxed">{profile.transportationNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No safety records available yet for this region.</p>
      )}
    </Card>
  )
}


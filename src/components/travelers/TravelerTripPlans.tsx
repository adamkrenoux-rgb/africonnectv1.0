'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AlertTriangle, Calendar, FileSearch, Loader2, Shield, TrendingUp } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { safeJsonParse } from '@/lib/api-helpers'
import { cn } from '@/lib/utils'

interface TravelerTripPlansProps {
  tripPlans: any[]
  onHealthCheckComplete: (planId: string, healthCheck: any) => void
}

export function TravelerTripPlans({ tripPlans, onHealthCheckComplete }: TravelerTripPlansProps) {
  const [runningCheckFor, setRunningCheckFor] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleHealthCheck = async (planId: string) => {
    setRunningCheckFor(planId)
    setError(null)
    try {
      const response = await fetch('/api/ai/trip-health-check', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripPlanId: planId })
      })
      const data = await safeJsonParse<{ success: boolean; healthCheck: any; error?: string }>(response)

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to run health check')
      }

      onHealthCheckComplete(planId, data.healthCheck)
    } catch (error: any) {
      console.error('Trip health check failed:', error)
      setError(error?.message || 'Could not complete health check. Please try again.')
    } finally {
      setRunningCheckFor(null)
    }
  }

  if (!tripPlans.length) {
    return (
      <Card className="bg-slate-900/70 border-slate-700/60 p-6 text-slate-200 flex flex-col items-center gap-4">
        <Calendar className="w-8 h-8 text-slate-500" />
        <p className="text-sm text-slate-300 text-center">
          You have no saved trip plans yet. Start planning to get personalized health checks and logistics advice.
        </p>
        <Link
          href="/plan-trip"
          className={cn(
            buttonVariants({ variant: 'default', size: 'default' }),
            'bg-yellow-500 hover:bg-yellow-600 text-black px-6'
          )}
        >
          Launch Trip Planner
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Trip Plans & AI Health Checks</h3>
          <p className="text-sm text-slate-300">
            Ensure logistics, permits, and safety gaps are covered before you travel.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-amber-400/40 bg-amber-500/10 text-amber-200 px-4 py-2 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-3">
        {tripPlans.map((plan) => {
          const healthCheck = plan.healthChecks?.[0] || null
          const severity = healthCheck?.issues?.find((issue: any) => issue.severity === 'critical')
            ? 'critical'
            : healthCheck?.issues?.find((issue: any) => issue.severity === 'warning')
            ? 'warning'
            : 'ok'

          return (
            <Card key={plan.id} className="bg-slate-900/70 border-slate-700/60 p-5 text-slate-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-white">{plan.title}</h4>
                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    {plan.destinations?.length
                      ? `Destinations: ${plan.destinations.map((d: any) => d.name || d).join(', ')}`
                      : 'No destinations listed yet. Add stops to unlock a richer health check.'}
                  </p>
                  {healthCheck ? (
                    <div className="border border-slate-700/60 rounded-lg p-3 bg-slate-900/60 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <Shield className="w-4 h-4 text-emerald-300" />
                        Last AI scan flagged{' '}
                        <span
                          className={
                            severity === 'critical'
                              ? 'text-red-300 font-semibold'
                              : severity === 'warning'
                              ? 'text-amber-200 font-medium'
                              : 'text-emerald-200 font-medium'
                          }
                        >
                          {healthCheck.issues?.length || 0} considerations
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{healthCheck.summary}</p>
                      {healthCheck.issues?.length ? (
                        <ul className="mt-2 space-y-1 text-xs text-slate-300">
                          {healthCheck.issues.slice(0, 3).map((issue: any) => (
                            <li key={issue.id} className="flex gap-2">
                              <FileSearch className="w-4 h-4 text-yellow-300 mt-0.5" />
                              <span>
                                <strong>{issue.title}:</strong> {issue.recommendation}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      No health check run yet. Generate one to uncover safety and logistics gaps.
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-start gap-3">
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    disabled={runningCheckFor === plan.id}
                    onClick={() => handleHealthCheck(plan.id)}
                  >
                    {runningCheckFor === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running AI Check...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Run AI Health Check
                      </>
                    )}
                  </Button>
                  <Link
                    href={`/travelers/trip-plans/${plan.id}`}
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'default' }),
                      'border-slate-600 text-slate-200 hover:bg-slate-800/70'
                    )}
                  >
                    Manage plan
                  </Link>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


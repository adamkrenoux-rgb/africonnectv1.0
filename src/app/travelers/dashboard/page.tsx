'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TravelerProfileSummary } from '@/components/travelers/TravelerProfileSummary'
import { TravelerRecommendations } from '@/components/travelers/TravelerRecommendations'
import { TravelerTripPlans } from '@/components/travelers/TravelerTripPlans'
import { TravelerSafetyInsights } from '@/components/travelers/TravelerSafetyInsights'
import { TravelerFeed } from '@/components/travelers/TravelerFeed'
import { TravelerNotificationsPanel } from '@/components/travelers/TravelerNotificationsPanel'
import { TravelerTripHistory } from '@/components/travelers/TravelerTripHistory'
import { TravelerAIChatAssistant } from '@/components/travelers/TravelerAIChatAssistant'
import { TravelerOnboardingWizard } from '@/components/travelers/TravelerOnboardingWizard'
import { useTravelerDashboard } from '@/hooks/useTravelerDashboard'

export default function TravelerDashboard() {
  const router = useRouter()
  const { signOut } = useClerk()
  const { profile, recommendations, feed, notifications, tripPlans, history, loading, error, refresh } =
    useTravelerDashboard()
  const [localTripPlans, setLocalTripPlans] = useState<any[]>([])
  const [onboardingOpen, setOnboardingOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: '/' })
    } catch (error) {
      console.error('Error signing out:', error)
      router.push('/')
    }
  }

  useEffect(() => {
    setLocalTripPlans(tripPlans)
  }, [tripPlans])

  const handleHealthCheckComplete = (planId: string, healthCheck: any) => {
    setLocalTripPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              healthChecks: [healthCheck, ...(plan.healthChecks || [])]
            }
          : plan
      )
    )
  }

  const markNotificationsRead = async (ids: string[]) => {
    if (!ids.length) return
    try {
      await fetch('/api/travelers/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids, read: true })
      })
      await refresh()
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const regionLabel = profile?.homeBase || profile?.user?.country || 'your region'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black pb-20">
      <header className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-semibold tracking-wide text-white">
            Connexus
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <Link href="/travelers" className="hover:text-yellow-300 transition-colors">
              Traveler Guide
            </Link>
            <Link href="/travelers/dashboard/browse-experiences" className="hover:text-yellow-300 transition-colors">
              Explore
            </Link>
            <Link href="/messages" className="hover:text-yellow-300 transition-colors">
              Messages
            </Link>
            <Link href="/settings" className="hover:text-yellow-300 transition-colors">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800/70" onClick={refresh}>
              Refresh
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {error && (
          <Card className="bg-red-500/10 border-red-500/40 text-red-100 p-4">
            We ran into an issue loading your dashboard: {error}
          </Card>
        )}

        <TravelerProfileSummary
          profile={profile}
          onLaunchOnboarding={() => setOnboardingOpen(true)}
          onOpenPreferences={() => router.push('/settings')}
        />

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <div className="space-y-6">
            <TravelerRecommendations recommendations={recommendations} onRefresh={refresh} loading={loading} />
            <TravelerTripPlans tripPlans={localTripPlans} onHealthCheckComplete={handleHealthCheckComplete} />
            <TravelerTripHistory history={history} />
          </div>
          <div className="space-y-6">
            <TravelerSafetyInsights regionHint={regionLabel} />
            <TravelerNotificationsPanel notifications={notifications} onMarkRead={markNotificationsRead} />
          </div>
        </div>

        <TravelerFeed items={feed} regionLabel={regionLabel} />
      </main>

      <TravelerAIChatAssistant locale={profile?.preferredLanguages?.[0]} />
      <TravelerOnboardingWizard
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onCompleted={() => {
          refresh()
        }}
      />
    </div>
  )
}
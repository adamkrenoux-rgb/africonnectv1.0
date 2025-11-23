'use client'

import { useMemo } from 'react'
import { CheckCircle, Globe2, Languages, Shield, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TravelerProfileSummaryProps {
  profile: any | null
  onLaunchOnboarding: () => void
  onOpenPreferences: () => void
}

function StatusBadge({
  label,
  icon,
  variant = 'default'
}: {
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning'
}) {
  const color =
    variant === 'success'
      ? 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20'
      : variant === 'warning'
      ? 'text-amber-300 bg-amber-500/10 border-amber-400/20'
      : 'text-slate-200 bg-slate-500/10 border-slate-400/20'

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium border rounded-full ${color}`}>
      {icon}
      {label}
    </span>
  )
}

export function TravelerProfileSummary({
  profile,
  onLaunchOnboarding,
  onOpenPreferences
}: TravelerProfileSummaryProps) {
  const identityStatus = useMemo(() => {
    if (!profile) return null
    if (profile.identityVerified) {
      return {
        label: 'Identity Verified',
        variant: 'success' as const,
        icon: <CheckCircle className="w-3.5 h-3.5" />
      }
    }
    if (profile.verificationDocumentUrl) {
      return {
        label: 'Verification Submitted',
        variant: 'warning' as const,
        icon: <Shield className="w-3.5 h-3.5" />
      }
    }
    return {
      label: 'Verification Pending',
      variant: 'default' as const,
      icon: <Shield className="w-3.5 h-3.5" />
    }
  }, [profile])

  const travelerType = profile?.travelerType ? profile.travelerType.replace(/_/g, ' ') : 'Traveler'

  return (
    <Card className="bg-slate-900/70 border-slate-700/60 backdrop-blur-md p-6 text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
            <User className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{profile?.user?.name || 'Traveler'}</h2>
            <p className="text-sm text-slate-300 uppercase tracking-wide">{travelerType}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {identityStatus && (
                <StatusBadge label={identityStatus.label} icon={identityStatus.icon} variant={identityStatus.variant} />
              )}
              {profile?.preferredLanguages?.length ? (
                <StatusBadge
                  label={`Speaks ${profile.preferredLanguages.join(', ')}`}
                  icon={<Languages className="w-3.5 h-3.5" />}
                />
              ) : null}
              {profile?.homeBase ? (
                <StatusBadge
                  label={`Home base: ${profile.homeBase}`}
                  icon={<Globe2 className="w-3.5 h-3.5" />}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-300 hover:bg-yellow-500/10"
            onClick={onOpenPreferences}
          >
            Update Preferences
          </Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={onLaunchOnboarding}>
            Smart Setup Wizard
          </Button>
        </div>
      </div>

      {profile?.introSummary && (
        <p className="mt-4 text-sm text-slate-300 border-t border-slate-700/70 pt-4 leading-relaxed">
          {profile.introSummary}
        </p>
      )}
    </Card>
  )
}


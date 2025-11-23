import { prisma } from '@/lib/prisma'
import { PlanTier } from '@prisma/client'

export type EntitlementsMap = Record<string, string>

export const DEFAULT_ENTITLEMENTS: Record<PlanTier, EntitlementsMap> = {
  FREE: {
    max_listings: '1',
    team_seats: '1',
    priority_placement: 'false',
    ai_tools: 'basic',
    influencer_tools: 'none'
  },
  BASIC: {
    max_listings: '5',
    team_seats: '3',
    priority_placement: 'false',
    ai_tools: 'standard',
    influencer_tools: 'limited'
  },
  PRO: {
    max_listings: '25',
    team_seats: '10',
    priority_placement: 'true',
    ai_tools: 'advanced',
    influencer_tools: 'full'
  },
  DIAMOND: {
    max_listings: 'unlimited',
    team_seats: '25',
    priority_placement: 'true',
    ai_tools: 'advanced',
    influencer_tools: 'full'
  }
}

export async function getUserEntitlements(userId: string): Promise<EntitlementsMap> {
  const sub = await prisma.subscription.findFirst({ where: { userId } })
  const tier: PlanTier = (sub?.planTier as PlanTier) || 'FREE'
  const plan = await prisma.plan.findFirst({
    where: { tier },
    include: { entitlements: true }
  })
  if (plan && plan.entitlements.length > 0) {
    return Object.fromEntries(plan.entitlements.map(e => [e.key, e.value]))
  }
  return DEFAULT_ENTITLEMENTS[tier] || {}
}

export function hasEntitlement(entitlements: EntitlementsMap, key: string, expectedValue?: string) {
  const val = entitlements[key]
  if (val === undefined) return false
  if (expectedValue === undefined) return true
  return String(val) === String(expectedValue)
}



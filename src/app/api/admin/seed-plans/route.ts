import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { DEFAULT_ENTITLEMENTS } from '@/lib/entitlements'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // Seed Plans and Entitlements for all tiers if missing
    const tiers: Array<'FREE' | 'BASIC' | 'PRO' | 'DIAMOND'> = ['FREE', 'BASIC', 'PRO', 'DIAMOND']
    for (const tier of tiers) {
      let plan = await prisma.plan.findFirst({ where: { tier } })
      if (!plan) {
        plan = await prisma.plan.create({
          data: {
            tier,
            name: tier[0] + tier.slice(1).toLowerCase(),
            priceCents: tier === 'FREE' ? 0 : tier === 'BASIC' ? 1900 : tier === 'PRO' ? 4900 : 9900,
            currency: 'USD'
          }
        })
      }
      const existingEnts = await prisma.planEntitlement.findMany({ where: { planId: plan.id } })
      const existingKeys = new Set(existingEnts.map(e => e.key))
      const defaults = DEFAULT_ENTITLEMENTS[tier]
      for (const [key, value] of Object.entries(defaults)) {
        if (!existingKeys.has(key)) {
          await prisma.planEntitlement.create({
            data: { planId: plan.id, key, value }
          })
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Seed failed' }, { status: 500 })
  }
}



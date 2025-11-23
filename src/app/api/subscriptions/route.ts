import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

// GET /api/subscriptions -> fetch current user's subscription and plan entitlements
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const sub = await prisma.subscription.findFirst({
      where: { userId: user.id }
    })
    let planEntitlements: { key: string; value: string }[] = []
    if (sub) {
      const plan = await prisma.plan.findFirst({ where: { tier: sub.planTier }, include: { entitlements: true } })
      planEntitlements = plan?.entitlements?.map(e => ({ key: e.key, value: e.value })) || []
    }
    return NextResponse.json({ success: true, subscription: sub, entitlements: planEntitlements }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch subscription' }, { status: 500 })
  }
}



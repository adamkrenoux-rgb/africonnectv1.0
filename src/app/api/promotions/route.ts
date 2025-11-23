import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { validateRequest, createPromotionSchema } from '@/lib/validation'
import { getUserEntitlements, hasEntitlement } from '@/lib/entitlements'

// GET /api/promotions - list my promotions
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const items = await prisma.promotion.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, items }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch promotions' }, { status: 500 })
  }
}

// POST /api/promotions - create
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Gate by plan entitlements (need priority_placement or PRO+)
    const ent = await getUserEntitlements(user.id)
    const allowed = hasEntitlement(ent, 'priority_placement', 'true')
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Your plan does not allow promotions' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const parsed = await validateRequest(createPromotionSchema, body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error, details: parsed.details }, { status: 400 })
    }
    const { businessId, listingId, region, budgetCents, startAt, endAt, priorityBoost } = parsed.data

    const created = await prisma.promotion.create({
      data: {
        userId: user.id,
        businessId,
        listingId,
        region,
        budgetCents: budgetCents ?? 0,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        priorityBoost: priorityBoost ?? 0,
        status: 'ACTIVE'
      }
    })
    return NextResponse.json({ success: true, promotion: created }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create promotion' }, { status: 500 })
  }
}



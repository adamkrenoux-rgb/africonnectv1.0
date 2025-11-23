import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { validateRequest, updatePromotionSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

// PATCH /api/promotions/[id] - update status/budget/boost/timing
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json().catch(() => ({}))
    const parsed = await validateRequest(updatePromotionSchema, body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error, details: parsed.details }, { status: 400 })
    }
    const existing = await prisma.promotion.findUnique({ where: { id: params.id } })
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    const updated = await prisma.promotion.update({
      where: { id: params.id },
      data: {
        status: parsed.data.status || undefined,
        budgetCents: parsed.data.budgetCents ?? undefined,
        priorityBoost: parsed.data.priorityBoost ?? undefined,
        startAt: parsed.data.startAt ? new Date(parsed.data.startAt) : undefined,
        endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : undefined
      }
    })
    return NextResponse.json({ success: true, promotion: updated }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update promotion' }, { status: 500 })
  }
}

// DELETE /api/promotions/[id] - cancel
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const existing = await prisma.promotion.findUnique({ where: { id: params.id } })
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    await prisma.promotion.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' }
    })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to cancel promotion' }, { status: 500 })
  }
}



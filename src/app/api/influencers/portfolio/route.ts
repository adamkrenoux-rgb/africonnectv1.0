import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { influencerPortfolioUpsertSchema, validateRequest } from '@/lib/validation'

export const dynamic = 'force-dynamic'

// GET /api/influencers/portfolio
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const portfolio = await prisma.influencerPortfolio.findUnique({ where: { userId: user.id } })
  return NextResponse.json({ success: true, portfolio }, { status: 200 })
}

// PUT /api/influencers/portfolio
export async function PUT(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const parsed = await validateRequest(influencerPortfolioUpsertSchema, body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error, details: parsed.details }, { status: 400 })
  }
  const data = parsed.data as any
  const upserted = await prisma.influencerPortfolio.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: { ...data }
  })
  return NextResponse.json({ success: true, portfolio: upserted }, { status: 200 })
}



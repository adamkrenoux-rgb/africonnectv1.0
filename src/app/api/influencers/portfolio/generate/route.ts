import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { generatePortfolioDraft } from '@/lib/ai/influencer-portfolio'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const { niches, links, socials } = body || {}
  const draft = await generatePortfolioDraft({
    name: user.name || undefined,
    niches,
    links,
    socials
  })
  const saved = await prisma.influencerPortfolio.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...draft },
    update: { ...draft }
  })
  return NextResponse.json({ success: true, portfolio: saved }, { status: 200 })
}



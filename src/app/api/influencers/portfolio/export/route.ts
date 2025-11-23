import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { renderPortfolioMarkdown } from '@/lib/ai/influencer-portfolio'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const url = new URL(request.url)
  const format = (url.searchParams.get('format') || 'markdown').toLowerCase()
  const portfolio = await prisma.influencerPortfolio.findUnique({ where: { userId: user.id } })
  if (!portfolio) {
    return NextResponse.json({ success: false, error: 'No portfolio found' }, { status: 404 })
  }
  if (format === 'markdown') {
    const md = renderPortfolioMarkdown({
      headline: portfolio.headline || undefined,
      bio: portfolio.bio || undefined,
      niches: portfolio.niches || undefined,
      stats: portfolio.stats || undefined,
      links: portfolio.links as any
    })
    return new NextResponse(md, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
    })
  }
  // default json
  return NextResponse.json({ success: true, portfolio }, { status: 200 })
}



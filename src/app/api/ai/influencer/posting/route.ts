import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { recommendPostingTimes } from '@/lib/ai/influencer-posting'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  platform: z.enum(['instagram', 'tiktok', 'youtube', 'facebook', 'twitter']).optional(),
  audienceLocale: z.string().optional(),
  recentEngagementPattern: z.enum(['morning', 'afternoon', 'evening', 'night', 'mixed']).optional(),
  timezone: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json().catch(() => ({}))
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message || 'Invalid payload' }, { status: 400 })
    }
    const result = await recommendPostingTimes(parsed.data)
    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to recommend posting times' }, { status: 500 })
  }
}



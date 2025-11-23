import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { generateCaptions } from '@/lib/ai/influencer-captions'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  platform: z.enum(['instagram', 'tiktok', 'youtube', 'facebook', 'twitter']).optional(),
  theme: z.string().optional(),
  tone: z.enum(['informative', 'funny', 'luxury', 'adventurous', 'educational']).optional(),
  locale: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  includeCTA: z.boolean().optional()
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
    const result = await generateCaptions(parsed.data)
    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate captions' }, { status: 500 })
  }
}



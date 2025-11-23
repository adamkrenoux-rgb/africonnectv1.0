import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { getPricingSuggestions } from '@/lib/ai/business-pricing'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  region: z.string().optional(),
  activityType: z.string().optional(),
  basePrice: z.number().optional(),
  currency: z.string().optional(),
  season: z.string().optional(),
  capacity: z.number().optional(),
  historicalConversionRate: z.number().optional()
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
    const result = await getPricingSuggestions(parsed.data)
    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate pricing' }, { status: 500 })
  }
}



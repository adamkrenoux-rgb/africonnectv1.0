import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { getDemandForecast } from '@/lib/ai/business-demand'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  region: z.string().optional(),
  activityType: z.string().optional(),
  month: z.string().optional(),
  recentSearchTrends: z.array(z.object({ term: z.string(), delta: z.number() })).optional(),
  competitorSignals: z.array(z.object({ name: z.string(), price: z.number().optional(), availability: z.string().optional() })).optional()
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
    const result = await getDemandForecast(parsed.data)
    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate demand forecast' }, { status: 500 })
  }
}



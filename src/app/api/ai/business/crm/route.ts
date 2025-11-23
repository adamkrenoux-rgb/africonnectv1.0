import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { getLeadInsights } from '@/lib/ai/business-crm'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  leadName: z.string().optional(),
  source: z.string().optional(),
  locale: z.string().optional(),
  interests: z.array(z.string()).optional(),
  pastMessages: z.array(z.object({ from: z.enum(['lead', 'business']), content: z.string() })).optional()
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
    const result = await getLeadInsights(parsed.data)
    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate CRM insights' }, { status: 500 })
  }
}



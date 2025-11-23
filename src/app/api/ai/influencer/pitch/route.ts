import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { generatePitch } from '@/lib/ai/influencer-pitch'
import { z } from 'zod'

const schema = z.object({
  brandName: z.string().optional(),
  deliverables: z.array(z.string()).optional(),
  audience: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'bold']).optional(),
  valueProps: z.array(z.string()).optional()
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
    const result = await generatePitch(parsed.data)
    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate pitch' }, { status: 500 })
  }
}



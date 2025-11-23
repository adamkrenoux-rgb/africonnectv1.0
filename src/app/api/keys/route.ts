import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { getUserEntitlements, hasEntitlement } from '@/lib/entitlements'
import { generateApiKey } from '@/lib/api-keys'
import { z } from 'zod'

// GET /api/keys - list my API keys (metadata only)
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, keyPrefix: true, status: true, rateLimitPerMinute: true, lastUsedAt: true, createdAt: true, revokedAt: true }
  })
  return NextResponse.json({ success: true, keys }, { status: 200 })
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
  rateLimitPerMinute: z.number().int().min(1).max(600).optional()
})

// POST /api/keys - create an API key (Diamond only)
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const ent = await getUserEntitlements(user.id)
  const isDiamond = hasEntitlement(ent, 'ai_tools', 'advanced') && hasEntitlement(ent, 'priority_placement', 'true')
  if (!isDiamond) {
    return NextResponse.json({ success: false, error: 'API access is available for Diamond plan' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message || 'Invalid payload' }, { status: 400 })
  }
  const { raw, prefix, hash } = generateApiKey()
  const rec = await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      keyPrefix: prefix,
      keyHash: hash,
      rateLimitPerMinute: parsed.data.rateLimitPerMinute ?? 60
    },
    select: { id: true, name: true, keyPrefix: true, status: true, rateLimitPerMinute: true, createdAt: true }
  })
  // Return the raw key only once
  return NextResponse.json({ success: true, key: { ...rec, raw } }, { status: 201 })
}



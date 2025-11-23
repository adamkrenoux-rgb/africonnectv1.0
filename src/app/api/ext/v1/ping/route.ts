import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAndIncrementRateLimit, verifyApiKey } from '@/lib/api-keys'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const key = request.headers.get('x-afri-api-key') || request.headers.get('X-Afri-Api-Key')
    if (!key) {
      return NextResponse.json({ success: false, error: 'Missing API key' }, { status: 401 })
    }
    const record = await verifyApiKey(key)
    if (!record) {
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 })
    }
    const ok = await checkAndIncrementRateLimit(record.id, record.rateLimitPerMinute)
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 })
    }
    await prisma.apiKey.update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
    return NextResponse.json({ success: true, message: 'pong' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed' }, { status: 500 })
  }
}



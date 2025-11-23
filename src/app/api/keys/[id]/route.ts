import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateSchema = z.object({
  action: z.enum(['revoke'])
})

// PATCH /api/keys/[id] -> revoke
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message || 'Invalid payload' }, { status: 400 })
  }
  const key = await prisma.apiKey.findUnique({ where: { id: params.id } })
  if (!key || key.userId !== user.id) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { status: 'REVOKED', revokedAt: new Date() }
  })
  return NextResponse.json({ success: true }, { status: 200 })
}



import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

async function ensureAccount(userId: string) {
  const existing = await prisma.loyaltyAccount.findUnique({ where: { userId } })
  if (existing) return existing
  return prisma.loyaltyAccount.create({ data: { userId } })
}

// GET /api/loyalty -> returns points and recent transactions
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const account = await ensureAccount(user.id)
  const recent = await prisma.loyaltyTransaction.findMany({
    where: { loyaltyAccountId: account.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return NextResponse.json(
    {
      success: true,
      account: { id: account.id, points: account.points, tier: account.tier, updatedAt: account.updatedAt },
      recent
    },
    { status: 200 }
  )
}



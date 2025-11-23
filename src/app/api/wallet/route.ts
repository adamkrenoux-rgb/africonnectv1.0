import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { handleApiError } from '@/lib/api-error-handler'

export const dynamic = 'force-dynamic'

// Ensure a WalletAccount exists for the current user
async function ensureWalletAccount(userId: string) {
  const existing = await prisma.walletAccount.findUnique({ where: { userId } })
  if (existing) return existing
  return prisma.walletAccount.create({
    data: { userId }
  })
}

// GET /api/wallet -> returns balances and recent transactions
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const wallet = await ensureWalletAccount(user.id)

    const recent = await prisma.walletTransaction.findMany({
      where: { walletAccountId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json(
      {
        success: true,
        wallet: {
          id: wallet.id,
          currency: wallet.currency,
          available: wallet.available,
          pending: wallet.pending,
          updatedAt: wallet.updatedAt
        },
        recentTransactions: recent
      },
      { status: 200 }
    )
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { handleApiError } from '@/lib/api-error-handler'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const paginationSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional()
})

const adjustmentSchema = z.object({
  amount: z.number(),
  currency: z.string().optional(),
  description: z.string().optional()
})

async function ensureWalletAccount(userId: string) {
  const existing = await prisma.walletAccount.findUnique({ where: { userId } })
  if (existing) return existing
  return prisma.walletAccount.create({
    data: { userId }
  })
}

// GET /api/wallet/transactions -> paginated list
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const wallet = await ensureWalletAccount(user.id)

    const url = new URL(request.url)
    const parse = paginationSchema.safeParse({
      page: url.searchParams.get('page') || undefined,
      pageSize: url.searchParams.get('pageSize') || undefined
    })
    const page = parse.success && parse.data.page ? Math.max(parseInt(parse.data.page, 10) || 1, 1) : 1
    const pageSize =
      parse.success && parse.data.pageSize ? Math.min(Math.max(parseInt(parse.data.pageSize, 10) || 20, 1), 100) : 20
    const skip = (page - 1) * pageSize

    const [items, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where: { walletAccountId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.walletTransaction.count({ where: { walletAccountId: wallet.id } })
    ])

    return NextResponse.json(
      {
        success: true,
        page,
        pageSize,
        total,
        items
      },
      { status: 200 }
    )
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}

// POST /api/wallet/transactions -> create an ADJUSTMENT for the user's account
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const wallet = await ensureWalletAccount(user.id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 })
    }
    const parsed = adjustmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message || 'Invalid payload' }, { status: 400 })
    }
    const { amount, currency, description } = parsed.data

    // Create transaction
    const tx = await prisma.$transaction(async (db) => {
      const created = await db.walletTransaction.create({
        data: {
          walletAccountId: wallet.id,
          amount,
          currency: currency || wallet.currency,
          type: 'ADJUSTMENT',
          status: 'POSTED',
          description
        }
      })
      // Update balances: positive increases available, negative decreases (guard cannot go below - we allow negative available? keep simple, clamp at 0)
      const newAvailable = Math.max(0, wallet.available + amount)
      const updated = await db.walletAccount.update({
        where: { id: wallet.id },
        data: { available: newAvailable }
      })
      return { transaction: created, wallet: updated }
    })

    return NextResponse.json({ success: true, ...tx }, { status: 201 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}



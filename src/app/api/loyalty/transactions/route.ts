import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const paginationSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional()
})

const txSchema = z.object({
  type: z.enum(['EARN', 'REDEEM', 'ADJUST']),
  points: z.number().int(),
  reason: z.string().optional(),
  referenceType: z.enum(['BUSINESS', 'LISTING', 'CAMPAIGN', 'ITINERARY', 'OTHER']).optional(),
  referenceId: z.string().optional(),
  metadata: z.any().optional()
})

async function ensureAccount(userId: string) {
  const existing = await prisma.loyaltyAccount.findUnique({ where: { userId } })
  if (existing) return existing
  return prisma.loyaltyAccount.create({ data: { userId } })
}

// GET /api/loyalty/transactions -> paginated
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const account = await ensureAccount(user.id)

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
    prisma.loyaltyTransaction.findMany({
      where: { loyaltyAccountId: account.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    }),
    prisma.loyaltyTransaction.count({ where: { loyaltyAccountId: account.id } })
  ])

  return NextResponse.json({ success: true, page, pageSize, total, items }, { status: 200 })
}

// POST /api/loyalty/transactions -> create earn/redeem/adjust and update points
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const account = await ensureAccount(user.id)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 })
  }
  const parsed = txSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message || 'Invalid payload' }, { status: 400 })
  }
  const { type, points, reason, referenceType, referenceId, metadata } = parsed.data

  // Negative points validation for redeem
  if (type === 'REDEEM' && points > account.points) {
    return NextResponse.json({ success: false, error: 'Insufficient points' }, { status: 400 })
  }

  const delta = type === 'EARN' ? points : type === 'REDEEM' ? -points : points

  const result = await prisma.$transaction(async (db) => {
    const tx = await db.loyaltyTransaction.create({
      data: {
        loyaltyAccountId: account.id,
        type,
        points,
        reason,
        referenceType,
        referenceId,
        metadata
      }
    })
    const newPoints = Math.max(0, account.points + delta)
    const updated = await db.loyaltyAccount.update({
      where: { id: account.id },
      data: { points: newPoints }
    })
    return { transaction: tx, account: updated }
  })

  return NextResponse.json({ success: true, ...result }, { status: 201 })
}



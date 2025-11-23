import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { handleApiError } from '@/lib/api-error-handler'
import { validateRequest, createDisputeSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

// GET /api/disputes?role=me|against&status=OPEN
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const role = url.searchParams.get('role') // me | against | all
    const status = url.searchParams.get('status') as any | null

    const where: any = {}
    if (status) where.status = status
    if (role === 'me') where.createdByUserId = user.id
    else if (role === 'against') where.againstUserId = user.id
    else if (role !== 'all') {
      // default to disputes involving the user either side
      where.OR = [{ createdByUserId: user.id }, { againstUserId: user.id }]
    }

    const disputes = await prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, disputes }, { status: 200 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}

// POST /api/disputes -> create
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const parsed = await validateRequest(createDisputeSchema, body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error, details: parsed.details },
        { status: 400 }
      )
    }
    const { targetType, targetId, reason, details } = parsed.data

    // Best-effort derive againstUserId based on target
    let againstUserId: string | undefined
    if (targetType === 'BOOKING') {
      const booking = await prisma.booking.findUnique({ where: { id: targetId } })
      if (booking) {
        // if traveler is filing, against business owner; else vice-versa
        againstUserId = booking.businessId
      }
    } else if (targetType === 'CAMPAIGN') {
      const campaign = await prisma.campaign.findUnique({ where: { id: targetId } })
      if (campaign) {
        againstUserId = campaign.influencerId
      }
    } else if (targetType === 'APPLICATION') {
      const application = await prisma.application.findUnique({ where: { id: targetId } })
      if (application) {
        againstUserId = application.businessId
      }
    }

    const dispute = await prisma.dispute.create({
      data: {
        targetType,
        targetId,
        createdByUserId: user.id,
        againstUserId,
        reason,
        details
      }
    })

    return NextResponse.json({ success: true, dispute }, { status: 201 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}



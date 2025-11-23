import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { handleApiError } from '@/lib/api-error-handler'
import { validateRequest, updateDisputeStatusSchema, addDisputeMessageSchema } from '@/lib/validation'

// GET /api/disputes/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id: params.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    })
    if (!dispute) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    // Ensure visibility to parties involved
    if (dispute.createdByUserId !== user.id && dispute.againstUserId !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ success: true, dispute }, { status: 200 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}

// PATCH /api/disputes/[id] -> update status (parties can close; admin could also manage, but keep simple)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const parsed = await validateRequest(updateDisputeStatusSchema, body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error, details: parsed.details }, { status: 400 })
    }
    const existing = await prisma.dispute.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    if (existing.createdByUserId !== user.id && existing.againstUserId !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }
    const dispute = await prisma.dispute.update({
      where: { id: params.id },
      data: {
        status: parsed.data.status,
        resolutionNotes: parsed.data.resolutionNotes
      }
    })
    return NextResponse.json({ success: true, dispute }, { status: 200 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}

// POST /api/disputes/[id] -> add message
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const parsed = await validateRequest(addDisputeMessageSchema, body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error, details: parsed.details }, { status: 400 })
    }
    const existing = await prisma.dispute.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    if (existing.createdByUserId !== user.id && existing.againstUserId !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }
    const message = await prisma.disputeMessage.create({
      data: {
        disputeId: params.id,
        authorId: user.id,
        content: parsed.data.content
      }
    })
    return NextResponse.json({ success: true, message }, { status: 201 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}



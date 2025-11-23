import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { travelerNotificationSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export const GET = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const nextRequest = request as NextRequest
  const searchParams = nextRequest.nextUrl.searchParams
  const take = Number(searchParams.get('take')) || 20
  const unreadOnly = searchParams.get('unread') === 'true'

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      ...(unreadOnly ? { read: false } : {})
    },
    orderBy: { sentAt: 'desc' },
    take
  })

  return NextResponse.json({
    success: true,
    notifications
  })
})

export const PATCH = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const filterValidation = await travelerNotificationSchema.safeParseAsync(body)
  if (!filterValidation.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid notification filter', details: filterValidation.error.flatten() },
      { status: 400 }
    )
  }

  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown) => typeof id === 'string')
    : []

  if (ids.length === 0) {
    return NextResponse.json(
      { success: false, error: 'No notification IDs provided' },
      { status: 400 }
    )
  }

  const readFlag = typeof body.read === 'boolean' ? body.read : true

  await prisma.notification.updateMany({
    where: {
      id: { in: ids },
      userId: user.id
    },
    data: {
      read: readFlag,
      readAt: readFlag ? new Date() : null
    }
  })

  return NextResponse.json({
    success: true
  })
})


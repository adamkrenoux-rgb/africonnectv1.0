import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const GET = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can access trip history' },
      { status: 403 }
    )
  }

  const profile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) {
    return NextResponse.json({ success: true, history: [] })
  }

  const nextRequest = request as NextRequest
  const searchParams = nextRequest.nextUrl.searchParams
  const take = Number(searchParams.get('take')) || 20

  const history = await prisma.travelerTripHistory.findMany({
    where: { travelerProfileId: profile.id },
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      booking: {
        select: {
          id: true,
          bookingDate: true,
          status: true,
          listing: { select: { id: true, title: true } },
          business: { select: { id: true, businessName: true, country: true } }
        }
      }
    }
  })

  return NextResponse.json({
    success: true,
    history
  })
})

export const POST = apiErrorHandler(async (request: Request) => {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  if (user.role !== 'TRAVELER') {
    return NextResponse.json(
      { success: false, error: 'Only travelers can update trip history' },
      { status: 403 }
    )
  }

  let body: any = {}
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const { bookingId, summary, learnings, tags } = body || {}

  const profile = await prisma.travelerProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, travelerType: 'TOURIST' }
  })

  if (bookingId) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        travelerId: user.id
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or not owned by traveler' },
        { status: 404 }
      )
    }
  }

  const entry = await prisma.travelerTripHistory.create({
    data: {
      travelerProfileId: profile.id,
      bookingId: bookingId || undefined,
      summary: typeof summary === 'string' ? summary : undefined,
      learnings: typeof learnings === 'object' ? learnings : undefined,
      tags: Array.isArray(tags) ? tags.filter((tag: unknown) => typeof tag === 'string') : undefined
    },
    include: {
      booking: {
        select: {
          id: true,
          bookingDate: true,
          status: true,
          listing: { select: { id: true, title: true } },
          business: { select: { id: true, businessName: true } }
        }
      }
    }
  })

  return NextResponse.json({
    success: true,
    entry
  })
})


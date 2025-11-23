import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { validateRequest, createFavoriteSchema, deleteFavoriteSchema } from '@/lib/validation'
import { handleApiError } from '@/lib/api-error-handler'

export const dynamic = 'force-dynamic'

// GET /api/favorites - list current user's favorites
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, favorites }, { status: 200 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}

// POST /api/favorites - add a favorite
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = await validateRequest(createFavoriteSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const { entityType, entityId } = validation.data

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_entityType_entityId: {
          userId: user.id,
          entityType,
          entityId
        }
      },
      create: {
        userId: user.id,
        entityType,
        entityId
      },
      update: {}
    })

    return NextResponse.json({ success: true, favorite }, { status: 201 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}

// DELETE /api/favorites - remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = await validateRequest(deleteFavoriteSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const { entityType, entityId } = validation.data

    await prisma.favorite.delete({
      where: {
        userId_entityType_entityId: {
          userId: user.id,
          entityType,
          entityId
        }
      }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return handleApiError(error, { url: request.url, method: request.method })
  }
}




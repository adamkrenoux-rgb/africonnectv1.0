import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

// PATCH /api/messages/[id] - Mark message as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify message belongs to user
    const message = await prisma.message.findUnique({
      where: { id: params.id }
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    if (message.receiverId !== dbUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Mark as read
    const updated = await prisma.message.update({
      where: { id: params.id },
      data: { read: true }
    })

    return NextResponse.json({
      success: true,
      message: updated
    })
  } catch (error: any) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update message' },
      { status: 500 }
    )
  }
}


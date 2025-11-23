import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createMessageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1).max(5000),
  language: z.string().max(10).optional()
})

// GET /api/messages - Get conversations for current user
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const conversationWith = searchParams.get('with') // Get messages with specific user

    if (conversationWith) {
      // Get messages between current user and specific user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: dbUser.id, receiverId: conversationWith },
            { senderId: conversationWith, receiverId: dbUser.id }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              role: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              role: true
            }
          },
          translations: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          receiverId: dbUser.id,
          senderId: conversationWith,
          read: false
        },
        data: {
          read: true
        }
      })

      return NextResponse.json({
        success: true,
        messages
      })
    } else {
      // Get all conversations (unique users the current user has messaged or received messages from)
      const sentMessages = await prisma.message.findMany({
        where: { senderId: dbUser.id },
        select: { receiverId: true },
        distinct: ['receiverId']
      })

      const receivedMessages = await prisma.message.findMany({
        where: { receiverId: dbUser.id },
        select: { senderId: true },
        distinct: ['senderId']
      })

      const conversationUserIds = new Set([
        ...sentMessages.map(m => m.receiverId),
        ...receivedMessages.map(m => m.senderId)
      ])

      const conversations = await Promise.all(
        Array.from(conversationUserIds).map(async (userId) => {
          const otherUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              name: true,
              profilePicture: true,
              role: true
            }
          })

          const lastMessage = await prisma.message.findFirst({
            where: {
              OR: [
                { senderId: dbUser.id, receiverId: userId },
                { senderId: userId, receiverId: dbUser.id }
              ]
            },
            orderBy: {
              createdAt: 'desc'
            }
          })

          const unreadCount = await prisma.message.count({
            where: {
              senderId: userId,
              receiverId: dbUser.id,
              read: false
            }
          })

          return {
            user: otherUser,
            lastMessage,
            unreadCount
          }
        })
      )

      return NextResponse.json({
        success: true,
        conversations: conversations.filter(c => c.user !== null)
      })
    }
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = createMessageSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
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

    const { receiverId, content, language } = validation.data

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json(
        { success: false, error: 'Receiver not found' },
        { status: 404 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: dbUser.id,
        receiverId,
        content: content.trim(),
        language: language || dbUser.primaryLanguage || null
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            role: true
          }
        },
        translations: true
      }
    })

    return NextResponse.json({
      success: true,
      message
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}


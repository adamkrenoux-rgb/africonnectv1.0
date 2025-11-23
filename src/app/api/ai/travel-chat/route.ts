import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { generateTravelerChatResponse } from '@/lib/ai/traveler-chat'

export const dynamic = 'force-dynamic'

export const POST = apiErrorHandler(async (request: Request) => {
  console.log('[Travel Chat API] Request received')
  const user = await getCurrentUser()

  if (!user) {
    console.warn('[Travel Chat API] User not authenticated')
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  console.log('[Travel Chat API] User authenticated:', user.id, 'Role:', user.role)

  if (user.role !== 'TRAVELER') {
    console.warn('[Travel Chat API] User is not a traveler:', user.role)
    return NextResponse.json(
      { success: false, error: 'Only travelers can access the AI assistant' },
      { status: 403 }
    )
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

  const { sessionId, message, locale } = body || {}
  if (!message || typeof message !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Message content is required' },
      { status: 400 }
    )
  }

  const travelerProfile = await prisma.travelerProfile.findUnique({
    where: { userId: user.id },
    include: {
      preferences: true,
      tripPlans: true,
      tripHistory: true
    }
  })

  if (!travelerProfile) {
    return NextResponse.json(
      { success: false, error: 'Traveler profile not found' },
      { status: 404 }
    )
  }

  let chatSession =
    sessionId &&
    (await prisma.travelerChatSession.findFirst({
      where: {
        id: sessionId,
        travelerProfileId: travelerProfile.id
      }
    }))

  if (!chatSession) {
    chatSession = await prisma.travelerChatSession.create({
      data: {
        travelerProfileId: travelerProfile.id,
        locale: locale || travelerProfile.preferredLanguages?.[0] || user.primaryLanguage || 'en',
        context: {
          createdAt: new Date().toISOString()
        }
      }
    })
  }

  await prisma.travelerChatMessage.create({
    data: {
      sessionId: chatSession.id,
      senderRole: 'TRAVELER',
      content: message
    }
  })

  const history = await prisma.travelerChatMessage.findMany({
    where: { sessionId: chatSession.id },
    orderBy: { createdAt: 'asc' },
    take: 20
  })

  console.log('[Travel Chat API] Generating AI response for message:', message.substring(0, 50))
  const aiResponse = await generateTravelerChatResponse(
    history.map((msg) => ({
      role: msg.senderRole === 'TRAVELER' ? 'traveler' : 'assistant',
      content: msg.content,
      timestamp: msg.createdAt.toISOString()
    })),
    message,
    {
      travelerProfile,
      preferences: travelerProfile.preferences ?? undefined,
      recentTrips: travelerProfile.tripHistory ?? undefined,
      locale: locale || travelerProfile.preferredLanguages?.[0] || user.primaryLanguage || 'en'
    }
  )
  console.log('[Travel Chat API] AI response received, provider:', aiResponse.provider, 'reply length:', aiResponse.reply.length)

  const assistantMessage = await prisma.travelerChatMessage.create({
    data: {
      sessionId: chatSession.id,
      senderRole: 'ASSISTANT',
      content: aiResponse.reply,
      metadata: {
        suggestions: aiResponse.suggestions,
        topics: aiResponse.topics,
        provider: aiResponse.provider
      }
    }
  })

  return NextResponse.json({
    success: true,
    sessionId: chatSession.id,
    reply: {
      id: assistantMessage.id,
      content: assistantMessage.content,
      metadata: assistantMessage.metadata,
      createdAt: assistantMessage.createdAt
    },
    suggestions: aiResponse.suggestions,
    topics: aiResponse.topics,
    provider: aiResponse.provider
  })
})


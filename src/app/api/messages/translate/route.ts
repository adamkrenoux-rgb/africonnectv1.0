import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const POST = apiErrorHandler(async (request: Request) => {
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

  const { messageId, targetLanguage, content } = body || {}

  if (!targetLanguage || typeof targetLanguage !== 'string') {
    return NextResponse.json(
      { success: false, error: 'targetLanguage is required' },
      { status: 400 }
    )
  }

  if (!messageId && !content) {
    return NextResponse.json(
      { success: false, error: 'Provide messageId or content to translate' },
      { status: 400 }
    )
  }

  let sourceContent = content
  let originalLanguage: string | null = null

  if (messageId) {
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ]
      }
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    sourceContent = message.content
    originalLanguage = message.language || null
  }

  if (!sourceContent || typeof sourceContent !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Content unavailable for translation' },
      { status: 400 }
    )
  }

  const { translateContent } = await import('@/lib/ai/translations')

  const translation = await translateContent({
    content: sourceContent,
    sourceLanguage: originalLanguage || undefined,
    targetLanguage
  })

  if (!translation.success) {
    return NextResponse.json(
      { success: false, error: translation.error || 'Translation failed' },
      { status: 500 }
    )
  }

  const translatedText = translation.translatedText ?? sourceContent

  if (messageId) {
    await prisma.messageTranslation.upsert({
      where: {
        messageId_targetLanguage: {
          messageId,
          targetLanguage
        }
      },
      update: {
        translatedContent: translatedText,
        provider: translation.provider
      },
      create: {
        messageId,
        targetLanguage,
        translatedContent: translatedText,
        provider: translation.provider
      }
    })
  }

  return NextResponse.json({
    success: true,
    translation: translatedText,
    sourceLanguage: translation.detectedLanguage || originalLanguage,
    provider: translation.provider
  })
})


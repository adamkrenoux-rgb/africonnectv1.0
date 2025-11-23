import { NextResponse } from 'next/server'

import { apiErrorHandler } from '@/lib/api-error-handler'
import { translateContent } from '@/lib/ai/translations'

export const dynamic = 'force-dynamic'

export const POST = apiErrorHandler(async (request: Request) => {
  let body: any
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const { content, targetLanguage, sourceLanguage } = body || {}

  if (!content || typeof content !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Content is required' },
      { status: 400 }
    )
  }

  if (!targetLanguage || typeof targetLanguage !== 'string') {
    return NextResponse.json(
      { success: false, error: 'targetLanguage is required' },
      { status: 400 }
    )
  }

  const result = await translateContent({
    content,
    targetLanguage,
    sourceLanguage
  })

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error || 'Translation failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    translation: result.translatedText,
    detectedLanguage: result.detectedLanguage,
    provider: result.provider
  })
})


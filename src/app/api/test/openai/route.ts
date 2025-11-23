import { NextResponse } from 'next/server'
import { aiHelper } from '@/lib/ai-helper'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Make this endpoint public (no auth required)
export async function GET() {
  try {
    const stats = aiHelper.getUsageStats()
    const isReady = aiHelper.isOpenAIReady()
    
    // Try a simple test call
    const testResponse = await aiHelper.generateResponse({
      prompt: 'Say "Hello, OpenAI is working!" in one sentence.',
      maxTokens: 50,
      temperature: 0.7,
      model: 'gpt-4o-mini'
    })

    return NextResponse.json({
      success: true,
      stats,
      isReady,
      testResponse: {
        success: testResponse.success,
        source: testResponse.source,
        dataLength: testResponse.data?.length || 0,
        dataPreview: testResponse.data?.substring(0, 100) || 'No data',
        error: testResponse.error
      },
      message: isReady 
        ? (testResponse.source === 'openai' 
          ? 'OpenAI API is configured and working!' 
          : 'OpenAI API key is configured but using mock responses. Check quota/billing at https://platform.openai.com/account/billing')
        : 'OpenAI API key not found or invalid. Check your .env.local file.',
      quotaIssue: testResponse.source === 'mock' && isReady ? 'Your OpenAI account has exceeded its quota. Add credits at https://platform.openai.com/account/billing' : null
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stats: aiHelper.getUsageStats(),
      isReady: aiHelper.isOpenAIReady()
    }, { status: 500 })
  }
}


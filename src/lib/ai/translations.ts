import { aiHelper } from '@/lib/ai-helper'

interface TranslateParams {
  content: string
  targetLanguage: string
  sourceLanguage?: string
}

interface TranslateResult {
  success: boolean
  translatedText?: string
  detectedLanguage?: string
  provider: 'openai' | 'mock'
  error?: string
}

export async function translateContent({
  content,
  targetLanguage,
  sourceLanguage
}: TranslateParams): Promise<TranslateResult> {
  if (!content) {
    return {
      success: false,
      provider: 'mock',
      error: 'Content is required for translation'
    }
  }

  if (!targetLanguage) {
    return {
      success: false,
      provider: 'mock',
      error: 'Target language is required'
    }
  }

  const prompt = [
    'You are a professional translator helping travelers communicate with local businesses across Africa.',
    'Translate the provided message accurately while preserving tone and cultural nuances.',
    'Return a JSON object with the shape:',
    '{ "translatedText": "...", "detectedLanguage": "ISO-639-1 code or null" }',
    'Do not include any additional text outside the JSON object.',
    `Target language: ${targetLanguage}.`,
    sourceLanguage ? `Original language (hint): ${sourceLanguage}.` : '',
    'Content to translate:',
    content
  ]
    .filter(Boolean)
    .join('\n')

  const response = await aiHelper.generateResponse({
    prompt,
    maxTokens: 300,
    temperature: 0.2,
    model: 'gpt-4o-mini'
  })

  // If response failed or is not a string, use a proper mock translation
  if (!response.success || typeof response.data !== 'string') {
    // Provide basic mock translations for common languages
    const mockTranslations: Record<string, string> = {
      fr: `[Traduction FR] ${content}`,
      pt: `[Tradução PT] ${content}`,
      sw: `[Tafsiri SW] ${content}`,
      ar: `[ترجمة AR] ${content}`
    }
    
    return {
      success: true,
      provider: 'mock',
      translatedText: mockTranslations[targetLanguage] || `[${targetLanguage.toUpperCase()} translation] ${content}`,
      detectedLanguage: sourceLanguage
    }
  }

  // Try to parse JSON response
  let parsed: any = null
  try {
    const trimmed = response.data.trim()
    // Check if it's JSON
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      parsed = JSON.parse(response.data)
    } else {
      // If it's not JSON, assume the entire response is the translation
      return {
        success: true,
        provider: response.source,
        translatedText: trimmed,
        detectedLanguage: sourceLanguage
      }
    }
  } catch (error) {
    // If parsing fails, use the raw response as translation
    console.warn('Failed to parse translation JSON, using raw response:', error)
    return {
      success: true,
      provider: response.source,
      translatedText: response.data.trim(),
      detectedLanguage: sourceLanguage
    }
  }

  // If we have parsed JSON with translatedText
  if (parsed && typeof parsed.translatedText === 'string') {
    return {
      success: true,
      provider: response.source,
      translatedText: parsed.translatedText,
      detectedLanguage: parsed.detectedLanguage || sourceLanguage
    }
  }

  // Fallback: use raw response as translation
  return {
    success: true,
    provider: response.source,
    translatedText: response.data.trim(),
    detectedLanguage: sourceLanguage
  }
}


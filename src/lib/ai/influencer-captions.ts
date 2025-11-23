type CaptionInput = {
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'
  theme?: string
  tone?: 'informative' | 'funny' | 'luxury' | 'adventurous' | 'educational'
  locale?: string
  keywords?: string[]
  includeCTA?: boolean
}

export async function generateCaptions(input: CaptionInput) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      captions: [
        'Exploring hidden gems today. Would you join this adventure?',
        'Sunset views that never get old. Tap follow for more!'
      ],
      notes: 'Mock captions because OPENAI_API_KEY is not set.'
    }
  }
  try {
    const prompt = [
      'You are a social media copywriter for travel influencers.',
      'Generate 3 concise, scroll-stopping captions tailored to the platform and tone.',
      'Return JSON: { captions: string[], notes?: string }',
      `Context: ${JSON.stringify(input)}`
    ].join('\n')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7 })
    })
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ''
    try {
      return JSON.parse(content)
    } catch {
      return { captions: [], notes: 'AI response parse failed.' }
    }
  } catch {
    return { captions: [], notes: 'AI request failed.' }
  }
}



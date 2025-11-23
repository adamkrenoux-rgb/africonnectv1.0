type HashtagInput = {
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'
  topic?: string
  locale?: string
  desiredCount?: number
}

export async function generateHashtags(input: HashtagInput) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      hashtags: ['#travel', '#adventure', '#explore'],
      notes: 'Mock hashtags because OPENAI_API_KEY is not set.'
    }
  }
  try {
    const prompt = [
      'You create trend-aware hashtags for travel content.',
      'Return JSON: { hashtags: string[], notes?: string }',
      `Context: ${JSON.stringify(input)}`
    ].join('\n')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.6 })
    })
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ''
    try {
      return JSON.parse(content)
    } catch {
      return { hashtags: [], notes: 'AI response parse failed.' }
    }
  } catch {
    return { hashtags: [], notes: 'AI request failed.' }
  }
}



type PostingInput = {
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'
  audienceLocale?: string
  recentEngagementPattern?: 'morning' | 'afternoon' | 'evening' | 'night' | 'mixed'
  timezone?: string
}

export async function recommendPostingTimes(input: PostingInput) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      slots: ['18:00', '20:30'],
      notes: 'Mock posting times because OPENAI_API_KEY is not set.'
    }
  }
  try {
    const prompt = [
      'You recommend top 2 posting times for best engagement given the platform and audience behavior.',
      'Return JSON: { slots: string[], notes?: string } with 24h times in local timezone if provided.',
      `Context: ${JSON.stringify(input)}`
    ].join('\n')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.4 })
    })
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ''
    try {
      return JSON.parse(content)
    } catch {
      return { slots: [], notes: 'AI parse failed.' }
    }
  } catch {
    return { slots: [], notes: 'AI request failed.' }
  }
}



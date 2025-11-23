type SEOInput = {
  title?: string
  description?: string
  targetKeywords?: string[]
  locale?: string
  platform?: 'youtube' | 'blog' | 'tiktok'
}

export async function generateSEO(input: SEOInput) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      title: input.title || 'Epic African Adventure',
      description: input.description || 'Discover authentic experiences and hidden gems across Africa.',
      keywords: input.targetKeywords || ['africa travel', 'safari', 'local experiences'],
      notes: 'Mock SEO because OPENAI_API_KEY is not set.'
    }
  }
  try {
    const prompt = [
      'You write SEO metadata for travel content (title, description, keywords).',
      'Return JSON: { title, description, keywords: string[], notes?: string }',
      `Context: ${JSON.stringify(input)}`
    ].join('\n')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.5 })
    })
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ''
    try {
      return JSON.parse(content)
    } catch {
      return { title: input.title || '', description: input.description || '', keywords: [], notes: 'AI parse failed.' }
    }
  } catch {
    return { title: input.title || '', description: input.description || '', keywords: [], notes: 'AI request failed.' }
  }
}



type LeadContext = {
  leadName?: string
  source?: string
  locale?: string
  interests?: string[]
  pastMessages?: Array<{ from: 'lead' | 'business'; content: string }>
}

export async function getLeadInsights(input: LeadContext) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      summary: 'Mock insight because OPENAI_API_KEY is not set.',
      persona: 'Budget-conscious traveler',
      suggestedNextMessage:
        'Thanks for reaching out! I can share options within your budget and preferred dates. Do you have travel dates in mind?',
      likelihoodToBook: 0.55
    }
  }
  try {
    const prompt = [
      'You are a sales assistant analyzing a lead conversation.',
      'Return JSON: summary, persona, suggestedNextMessage, likelihoodToBook (0-1).',
      `Context: ${JSON.stringify(input)}`
    ].join('\n')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5
      })
    })
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ''
    try {
      return JSON.parse(content)
    } catch {
      return {
        summary: 'AI response parse failed; brief neutral summary.',
        persona: 'Undetermined',
        suggestedNextMessage: 'Could you share your preferred dates and budget range?',
        likelihoodToBook: 0.5
      }
    }
  } catch {
    return {
      summary: 'AI request failed; brief neutral summary.',
      persona: 'Undetermined',
      suggestedNextMessage: 'Could you share your preferred dates and budget range?',
      likelihoodToBook: 0.5
    }
  }
}



type DemandInput = {
  region?: string
  activityType?: string
  month?: string
  recentSearchTrends?: Array<{ term: string; delta: number }>
  competitorSignals?: Array<{ name: string; price?: number; availability?: string }>
}

export async function getDemandForecast(input: DemandInput) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      demandLevel: 'medium',
      score: 0.6,
      notes: 'Mock demand forecast because OPENAI_API_KEY is not set.',
      recommendedActions: ['Increase marketing spend slightly', 'Test limited-time offer']
    }
  }
  try {
    const prompt = [
      'You are an analyst forecasting short-term demand for a travel listing.',
      'Return JSON with: demandLevel (low|medium|high), score (0-1), notes (string), recommendedActions (string[]).',
      `Context: ${JSON.stringify(input)}`
    ].join('\n')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      })
    })
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ''
    try {
      return JSON.parse(content)
    } catch {
      return {
        demandLevel: 'medium',
        score: 0.5,
        notes: 'AI response parse failed; returning neutral.',
        recommendedActions: []
      }
    }
  } catch {
    return {
      demandLevel: 'medium',
      score: 0.5,
      notes: 'AI request failed; returning neutral.',
      recommendedActions: []
    }
  }
}



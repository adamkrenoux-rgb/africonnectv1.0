type PricingInput = {
  title?: string
  description?: string
  region?: string
  activityType?: string
  basePrice?: number
  currency?: string
  season?: string
  capacity?: number
  historicalConversionRate?: number
}

export async function getPricingSuggestions(input: PricingInput) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      suggestedPrice: input.basePrice ? Math.round(input.basePrice * 1.05 * 100) / 100 : undefined,
      currency: input.currency || 'USD',
      rationale:
        'Mock suggestion: +5% uplift applied due to missing OpenAI API key. Set OPENAI_API_KEY to enable AI pricing.',
      tieredPricing: [
        { label: 'Low season', price: input.basePrice ? Math.max(1, Math.round(input.basePrice * 0.9)) : undefined },
        { label: 'Standard', price: input.basePrice },
        { label: 'Peak', price: input.basePrice ? Math.round(input.basePrice * 1.2) : undefined }
      ]
    }
  }

  try {
    const prompt = [
      'You are an expert travel pricing analyst.',
      'Given the listing context, suggest an optimal price and short rationale.',
      'Return concise JSON with: suggestedPrice (number), currency, rationale (string), tieredPricing (array of { label, price }).',
      `Context: ${JSON.stringify(input)}`
    ].join('\n')

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4
      })
    })
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ''
    try {
      const parsed = JSON.parse(content)
      return parsed
    } catch {
      return {
        suggestedPrice: input.basePrice,
        currency: input.currency || 'USD',
        rationale: 'AI response could not be parsed; falling back to base price.',
        tieredPricing: []
      }
    }
  } catch {
    return {
      suggestedPrice: input.basePrice,
      currency: input.currency || 'USD',
      rationale: 'AI request failed; using base price.',
      tieredPricing: []
    }
  }
}



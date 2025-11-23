type PitchInput = {
  brandName?: string
  deliverables?: string[]
  audience?: string
  tone?: 'professional' | 'friendly' | 'bold'
  valueProps?: string[]
}

export async function generatePitch(input: PitchInput) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      subject: `Collaboration with ${input.brandName || 'your brand'}`,
      email:
        'Hi there,\n\nI love what your brand is doing and would be excited to collaborate. My audience is highly engaged with travel content across Africa. I can deliver the agreed content with clear storytelling and measurable results.\n\nWould you be open to a quick chat this week?\n\nBest,\n[Your Name]\n',
      talkingPoints: ['Audience fit', 'Storytelling angle', 'Measurable outcomes'],
      notes: 'Mock pitch because OPENAI_API_KEY is not set.'
    }
  }
  try {
    const prompt = [
      'You draft a succinct influencer pitch email and talking points.',
      'Return JSON: { subject, email, talkingPoints: string[], notes?: string }',
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
      return { subject: '', email: '', talkingPoints: [], notes: 'AI parse failed.' }
    }
  } catch {
    return { subject: '', email: '', talkingPoints: [], notes: 'AI request failed.' }
  }
}



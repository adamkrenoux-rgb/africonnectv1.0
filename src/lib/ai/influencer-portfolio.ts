type SocialSnapshot = {
  instagram?: { followers?: number; engagementRate?: number }
  youtube?: { subscribers?: number; avgViews?: number }
  tiktok?: { followers?: number; avgViews?: number }
  twitter?: { followers?: number }
}

type GenerateInput = {
  name?: string
  niches?: string[]
  links?: Record<string, string | undefined>
  socials?: SocialSnapshot
}

export async function generatePortfolioDraft(input: GenerateInput) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return {
      headline: `${input.name || 'Travel Creator'} | Authentic African Experiences`,
      bio:
        'I create authentic travel stories across Africa, highlighting local businesses, culture, and unforgettable adventures. Brands partner with me for honest content and highly engaged audiences.',
      niches: input.niches || ['safari', 'culture', 'adventure'],
      stats: {
        followers: {
          instagram: input.socials?.instagram?.followers || 0,
          youtube: input.socials?.youtube?.subscribers || 0,
          tiktok: input.socials?.tiktok?.followers || 0
        },
        avgEngagement: input.socials?.instagram?.engagementRate || 0.03
      },
      links: input.links || {}
    }
  }
  try {
    const prompt = [
      'You generate a concise influencer media kit draft for a travel creator.',
      'Return JSON: { headline, bio, niches: string[], stats: object, links: object }',
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
      return {
        headline: input.name || 'Travel Creator',
        bio: 'Media kit draft could not be parsed; please edit manually.',
        niches: input.niches || [],
        stats: {},
        links: input.links || {}
      }
    }
  } catch {
    return {
      headline: input.name || 'Travel Creator',
      bio: 'Media kit draft could not be generated due to an error.',
      niches: input.niches || [],
      stats: {},
      links: input.links || {}
    }
  }
}

export function renderPortfolioMarkdown(portfolio: {
  headline?: string
  bio?: string
  niches?: string[]
  stats?: any
  links?: Record<string, string | undefined>
}) {
  const lines: string[] = []
  if (portfolio.headline) lines.push(`# ${portfolio.headline}`)
  if (portfolio.bio) lines.push('', portfolio.bio)
  if (portfolio.niches?.length) lines.push('', '## Niches', `- ${portfolio.niches.join('\n- ')}`)
  if (portfolio.stats) lines.push('', '## Stats', '```json', JSON.stringify(portfolio.stats, null, 2), '```')
  if (portfolio.links) {
    lines.push('', '## Links')
    for (const [k, v] of Object.entries(portfolio.links)) {
      if (v) lines.push(`- ${k}: ${v}`)
    }
  }
  return lines.join('\n')
}



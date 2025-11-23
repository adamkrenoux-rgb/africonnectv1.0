import { aiHelper } from '@/lib/ai-helper'

export type RecommendationCandidateType = 'listing' | 'business' | 'experience'

export interface RecommendationCandidate {
  id: string
  type: RecommendationCandidateType
  title: string
  tags?: string[]
  region?: string | null
  metadata?: Record<string, any>
}

export interface TravelerContext {
  profile: {
    travelerType?: string | null
    preferredActivities?: string[]
    preferredBudgetRange?: any
    preferredLanguages?: string[]
    mobilityNeeds?: string | null
    accessibilityNotes?: string | null
  }
  preferences?: Record<string, any>
  history?: Array<{
    bookingId?: string | null
    tags?: string[]
  }>
  tripPlans?: Array<{
    id: string
    title: string
    tags?: string[]
  }>
}

export interface GeneratedRecommendation {
  id: string
  type: RecommendationCandidateType
  score: number
  reason: string
}

export interface RecommendationResult {
  success: boolean
  provider: 'openai' | 'mock'
  recommendations: GeneratedRecommendation[]
  error?: string
}

export async function generateTravelerRecommendations(
  travelerContext: TravelerContext,
  candidates: RecommendationCandidate[],
  options: { topK?: number } = {}
): Promise<RecommendationResult> {
  if (!candidates.length) {
    return {
      success: true,
      provider: 'mock',
      recommendations: []
    }
  }

  const topK = options.topK || 10

  const prompt = [
    'You are Connexus\'s recommendation engine.',
    'Rank the provided candidates for the traveler based on profile, preferences, and history.',
    'Outputs must be JSON array: [{ "id": string, "type": "listing"|"business"|"experience", "score": number (0-1), "reason": string }].',
    'Return only JSON.',
    'Traveler context:',
    JSON.stringify(travelerContext, null, 2),
    'Candidates:',
    JSON.stringify(candidates, null, 2),
    `Return at most ${topK} items, sorted by score descending.`
  ].join('\n\n')

  const response = await aiHelper.generateResponse({
    prompt,
    maxTokens: 900,
    temperature: 0.4,
    model: 'gpt-4o-mini'
  })

  if (!response.success || typeof response.data !== 'string') {
    return {
      success: true,
      provider: 'mock',
      recommendations: getHeuristicRecommendations(travelerContext, candidates, topK)
    }
  }

  try {
    const parsed = JSON.parse(response.data)
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid AI response shape')
    }

    const valid = parsed
      .filter((item: any) => {
        return (
          item &&
          typeof item.id === 'string' &&
          ['listing', 'business', 'experience'].includes(item.type) &&
          typeof item.score === 'number'
        )
      })
      .map((item: any) => ({
        id: item.id,
        type: item.type as RecommendationCandidateType,
        score: clampScore(item.score),
        reason: typeof item.reason === 'string' ? item.reason : 'Recommended based on your travel interests.'
      }))
      .slice(0, topK)

    if (!valid.length) {
      throw new Error('No valid AI recommendations')
    }

    return {
      success: true,
      provider: response.source,
      recommendations: valid
    }
  } catch (error) {
    console.warn('Failed to parse AI recommendations, falling back to heuristics:', error)
    return {
      success: true,
      provider: response.source,
      recommendations: getHeuristicRecommendations(travelerContext, candidates, topK)
    }
  }
}

function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0.5
  return Math.min(Math.max(score, 0), 1)
}

function getHeuristicRecommendations(
  travelerContext: TravelerContext,
  candidates: RecommendationCandidate[],
  topK: number
): GeneratedRecommendation[] {
  const preferredTags = new Set(
    (travelerContext.profile.preferredActivities || [])
      .concat(travelerContext.tripPlans?.flatMap((plan) => plan.tags ?? []) || [])
      .filter(Boolean)
  )

  const historyTags = new Set(
    travelerContext.history?.flatMap((entry) => entry.tags ?? [])?.filter(Boolean) ?? []
  )

  const scored = candidates.map((candidate) => {
    const tags = new Set(candidate.tags ?? [])
    let score = 0.4
    let reasonParts: string[] = []

    if (tags.size && preferredTags.size) {
      const matches = Array.from(tags).filter((tag) => preferredTags.has(tag))
      if (matches.length) {
        score += matches.length * 0.1
        reasonParts.push(`Matches your interests in ${matches.join(', ')}`)
      }
    }

    if (tags.size && historyTags.size) {
      const overlaps = Array.from(tags).filter((tag) => historyTags.has(tag))
      if (overlaps.length) {
        score += overlaps.length * 0.05
        reasonParts.push('Similar to past trips you enjoyed')
      }
    }

    if (candidate.region && travelerContext.profile?.preferredLanguages?.length) {
      score += 0.05
    }

    return {
      id: candidate.id,
      type: candidate.type,
      score: clampScore(score),
      reason: reasonParts.join('. ') || 'Popular with travelers like you.'
    }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}


import { aiHelper } from '@/lib/ai-helper'

interface TripHealthCheckInput {
  tripPlan: {
    title: string
    destinations?: any
    activities?: any
    startDate?: string | null
    endDate?: string | null
  }
  travelerProfile?: {
    travelerType?: string | null
    preferredBudgetRange?: any
    preferredActivities?: string[]
    mobilityNeeds?: string | null
    accessibilityNotes?: string | null
  } | null
  context?: Record<string, any>
}

interface TripHealthCheckResult {
  success: boolean
  provider: 'openai' | 'mock'
  summary: string
  issues: Array<{
    id: string
    title: string
    severity: 'info' | 'warning' | 'critical'
    description: string
    recommendation: string
  }>
  recommendations: Record<string, any>
  raw?: any
  error?: string
}

export async function runTripHealthCheck({
  tripPlan,
  travelerProfile,
  context
}: TripHealthCheckInput): Promise<TripHealthCheckResult> {
  const prompt = [
    'You are the Africonnect Trip Health AI assistant.',
    'Evaluate the traveler plan for safety, logistics, and completeness.',
    'Identify missing logistics (transport, permits, insurance, health requirements) and cultural considerations.',
    'Return a JSON object with the shape:',
    '{ "summary": string, "issues": [{ "id": string, "title": string, "severity": "info"|"warning"|"critical", "description": string, "recommendation": string }], "recommendations": Record<string, any> }',
    'Do not provide Markdown, only JSON.',
    'Trip plan details:',
    JSON.stringify(tripPlan, null, 2),
    travelerProfile ? `Traveler profile: ${JSON.stringify(travelerProfile, null, 2)}` : '',
    context ? `Additional context: ${JSON.stringify(context, null, 2)}` : ''
  ]
    .filter(Boolean)
    .join('\n\n')

  const response = await aiHelper.generateResponse({
    prompt,
    maxTokens: 800,
    temperature: 0.3,
    model: 'gpt-4o-mini'
  })

  if (!response.success || typeof response.data !== 'string') {
    return {
      success: true,
      provider: 'mock',
      summary:
        'Based on your destinations, double-check transport connections, local permits, and health advisories before departure.',
      issues: [
        {
          id: 'mock-transport',
          title: 'Transport Confirmation Pending',
          severity: 'warning',
          description: 'We could not verify your inter-city transport arrangements.',
          recommendation: 'Confirm airport transfers and regional transport availability ahead of time.'
        },
        {
          id: 'mock-permits',
          title: 'Permit Requirements',
          severity: 'info',
          description: 'Certain activities may require special permits or park fees.',
          recommendation: 'Review national park or conservation area permit requirements and budget for them.'
        }
      ],
      recommendations: {
        safety: 'Share your itinerary with a trusted contact and keep copies of key documents.',
        health: 'Review vaccination requirements and pack a basic medical kit.',
        logistics: 'Check mobile coverage and download offline maps for remote areas.'
      },
      raw: response.data
    }
  }

  try {
    const parsed = JSON.parse(response.data)
    if (!parsed || typeof parsed.summary !== 'string' || !Array.isArray(parsed.issues)) {
      throw new Error('Invalid AI response shape')
    }

    return {
      success: true,
      provider: response.source,
      summary: parsed.summary,
      issues: parsed.issues.map((issue: any, index: number) => ({
        id: issue.id || `issue-${index + 1}`,
        title: issue.title || 'Trip Consideration',
        severity: ['info', 'warning', 'critical'].includes(issue.severity)
          ? issue.severity
          : 'info',
        description: issue.description || '',
        recommendation: issue.recommendation || ''
      })),
      recommendations: parsed.recommendations || {},
      raw: parsed
    }
  } catch (error) {
    console.warn('Failed to parse trip health check response, falling back to mock data:', error)
    return {
      success: true,
      provider: response.source,
      summary:
        'We highlighted potential gaps in your itinerary. Double-check logistics, local permits, and health requirements.',
      issues: [
        {
          id: 'fallback-info',
          title: 'Review Trip Logistics',
          severity: 'info',
          description: 'Ensure transport, accommodation, and emergency contacts are confirmed.',
          recommendation:
            'Add backup transport options and verify emergency contacts for each region.'
        }
      ],
      recommendations: {
        sustainability: 'Consider community-led experiences to deepen cultural immersion.'
      },
      raw: response.data
    }
  }
}


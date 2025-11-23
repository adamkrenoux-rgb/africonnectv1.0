import { aiHelper } from '@/lib/ai-helper'

export interface OnboardingState {
  answers: Array<{
    question: string
    answer: string
    category?: string
  }>
  travelerProfile?: Record<string, any>
}

export interface OnboardingStep {
  question: string
  category: 'preferences' | 'budget' | 'logistics' | 'safety' | 'culture' | 'other'
  helperText?: string
  expectedType?: 'text' | 'number' | 'choice' | 'multi-select'
  suggestedChoices?: string[]
}

export interface OnboardingResult {
  success: boolean
  provider: 'openai' | 'mock'
  step: OnboardingStep
  summary?: string
}

export async function generateOnboardingStep(state: OnboardingState): Promise<OnboardingResult> {
  const answeredQuestions = (state.answers || []).map(a => a.question.toLowerCase())
  const answeredCategories = (state.answers || []).map(a => a.category).filter(Boolean)
  
  const prompt = [
    'You are designing a conversational onboarding flow for Connexus travelers.',
    'Ask one thoughtful question at a time to capture travel preferences, safety considerations, and logistics.',
    'IMPORTANT: Do NOT repeat any questions that have already been asked. Check the "Previous answers" list carefully.',
    'IMPORTANT: Vary the categories. If you have already asked about preferences, move to budget, logistics, safety, or culture.',
    'Return JSON: { "question": string, "category": "preferences"|"budget"|"logistics"|"safety"|"culture"|"other", "helperText": string?, "expectedType": "text"|"number"|"choice"|"multi-select", "suggestedChoices": string[]?, "summary": string? }',
    'Ensure the question is warm, culturally aware, and actionable.',
    'Previous answers (DO NOT repeat these questions):',
    JSON.stringify(state.answers || [], null, 2),
    `Already asked categories: ${answeredCategories.join(', ') || 'none'}`,
    state.travelerProfile ? `Traveler profile hints: ${JSON.stringify(state.travelerProfile, null, 2)}` : ''
  ].join('\n\n')

  const response = await aiHelper.generateResponse({
    prompt,
    maxTokens: 400,
    temperature: 0.5,
    model: 'gpt-4o-mini'
  })

  // Always use smart mock logic to ensure unique questions
  // (Even if AI responds, we validate it's not a duplicate)
  const useMockFallback = !response.success || typeof response.data !== 'string'
  
  if (useMockFallback) {
    const mockQuestions = [
      { question: 'What type of experiences are you hoping to prioritize on this trip (e.g., wildlife, culture, relaxation)?', category: 'preferences' as const, helperText: 'This helps us curate suggestions that match your vibe.', expectedType: 'text' as const },
      { question: 'What is your approximate budget range for this trip?', category: 'budget' as const, helperText: 'This helps us suggest experiences within your comfort zone.', expectedType: 'choice' as const, suggestedChoices: ['Budget-friendly ($500-1500)', 'Mid-range ($1500-3000)', 'Premium ($3000+)'] },
      { question: 'How do you prefer to travel between destinations?', category: 'logistics' as const, helperText: 'We can help arrange transport that fits your style.', expectedType: 'choice' as const, suggestedChoices: ['Private transport', 'Shared/group transport', 'Public transport', 'Mix of options'] },
      { question: 'Are there any specific safety concerns or health considerations we should be aware of?', category: 'safety' as const, helperText: 'This helps us provide relevant safety tips and recommendations.', expectedType: 'text' as const },
      { question: 'What cultural aspects of Africa are you most interested in exploring?', category: 'culture' as const, helperText: 'We can connect you with authentic cultural experiences.', expectedType: 'choice' as const, suggestedChoices: ['Traditional music & dance', 'Local cuisine', 'Art & crafts', 'Religious sites', 'Community interactions', 'Historical sites'] },
      { question: 'Do you prefer guided tours or independent exploration?', category: 'preferences' as const, helperText: 'This helps us tailor recommendations to your travel style.', expectedType: 'choice' as const, suggestedChoices: ['Fully guided', 'Mostly independent', 'Mix of both'] },
      { question: 'What is your preferred accommodation style?', category: 'preferences' as const, helperText: 'We can match you with the right lodging options.', expectedType: 'choice' as const, suggestedChoices: ['Luxury lodges', 'Mid-range hotels', 'Budget-friendly', 'Camping', 'Local homestays'] }
    ]
    
    // Find a question that hasn't been asked yet
    const availableQuestions = mockQuestions.filter(q => 
      !answeredQuestions.some(aq => aq.includes(q.question.toLowerCase().substring(0, 20)))
    )
    
    const selectedQuestion = availableQuestions.length > 0 
      ? availableQuestions[0] 
      : mockQuestions[Math.min(state.answers?.length || 0, mockQuestions.length - 1)]
    
    return {
      success: true,
      provider: 'mock',
      step: {
        question: selectedQuestion.question,
        category: selectedQuestion.category,
        helperText: selectedQuestion.helperText,
        expectedType: selectedQuestion.expectedType,
        suggestedChoices: selectedQuestion.suggestedChoices
      },
      summary: `Gathering ${selectedQuestion.category} information for personalized recommendations.`
    }
  }

  // Try to parse JSON response, but use smart mock fallback if it fails
  let parsed: any = null
  try {
    // Check if response looks like JSON
    const trimmed = response.data.trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      parsed = JSON.parse(response.data)
    } else {
      throw new Error('Response is not JSON')
    }
  } catch (error) {
    // Not JSON or parse failed - use smart mock
    console.warn('AI response is not JSON, using smart mock fallback')
    parsed = null
  }

  if (parsed && typeof parsed.question === 'string' && typeof parsed.category === 'string') {
    // Validate that this question hasn't been asked
    const questionLower = parsed.question.toLowerCase()
    const alreadyAsked = answeredQuestions.some(aq => 
      aq.includes(questionLower.substring(0, 30)) || questionLower.includes(aq.substring(0, 30))
    )
    
    if (alreadyAsked) {
      console.warn('AI returned a duplicate question, using mock fallback')
      parsed = null
    }
  } else {
    parsed = null
  }

  // If we have valid parsed response, use it
  if (parsed) {
    return {
      success: true,
      provider: response.source,
      step: {
        question: parsed.question,
        category: parsed.category,
        helperText: parsed.helperText,
        expectedType: parsed.expectedType,
        suggestedChoices: parsed.suggestedChoices
      },
      summary: parsed.summary
    }
  }

  // Otherwise, use smart mock that avoids duplicates
  const mockQuestions = [
    { question: 'What type of experiences are you hoping to prioritize on this trip (e.g., wildlife, culture, relaxation)?', category: 'preferences' as const, helperText: 'This helps us curate suggestions that match your vibe.', expectedType: 'text' as const },
    { question: 'What is your approximate budget range for this trip?', category: 'budget' as const, helperText: 'This helps us suggest experiences within your comfort zone.', expectedType: 'choice' as const, suggestedChoices: ['Budget-friendly ($500-1500)', 'Mid-range ($1500-3000)', 'Premium ($3000+)'] },
    { question: 'How do you prefer to travel between destinations?', category: 'logistics' as const, helperText: 'We can help arrange transport that fits your style.', expectedType: 'choice' as const, suggestedChoices: ['Private transport', 'Shared/group transport', 'Public transport', 'Mix of options'] },
    { question: 'Are there any specific safety concerns or health considerations we should be aware of?', category: 'safety' as const, helperText: 'This helps us provide relevant safety tips and recommendations.', expectedType: 'text' as const },
    { question: 'What cultural aspects of Africa are you most interested in exploring?', category: 'culture' as const, helperText: 'We can connect you with authentic cultural experiences.', expectedType: 'choice' as const, suggestedChoices: ['Traditional music & dance', 'Local cuisine', 'Art & crafts', 'Religious sites', 'Community interactions', 'Historical sites'] },
    { question: 'Do you prefer guided tours or independent exploration?', category: 'preferences' as const, helperText: 'This helps us tailor recommendations to your travel style.', expectedType: 'choice' as const, suggestedChoices: ['Fully guided', 'Mostly independent', 'Mix of both'] },
    { question: 'What is your preferred accommodation style?', category: 'preferences' as const, helperText: 'We can match you with the right lodging options.', expectedType: 'choice' as const, suggestedChoices: ['Luxury lodges', 'Mid-range hotels', 'Budget-friendly', 'Camping', 'Local homestays'] },
    { question: 'How many days are you planning to travel?', category: 'logistics' as const, helperText: 'This helps us suggest the right pace for your trip.', expectedType: 'choice' as const, suggestedChoices: ['3-5 days', '1 week', '2 weeks', '3+ weeks'] },
    { question: 'What time of year are you planning to travel?', category: 'logistics' as const, helperText: 'Seasons affect availability and pricing.', expectedType: 'choice' as const, suggestedChoices: ['Dry season (June-October)', 'Wet season (November-May)', 'Flexible'] }
  ]
  
  // Filter out questions that have already been asked
  // Check both by question text and by category to ensure variety
  const availableQuestions = mockQuestions.filter(q => {
    const qLower = q.question.toLowerCase()
    const qStart = qLower.substring(0, 25) // First 25 chars for comparison
    
    // Check if this exact question or a very similar one was asked
    const questionAlreadyAsked = answeredQuestions.some(aq => {
      const aqLower = aq.toLowerCase()
      const aqStart = aqLower.substring(0, 25)
      // Questions are similar if they start the same way or contain each other
      return qStart === aqStart || 
             aqLower.includes(qStart) || 
             qLower.includes(aqStart) ||
             // Also check if key words match
             (qLower.split(/\s+/).filter(w => w.length > 4).some(w => aqLower.includes(w)) &&
              aqLower.split(/\s+/).filter(w => w.length > 4).some(w => qLower.includes(w)))
    })
    
    // Prefer questions from categories we haven't asked about yet
    const categoryAlreadyUsed = answeredCategories.includes(q.category)
    
    // If we've asked fewer than 3 questions, prefer unused categories
    // After 3, allow category repeats but still avoid duplicate questions
    if (state.answers.length < 3) {
      return !questionAlreadyAsked && !categoryAlreadyUsed
    } else {
      return !questionAlreadyAsked
    }
  })
  
  // If we've asked all questions in a category, allow repeats but prefer unused categories
  let selectedQuestion = availableQuestions[0]
  if (!selectedQuestion) {
    // All questions asked, cycle through by index
    const index = (state.answers?.length || 0) % mockQuestions.length
    selectedQuestion = mockQuestions[index]
  }
  
  return {
    success: true,
    provider: 'mock',
    step: {
      question: selectedQuestion.question,
      category: selectedQuestion.category,
      helperText: selectedQuestion.helperText,
      expectedType: selectedQuestion.expectedType,
      suggestedChoices: selectedQuestion.suggestedChoices
    },
    summary: `Gathering ${selectedQuestion.category} information for personalized recommendations.`
  }
}


import { aiHelper } from '@/lib/ai-helper'

export interface TravelerChatMessageInput {
  role: 'traveler' | 'assistant'
  content: string
  timestamp?: string
}

export interface TravelerChatContext {
  travelerProfile?: Record<string, any>
  preferences?: Record<string, any>
  recentTrips?: Array<Record<string, any>>
  locale?: string
}

export interface TravelerChatResponse {
  success: boolean
  provider: 'openai' | 'mock'
  reply: string
  suggestions: string[]
  topics?: string[]
  error?: string
}

export async function generateTravelerChatResponse(
  history: TravelerChatMessageInput[],
  travelerMessage: string,
  context: TravelerChatContext
): Promise<TravelerChatResponse> {
  // Build conversation context from history
  const conversationContext = history
    .slice(-10) // Last 10 messages for context
    .map(msg => `${msg.role === 'traveler' ? 'Traveler' : 'Assistant'}: ${msg.content}`)
    .join('\n')
  
  const promptParts = [
    'You are Connexus\'s travel concierge, an expert on African travel.',
    'Your role is to provide accurate, helpful, and culturally sensitive travel advice for Africa.',
    'IMPORTANT: Only provide information you are confident about. If you are unsure, say so.',
    'IMPORTANT: Focus on practical, actionable advice. Include specific details like pricing ranges, best times to visit, and booking tips.',
    'IMPORTANT: Read the conversation history carefully and provide a unique, contextual response. Do NOT repeat previous responses.',
    'IMPORTANT: Reference specific details from the conversation history when relevant.',
    'Suggest next steps for the traveler and highlight safety or logistical considerations when relevant.',
    'Return ONLY a valid JSON object with this exact shape: { "reply": "your response here", "suggestions": ["suggestion 1", "suggestion 2"], "topics": ["topic1", "topic2"] }',
    'Do not include any text outside the JSON object.',
    context.locale ? `Respond in ${context.locale}.` : '',
    'Conversation history:',
    conversationContext || 'This is the start of the conversation.',
    'Traveler profile:',
    JSON.stringify(context.travelerProfile || {}, null, 2),
    'Traveler preferences:',
    JSON.stringify(context.preferences || {}, null, 2),
    'Recent trips:',
    JSON.stringify(context.recentTrips || [], null, 2),
    'Current traveler message:',
    travelerMessage
  ]

  const prompt = promptParts.filter(Boolean).join('\n\n')

  console.log('Generating AI chat response for traveler message:', travelerMessage.substring(0, 50))
  const response = await aiHelper.generateResponse({
    prompt,
    maxTokens: 700,
    temperature: 0.6,
    model: 'gpt-4o-mini'
  })

  console.log('AI response received:', {
    success: response.success,
    source: response.source,
    hasData: !!response.data,
    dataType: typeof response.data
  })

  // Generate contextual mock response based on conversation
  if (!response.success || typeof response.data !== 'string') {
    console.warn('AI response invalid, using contextual mock. Response:', response)
    const lowerMessage = travelerMessage.toLowerCase()
    const lastUserMessage = history.filter(m => m.role === 'traveler').slice(-1)[0]?.content.toLowerCase() || ''
    
    let reply = ''
    let suggestions: string[] = []
    let topics: string[] = []
    
    if (lowerMessage.includes('safety') || lowerMessage.includes('safe') || lowerMessage.includes('security')) {
      reply = 'Safety is a top priority! I recommend checking travel advisories for your specific destinations, ensuring you have comprehensive travel insurance, and keeping copies of important documents. Many regions have excellent local guides who know the safest routes and practices.'
      suggestions = ['Check country-specific travel advisories', 'Review health and vaccination requirements', 'Connect with verified local guides']
      topics = ['safety', 'travel advisories']
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      reply = 'Budget planning is key! Experiences on Connexus range from budget-friendly community tours ($50-150) to premium safari packages ($2000+). I can help you find options that match your budget while maximizing value. Would you like recommendations for a specific price range?'
      suggestions = ['Explore budget-friendly experiences', 'Compare mid-range options', 'View premium packages']
      topics = ['budget', 'pricing']
    } else if (lowerMessage.includes('culture') || lowerMessage.includes('local') || lowerMessage.includes('authentic')) {
      reply = 'Authentic cultural experiences are what make travel special! I recommend community-led tours, local market visits, traditional cooking classes, and cultural performances. These experiences support local communities and give you genuine insights into African cultures.'
      suggestions = ['Find community-led cultural tours', 'Explore local market experiences', 'Book traditional cooking classes']
      topics = ['cultural experiences', 'authentic travel']
    } else if (lowerMessage.includes('wildlife') || lowerMessage.includes('safari') || lowerMessage.includes('animals')) {
      reply = 'Wildlife experiences in Africa are incredible! The best times vary by region - for example, the Great Migration in Serengeti peaks July-September. I can help you find verified safari operators and the best viewing seasons for your preferred destinations.'
      suggestions = ['Find verified safari operators', 'Check best wildlife viewing seasons', 'Explore conservation experiences']
      topics = ['wildlife', 'safari']
    } else {
      // Generic but varied response
      const genericReplies = [
        'That\'s a great question! Based on your interests, I\'d recommend starting with verified local businesses in your destination. They offer authentic experiences and often have better safety records. What specific aspect would you like to explore further?',
        'I\'d be happy to help with that! Many travelers find it helpful to start by identifying their top 2-3 must-see experiences, then we can build an itinerary around those. What are you most excited about?',
        'Great to hear! Let me suggest a few approaches: first, check the verification status of businesses you\'re interested in; second, read recent reviews from other travelers; and third, consider booking through our platform for added protection. What would you like to focus on?'
      ]
      const replyIndex = history.length % genericReplies.length
      reply = genericReplies[replyIndex]
      suggestions = ['Browse verified experiences', 'Read traveler reviews', 'Plan your itinerary']
      topics = ['travel planning', 'recommendations']
    }
    
    return {
      success: true,
      provider: 'mock',
      reply,
      suggestions,
      topics
    }
  }

  // Try to parse JSON response, but use contextual mock if it fails
  let parsed: any = null
  try {
    const trimmed = response.data.trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      parsed = JSON.parse(response.data)
    } else {
      throw new Error('Response is not JSON')
    }
  } catch (error) {
    console.warn('AI response is not JSON, using contextual mock')
    parsed = null
  }

  if (parsed && typeof parsed.reply === 'string') {
    // Check if this reply is too similar to previous ones
    const previousReplies = history
      .filter(m => m.role === 'assistant')
      .map(m => m.content.toLowerCase())
    
    const replyLower = parsed.reply.toLowerCase()
    const isDuplicate = previousReplies.some(prev => {
      // Check if replies are very similar (more than 50% overlap)
      const words = replyLower.split(/\s+/)
      const prevWords = prev.split(/\s+/)
      const commonWords = words.filter((w: string) => prevWords.includes(w))
      return commonWords.length / Math.max(words.length, prevWords.length) > 0.5
    })
    
    if (!isDuplicate) {
      return {
        success: true,
        provider: response.source,
        reply: parsed.reply,
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        topics: Array.isArray(parsed.topics) ? parsed.topics : []
      }
    }
    // If duplicate, fall through to mock
    console.warn('AI returned duplicate response, using contextual mock')
  }

  // Use contextual mock based on conversation - track what we've already said
  const lowerMessage = travelerMessage.toLowerCase()
  const allMessages = history.map(m => m.content.toLowerCase()).join(' ')
  const conversationText = `${allMessages} ${lowerMessage}`
  
  // Get all previous assistant replies to avoid repetition
  const previousReplies = history
    .filter(m => m.role === 'assistant')
    .map(m => m.content.toLowerCase())
  
  // Count how many times we've responded to similar topics
  const topicCounts: Record<string, number> = {}
  previousReplies.forEach(prev => {
    if (prev.includes('safety') || prev.includes('safe')) topicCounts['safety'] = (topicCounts['safety'] || 0) + 1
    if (prev.includes('budget') || prev.includes('price')) topicCounts['budget'] = (topicCounts['budget'] || 0) + 1
    if (prev.includes('culture') || prev.includes('local')) topicCounts['culture'] = (topicCounts['culture'] || 0) + 1
    if (prev.includes('wildlife') || prev.includes('safari')) topicCounts['wildlife'] = (topicCounts['wildlife'] || 0) + 1
    if (prev.includes('accommodation') || prev.includes('hotel')) topicCounts['accommodation'] = (topicCounts['accommodation'] || 0) + 1
    if (prev.includes('transport') || prev.includes('travel')) topicCounts['transport'] = (topicCounts['transport'] || 0) + 1
  })
  
  let reply = ''
  let suggestions: string[] = []
  let topics: string[] = []
  
  // Prioritize topics we haven't discussed much, but still respond to current question
  if ((conversationText.includes('safety') || conversationText.includes('safe') || conversationText.includes('security')) && (topicCounts['safety'] || 0) < 2) {
    reply = 'Safety is a top priority! I recommend checking travel advisories for your specific destinations, ensuring you have comprehensive travel insurance, and keeping copies of important documents. Many regions have excellent local guides who know the safest routes and practices.'
    suggestions = ['Check country-specific travel advisories', 'Review health and vaccination requirements', 'Connect with verified local guides']
    topics = ['safety', 'travel advisories']
  } else if ((conversationText.includes('budget') || conversationText.includes('price') || conversationText.includes('cost')) && (topicCounts['budget'] || 0) < 2) {
    reply = 'Budget planning is key! Experiences on Connexus range from budget-friendly community tours ($50-150) to premium safari packages ($2000+). I can help you find options that match your budget while maximizing value. Would you like recommendations for a specific price range?'
    suggestions = ['Explore budget-friendly experiences', 'Compare mid-range options', 'View premium packages']
    topics = ['budget', 'pricing']
  } else if ((conversationText.includes('culture') || conversationText.includes('local') || conversationText.includes('authentic')) && (topicCounts['culture'] || 0) < 2) {
    reply = 'Authentic cultural experiences are what make travel special! I recommend community-led tours, local market visits, traditional cooking classes, and cultural performances. These experiences support local communities and give you genuine insights into African cultures.'
    suggestions = ['Find community-led cultural tours', 'Explore local market experiences', 'Book traditional cooking classes']
    topics = ['cultural experiences', 'authentic travel']
  } else if ((conversationText.includes('wildlife') || conversationText.includes('safari') || conversationText.includes('animals')) && (topicCounts['wildlife'] || 0) < 2) {
    reply = 'Wildlife experiences in Africa are incredible! The best times vary by region - for example, the Great Migration in Serengeti peaks July-September. I can help you find verified safari operators and the best viewing seasons for your preferred destinations.'
    suggestions = ['Find verified safari operators', 'Check best wildlife viewing seasons', 'Explore conservation experiences']
    topics = ['wildlife', 'safari']
  } else if ((conversationText.includes('accommodation') || conversationText.includes('hotel') || conversationText.includes('lodge') || conversationText.includes('stay')) && (topicCounts['accommodation'] || 0) < 2) {
    reply = 'Accommodation options vary widely across Africa! From luxury safari lodges to budget-friendly guesthouses and authentic homestays, there\'s something for every traveler. I can help you find verified accommodations that match your style and budget. What type of experience are you looking for?'
    suggestions = ['Browse luxury lodges', 'Find budget-friendly options', 'Explore local homestays']
    topics = ['accommodation', 'lodging']
  } else if ((conversationText.includes('transport') || conversationText.includes('getting around')) && (topicCounts['transport'] || 0) < 2) {
    reply = 'Transportation planning is important! Options include private transfers, shared shuttles, domestic flights, and public transport. I can help you find the best options based on your itinerary and budget. What destinations are you planning to visit?'
    suggestions = ['Find private transport options', 'Compare flight prices', 'Explore shared transport']
    topics = ['transportation', 'logistics']
  } else {
    // Generic but varied response - use message content and history to generate unique responses
    const messageHash = travelerMessage.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const historyHash = history.length
    const combinedHash = (messageHash + historyHash) % 10
    
    const genericReplies = [
      `Thanks for that question! ${travelerMessage.includes('?') ? 'Let me help you with that.' : 'I understand you\'re interested in that.'} Based on what you\'ve shared, I\'d recommend exploring verified local businesses. They offer authentic experiences with better safety records. What specific aspect interests you most?`,
      `I appreciate you asking about that! Many travelers find it helpful to start by identifying their top 2-3 must-see experiences, then we can build an itinerary around those. ${travelerMessage.length > 20 ? 'You mentioned something specific - can you tell me more?' : 'What are you most excited about?'}`,
      `Great question! Let me suggest a few approaches: first, check the verification status of businesses you're interested in; second, read recent reviews from other travelers; and third, consider booking through our platform for added protection. ${history.length > 2 ? 'Based on our conversation, ' : ''}What would you like to focus on?`,
      `I can definitely help with that! Have you thought about what type of experiences interest you most? Whether it's wildlife, culture, adventure, or relaxation, I can suggest verified businesses that match your preferences. ${lowerMessage.length > 15 ? 'You seem interested in something specific - what is it?' : 'What catches your interest?'}`,
      `That's an important consideration! Let me help you find the best options. What's your primary goal for this trip - are you looking for adventure, cultural immersion, relaxation, or a mix of everything? ${history.length > 1 ? 'I remember you mentioned something earlier - can you remind me?' : ''}`,
      `I'd be happy to help! ${travelerMessage.length > 10 ? 'You asked about something specific - let me address that.' : 'Let me guide you through the options.'} Many travelers start by choosing a destination, then we can find verified businesses and experiences there. Where are you thinking of going?`,
      `That's a great point! ${lowerMessage.includes('how') ? 'Here\'s how it works:' : lowerMessage.includes('what') ? 'Here\'s what I recommend:' : 'Let me explain:'} Start by browsing our verified businesses, read reviews from other travelers, and check their safety ratings. What region or country are you most interested in?`,
      `I understand! ${history.length > 0 ? 'Building on what we discussed, ' : ''}Let me help you plan this. The best approach is to identify your must-see experiences first, then find verified businesses that offer them. What's at the top of your list?`,
      `Excellent question! ${travelerMessage.length > 5 ? 'You\'re asking about something important.' : 'This is a common concern.'} I recommend starting with verified businesses that have high trust scores and positive reviews. What type of experience are you looking for?`,
      `Thanks for reaching out! ${lowerMessage.includes('help') ? 'I\'m here to help!' : 'I can definitely assist with that.'} Let's start by understanding what you're looking for. Are you interested in wildlife, culture, adventure, or a combination?`
    ]
    
    reply = genericReplies[combinedHash]
    suggestions = ['Browse verified experiences', 'Read traveler reviews', 'Plan your itinerary']
    topics = ['travel planning', 'recommendations']
  }
  
  return {
    success: true,
    provider: 'mock',
    reply,
    suggestions,
    topics
  }
}


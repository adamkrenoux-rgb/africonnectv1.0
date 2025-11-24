interface AIResponse {
  success: boolean
  data?: any
  error?: string
  source: 'openai' | 'mock'
  tokensUsed?: number
  cost?: number
}

interface AIRequest {
  prompt: string
  maxTokens?: number
  temperature?: number
  model?: string
}

class AIHelper {
  /**
   * Get OpenAI API key dynamically (checks on each call)
   * This ensures we pick up env var changes without restarting
   */
  private getOpenAIApiKey(): string | null {
    const key = process.env.OPENAI_API_KEY || null
    
    // Validate the key is not a placeholder
    if (!key) {
      return null
    }
    
    if (
      key === 'your_openai_api_key' ||
      key.startsWith('your_') ||
      key.length < 20 ||
      !key.startsWith('sk-')
    ) {
      return null
    }
    
    return key
  }

  /**
   * Check if OpenAI is available
   */
  private isOpenAIAvailable(): boolean {
    return !!this.getOpenAIApiKey()
  }

  /**
   * Generate AI response with fallback to mock data
   */
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const apiKey = this.getOpenAIApiKey()
      if (apiKey) {
        console.log('[AI Helper] OpenAI API key found, attempting API call')
        return await this.callOpenAI(request, apiKey)
      } else {
        console.warn('[AI Helper] OpenAI API key not found or invalid, using mock response')
        console.warn('[AI Helper] Check that OPENAI_API_KEY is set in .env.local and starts with "sk-"')
        return await this.getMockResponse(request)
      }
    } catch (error) {
      console.error('[AI Helper] Error:', error)
      // Fallback to mock response on any error
      return await this.getMockResponse(request)
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(request: AIRequest, apiKey: string): Promise<AIResponse> {
    try {
      const model = request.model || 'gpt-4o-mini'
      console.log(`[AI Helper] Calling OpenAI API with model: ${model}`)
      console.log(`[AI Helper] API key length: ${apiKey.length}, starts with: ${apiKey.substring(0, 7)}...`)
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant for Africonnect, a platform connecting travelers to authentic African experiences. Provide helpful, accurate, and culturally sensitive responses.'
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          max_tokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          // Not JSON, use raw text
        }
        
        console.error(`[AI Helper] OpenAI API error (${response.status}):`, errorText.substring(0, 500))
        
        // Check for quota/billing errors
        if (errorData?.error?.code === 'insufficient_quota' || errorText.includes('quota')) {
          console.error('[AI Helper] OpenAI API quota exceeded! Please add credits to your OpenAI account.')
          throw new Error('OpenAI API quota exceeded. Please add credits to your OpenAI account at https://platform.openai.com/account/billing')
        }
        
        throw new Error(`OpenAI API error: ${response.status} - ${errorData?.error?.message || errorText.substring(0, 200)}`)
      }

      const data = await response.json()
      const tokensUsed = data.usage?.total_tokens || 0
      const cost = this.calculateCost(tokensUsed)
      const content = data.choices[0]?.message?.content || ''

      console.log(`[AI Helper] OpenAI API success! Tokens used: ${tokensUsed}, Content length: ${content.length}`)
      return {
        success: true,
        data: content,
        source: 'openai',
        tokensUsed,
        cost
      }
    } catch (error: any) {
      console.error('[AI Helper] OpenAI API Error:', error?.message || error)
      // Fallback to mock response
      return await this.getMockResponse(request)
    }
  }

  /**
   * Get mock response when OpenAI is not available
   */
  private async getMockResponse(request: AIRequest): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockResponse = this.generateMockResponse(request.prompt)
    
    return {
      success: true,
      data: mockResponse,
      source: 'mock',
      tokensUsed: 0,
      cost: 0
    }
  }

  /**
   * Generate appropriate mock response based on prompt
   */
  private generateMockResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()

    // Trip planning responses
    if (lowerPrompt.includes('trip') || lowerPrompt.includes('itinerary') || lowerPrompt.includes('travel')) {
      return `Based on your preferences, I recommend exploring the Serengeti National Park in Tanzania for an authentic wildlife experience. Consider staying at local lodges like Serengeti Safari Camp for an immersive experience. The best time to visit is during the dry season (June-October) for optimal wildlife viewing. Don't miss the Great Migration if you're visiting between July-September!`
    }

    // Business listing optimization
    if (lowerPrompt.includes('listing') || lowerPrompt.includes('optimize') || lowerPrompt.includes('business')) {
      return `To optimize your listing, I suggest: 1) Use descriptive titles with location keywords, 2) Add high-quality photos showcasing your unique experiences, 3) Include detailed descriptions with cultural context, 4) Set competitive pricing based on similar offerings, 5) Respond quickly to inquiries. Your listing could benefit from highlighting authentic local partnerships and sustainable tourism practices.`
    }

    // Campaign suggestions
    if (lowerPrompt.includes('campaign') || lowerPrompt.includes('influencer') || lowerPrompt.includes('collaboration')) {
      return `For your campaign, I recommend targeting travel enthusiasts aged 25-45 interested in cultural experiences. Consider creating content around authentic local interactions, traditional cuisine, and sustainable tourism. Suggested deliverables: 3 Instagram posts, 2 Instagram stories, 1 YouTube video. Budget recommendation: $500-1500 based on influencer reach. Focus on storytelling that showcases the real Africa.`
    }

    // General travel advice
    if (lowerPrompt.includes('africa') || lowerPrompt.includes('safari') || lowerPrompt.includes('culture')) {
      return `Africa offers incredible diversity! For first-time visitors, I recommend starting with South Africa or Kenya for ease of travel. Consider the cultural calendar - many festivals happen during specific seasons. Pack for varying climates and bring a good camera for wildlife photography. Respect local customs and support community-based tourism initiatives.`
    }

    // Default response
    return `I'd be happy to help you with your Africonnect experience! Whether you're planning a trip, listing your business, or creating a campaign, I can provide personalized recommendations. Could you tell me more about what you're looking for?`
  }

  /**
   * Calculate estimated cost based on tokens used
   */
  private calculateCost(tokens: number): number {
    // GPT-3.5-turbo pricing: $0.002 per 1K tokens
    return (tokens / 1000) * 0.002
  }

  /**
   * Check if OpenAI is available
   */
  isOpenAIReady(): boolean {
    return this.isOpenAIAvailable()
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): { openaiAvailable: boolean; apiKeyConfigured: boolean } {
    const hasKey = !!this.getOpenAIApiKey()
    return {
      openaiAvailable: hasKey,
      apiKeyConfigured: hasKey
    }
  }
}

// Export singleton instance
export const aiHelper = new AIHelper()

// Export types
export type { AIResponse, AIRequest }

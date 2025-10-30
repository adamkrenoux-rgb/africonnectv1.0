import { NextResponse, NextRequest } from 'next/server'
import { aiHelper } from '@/lib/ai-helper'
import mockResponses from '@/lib/ai-mock-responses'

export async function POST(request: NextRequest) {
  try {
    const { preferences } = await request.json()
    
    // Validate required fields
    if (!preferences.destination || !preferences.duration || !preferences.budget) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: destination, duration, and budget are required'
      }, { status: 400 })
    }

    // Check if we have verified businesses for this destination
    const verifiedBusinesses: any[] = [] // Will be populated from database later
    
    if (verifiedBusinesses.length === 0) {
      return NextResponse.json({
        success: true,
        itinerary: null,
        message: 'No verified results match your search.'
      })
    }

    // Generate AI-powered itinerary
    const prompt = `Create a detailed ${preferences.duration} day itinerary for ${preferences.destination} with a budget of $${preferences.budget}. 
    Activities: ${preferences.activities || 'general tourism'}. 
    Interests: ${preferences.interests || 'culture and wildlife'}. 
    Group size: ${preferences.groupSize || '2 people'}. 
    Travel dates: ${preferences.travelDates || 'flexible'}. 
    
    Include:
    1. Day-by-day detailed itinerary with activities, meals, and accommodation
    2. Realistic travel times between locations
    3. Transport options with costs and durations
    4. Budget breakdown
    5. Local tips and cultural insights
    6. Alternative options for each day
    
    Focus on authentic local experiences and verified businesses only.`

    const aiResponse = await aiHelper.generateResponse({
      prompt,
      maxTokens: 1500,
      temperature: 0.7
    })

    if (!aiResponse.success) {
      // Fallback to mock data
      const mockItinerary = getMockItinerary(preferences.destination, preferences.duration, preferences.budget)
      return NextResponse.json({
        success: true,
        itinerary: mockItinerary,
        source: 'mock',
        message: 'Generated using sample data. Connect OpenAI API for personalized AI recommendations.'
      })
    }

    // Parse AI response and structure it
    const itinerary = parseAIResponse(aiResponse.data, preferences)
    
    return NextResponse.json({
      success: true,
      itinerary,
      source: aiResponse.source,
      tokensUsed: aiResponse.tokensUsed,
      cost: aiResponse.cost,
      message: aiResponse.source === 'openai' 
        ? 'AI-powered itinerary generated successfully!' 
        : 'Generated using sample data. Connect OpenAI API for personalized AI recommendations.'
    })

  } catch (error) {
    console.error('Error generating itinerary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate itinerary' },
      { status: 500 }
    )
  }
}

function getMockItinerary(destination: string, duration: string, budget: string) {
  const budgetNum = parseInt(budget.replace(/[^0-9]/g, ''))
  const durationNum = parseInt(duration.replace(/[^0-9]/g, ''))
  
  // Select appropriate mock data based on destination
  if (destination.toLowerCase().includes('tanzania') || destination.toLowerCase().includes('serengeti')) {
    return {
      ...mockResponses.tripPlanning.tanzania,
      duration: `${durationNum} days`,
      totalCost: Math.min(budgetNum, 2800)
    }
  } else if (destination.toLowerCase().includes('kenya') || destination.toLowerCase().includes('masai mara')) {
    return {
      ...mockResponses.tripPlanning.kenya,
      duration: `${durationNum} days`,
      totalCost: Math.min(budgetNum, 2200)
    }
  }
  
  // Default response
  return {
    title: `Custom ${duration} Day ${destination} Adventure`,
    duration: `${durationNum} days`,
    totalCost: budgetNum,
    days: Array.from({ length: durationNum }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1} in ${destination}`,
      activities: [
        "Morning: Local cultural experience",
        "Afternoon: Guided tour of key attractions",
        "Evening: Traditional dinner"
      ],
      accommodation: "Local verified hotel",
      meals: "All meals included",
      transport: "Private vehicle with guide"
    })),
    transportOptions: [
      {
        type: "Road",
        route: "City transfers",
        duration: "30-60 minutes",
        cost: 50
      }
    ],
    recommendations: [
      "Best time to visit: Check local weather patterns",
      "Pack appropriate clothing for the season",
      "Bring camera for memorable photos",
      "Learn basic local phrases"
    ]
  }
}

function parseAIResponse(aiText: string, preferences: any) {
  // This would parse the AI response into structured data
  // For now, return a structured version of the AI response
  return {
    title: `AI-Generated ${preferences.duration} Day ${preferences.destination} Itinerary`,
    duration: preferences.duration,
    totalCost: preferences.budget,
    days: [
      {
        day: 1,
        title: "Arrival and Orientation",
        activities: [
          "Arrive at destination",
          "Check into accommodation",
          "Local orientation tour",
          "Welcome dinner"
        ],
        accommodation: "Verified local hotel",
        meals: "Dinner included",
        transport: "Airport transfer"
      }
    ],
    transportOptions: [
      {
        type: "Private Transfer",
        route: "Airport to hotel",
        duration: "45 minutes",
        cost: 75
      }
    ],
    recommendations: [
      "AI-generated personalized recommendations",
      "Based on your specific preferences and interests",
      "Optimized for your budget and group size"
    ],
    aiInsights: aiText
  }
}

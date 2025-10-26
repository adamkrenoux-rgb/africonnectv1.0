import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// POST /api/ai/dynamic-pricing - Generate dynamic pricing recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      listingTitle,
      currentPrice,
      location,
      category,
      season,
      occupancyRate,
      competitorPrices,
      historicalBookings
    } = body

    if (!listingTitle || !currentPrice || !location) {
      return NextResponse.json(
        { success: false, error: 'Listing title, current price, and location are required' },
        { status: 400 }
      )
    }

    let pricing

    if (!openai) {
      // Mock fallback with intelligent pricing calculations
      pricing = generateMockDynamicPricing({
        listingTitle,
        currentPrice,
        location,
        category,
        season,
        occupancyRate,
        competitorPrices
      })
    } else {
      try {
        const prompt = `Generate dynamic pricing recommendations for a tourism listing.

Listing: ${listingTitle}
Current Price: $${currentPrice}
Location: ${location}
Category: ${category || 'Tourism'}
Season: ${season || 'Standard'}
Occupancy Rate: ${occupancyRate || 'N/A'}%
Competitor Prices: ${competitorPrices ? `$${competitorPrices.min} - $${competitorPrices.max}` : 'N/A'}

Consider:
- Seasonal demand (high/low season)
- Local market rates
- Occupancy optimization
- Competitor positioning
- Value perception

Provide:
1. Recommended price for current conditions
2. Price range (min-max)
3. Seasonal pricing strategy
4. Discount suggestions
5. Revenue optimization tips

Format as JSON:
{
  "recommendedPrice": number,
  "priceRange": {"min": number, "max": number},
  "seasonalPricing": [{"season": "string", "price": number, "reason": "string"}],
  "discountSuggestions": [{"type": "string", "amount": number, "condition": "string"}],
  "insights": ["string"]
}`

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })

        const content = response.choices[0].message.content
        if (content) {
          pricing = JSON.parse(content)
        } else {
          pricing = generateMockDynamicPricing({
            listingTitle,
            currentPrice,
            location,
            category,
            season,
            occupancyRate,
            competitorPrices
          })
        }
      } catch (error) {
        console.error('Error with OpenAI:', error)
        pricing = generateMockDynamicPricing({
          listingTitle,
          currentPrice,
          location,
          category,
          season,
          occupancyRate,
          competitorPrices
        })
      }
    }

    return NextResponse.json({ success: true, pricing }, { status: 200 })
  } catch (error) {
    console.error('Error generating dynamic pricing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate dynamic pricing' },
      { status: 500 }
    )
  }
}

function generateMockDynamicPricing(params: any): any {
  const {
    currentPrice,
    location,
    category,
    season,
    occupancyRate,
    competitorPrices
  } = params

  const basePrice = parseFloat(currentPrice)

  // Calculate multipliers based on conditions
  let seasonMultiplier = 1.0
  const currentSeason = season?.toLowerCase() || 'standard'
  
  if (currentSeason.includes('high') || currentSeason.includes('peak')) {
    seasonMultiplier = 1.3
  } else if (currentSeason.includes('low') || currentSeason.includes('off')) {
    seasonMultiplier = 0.8
  }

  // Occupancy-based pricing
  let occupancyMultiplier = 1.0
  if (occupancyRate) {
    const rate = parseFloat(occupancyRate)
    if (rate > 80) {
      occupancyMultiplier = 1.2 // High demand, increase price
    } else if (rate < 40) {
      occupancyMultiplier = 0.9 // Low demand, decrease to attract bookings
    }
  }

  // Location-based adjustment
  const premiumLocations = ['serengeti', 'maasai mara', 'victoria falls', 'cape town', 'marrakech']
  const locationMultiplier = premiumLocations.some(loc => location.toLowerCase().includes(loc)) ? 1.15 : 1.0

  // Calculate recommended price
  const recommendedPrice = Math.round(basePrice * seasonMultiplier * occupancyMultiplier * locationMultiplier)

  // Price range
  const priceRange = {
    min: Math.round(basePrice * 0.75),
    max: Math.round(basePrice * 1.5)
  }

  // Seasonal pricing strategy
  const seasonalPricing = [
    {
      season: 'High Season (Jun-Sep)',
      price: Math.round(basePrice * 1.3),
      reason: 'Peak wildlife viewing season - highest demand'
    },
    {
      season: 'Shoulder Season (Mar-May, Oct-Nov)',
      price: Math.round(basePrice * 1.1),
      reason: 'Good weather, moderate crowds - optimal pricing'
    },
    {
      season: 'Low Season (Dec-Feb)',
      price: Math.round(basePrice * 0.85),
      reason: 'Attract budget travelers during slower period'
    }
  ]

  // Discount suggestions
  const discountSuggestions = [
    {
      type: 'Early Bird',
      amount: 10,
      condition: 'Bookings made 60+ days in advance'
    },
    {
      type: 'Group Discount',
      amount: 15,
      condition: 'Groups of 6 or more people'
    },
    {
      type: 'Multi-Day Package',
      amount: 20,
      condition: 'Booking 3+ day experiences'
    },
    {
      type: 'Last Minute',
      amount: 25,
      condition: 'Fill slots within 7 days of experience'
    }
  ]

  // Generate insights
  const insights = []

  if (recommendedPrice > currentPrice) {
    const increase = Math.round(((recommendedPrice - currentPrice) / currentPrice) * 100)
    insights.push(`Consider increasing price by ${increase}% based on current ${currentSeason} season demand`)
  } else if (recommendedPrice < currentPrice) {
    const decrease = Math.round(((currentPrice - recommendedPrice) / currentPrice) * 100)
    insights.push(`Consider decreasing price by ${decrease}% to improve occupancy rate`)
  } else {
    insights.push('Your current pricing is well-positioned for market conditions')
  }

  if (competitorPrices) {
    const avgCompetitor = (competitorPrices.min + competitorPrices.max) / 2
    if (currentPrice < avgCompetitor * 0.8) {
      insights.push('You are priced significantly below competitors - consider gradual increase')
    } else if (currentPrice > avgCompetitor * 1.2) {
      insights.push('You are priced above market average - ensure value justifies premium')
    } else {
      insights.push('Your pricing is competitive within market range')
    }
  }

  if (occupancyRate) {
    const rate = parseFloat(occupancyRate)
    if (rate > 85) {
      insights.push('High occupancy suggests room for price increase without losing bookings')
    } else if (rate < 40) {
      insights.push('Low occupancy - consider promotional pricing or package deals')
    }
  }

  insights.push('Implement dynamic pricing to maximize revenue during peak demand periods')
  insights.push('Use discounts strategically to fill low-demand periods without devaluing your brand')

  return {
    recommendedPrice,
    priceRange,
    seasonalPricing,
    discountSuggestions,
    insights
  }
}


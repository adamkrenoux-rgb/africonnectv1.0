import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// GET /api/ai/content-suggestions - Generate content suggestions for a listing or business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, listingTitle, description, location, category } = body

    if (!businessName || !listingTitle) {
      return NextResponse.json(
        { success: false, error: 'Business name and listing title are required' },
        { status: 400 }
      )
    }

    let suggestions

    if (!openai) {
      // Mock fallback with intelligent suggestions
      suggestions = generateMockContentSuggestions(businessName, listingTitle, location, category)
    } else {
      try {
        const prompt = `Generate social media content suggestions for a tourism business.
        
Business: ${businessName}
Listing: ${listingTitle}
Description: ${description || 'N/A'}
Location: ${location || 'Africa'}
Category: ${category || 'Tourism'}

Provide:
1. 5 engaging social media post ideas
2. 10 relevant hashtags
3. Best posting times
4. Content calendar suggestions (what to post when)
5. Audience engagement tips

Format as JSON:
{
  "posts": ["string"],
  "hashtags": ["string"],
  "postingTimes": ["string"],
  "contentCalendar": [{"day": "string", "content": "string"}],
  "engagementTips": ["string"]
}`

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })

        const content = response.choices[0].message.content
        if (content) {
          suggestions = JSON.parse(content)
        } else {
          suggestions = generateMockContentSuggestions(businessName, listingTitle, location, category)
        }
      } catch (error) {
        console.error('Error with OpenAI:', error)
        suggestions = generateMockContentSuggestions(businessName, listingTitle, location, category)
      }
    }

    return NextResponse.json({ success: true, suggestions }, { status: 200 })
  } catch (error) {
    console.error('Error generating content suggestions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate content suggestions' },
      { status: 500 }
    )
  }
}

function generateMockContentSuggestions(
  businessName: string,
  listingTitle: string,
  location: string = 'Africa',
  category: string = 'Tourism'
): any {
  const locationLower = location.toLowerCase()
  const categoryLower = category.toLowerCase()

  // Generate contextual hashtags based on location and category
  const baseHashtags = [`#${location.replace(/\s+/g, '')}`, '#AfricanTravel', '#ExploreAfrica']
  const categoryHashtags = categoryLower.includes('safari') 
    ? ['#Safari', '#Wildlife', '#BigFive']
    : categoryLower.includes('cultural')
    ? ['#CultureTravel', '#LocalCulture', '#Authentic']
    : categoryLower.includes('adventure')
    ? ['#AdventureTravel', '#Explore', '#Wanderlust']
    : ['#TravelAfrica', '#Tourism', '#Vacation']

  return {
    posts: [
      `Experience the magic of ${listingTitle}! Book your authentic African adventure with ${businessName} today. 🌍`,
      `Did you know? ${listingTitle} offers an unforgettable journey through ${location}. Share your travel dreams with us!`,
      `Weekend plans? How about exploring ${location} with our ${listingTitle} experience? Limited spots available!`,
      `Behind the scenes at ${businessName}: Creating memories that last a lifetime in beautiful ${location}. ✨`,
      `What travelers are saying about ${listingTitle}: "Best experience in ${location}!" - Don't just take our word for it!`
    ],
    hashtags: [
      ...baseHashtags,
      ...categoryHashtags,
      '#TravelGoals',
      '#BucketList',
      '#TravelPhotography',
      `#Visit${location.replace(/\s+/g, '')}`
    ],
    postingTimes: [
      'Monday-Friday: 7-9 AM (morning commute)',
      'Lunch hours: 12-2 PM (lunch break browsing)',
      'Evening: 6-8 PM (after work relaxation)',
      'Weekends: 10 AM - 12 PM (weekend planning time)',
      'Avoid: Late night posts get less engagement'
    ],
    contentCalendar: [
      { day: 'Monday', content: 'Share motivational travel quote with scenic photo' },
      { day: 'Tuesday', content: 'Showcase customer testimonial or review' },
      { day: 'Wednesday', content: 'Behind-the-scenes content or team introduction' },
      { day: 'Thursday', content: 'Highlight a specific feature of your experience' },
      { day: 'Friday', content: 'Weekend getaway promotion or special offer' },
      { day: 'Saturday', content: 'Share user-generated content from travelers' },
      { day: 'Sunday', content: 'Cultural insight or local tradition story' }
    ],
    engagementTips: [
      'Respond to all comments within 24 hours to boost engagement',
      'Ask questions in your captions to encourage comments',
      'Share authentic, high-quality photos of real experiences',
      'Use Instagram Stories and Reels for higher reach',
      'Tag location and collaborate with local influencers',
      'Share customer stories and testimonials regularly',
      'Post consistently - aim for 3-5 posts per week',
      'Use first-person storytelling to connect emotionally'
    ]
  }
}


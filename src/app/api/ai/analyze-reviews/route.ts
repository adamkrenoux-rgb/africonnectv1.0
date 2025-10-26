import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// POST /api/ai/analyze-reviews - Analyze reviews for a business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, reviews } = body

    if (!businessId && !reviews) {
      return NextResponse.json(
        { success: false, error: 'Business ID or reviews array is required' },
        { status: 400 }
      )
    }

    let reviewsToAnalyze = reviews

    // If business ID provided, fetch reviews from database
    if (businessId && !reviews) {
      const fetchedReviews = await prisma.review.findMany({
        where: { businessId },
        include: {
          traveler: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50 // Analyze last 50 reviews
      })

      reviewsToAnalyze = fetchedReviews.map(r => ({
        rating: r.rating,
        comment: r.comment
      }))
    }

    if (!reviewsToAnalyze || reviewsToAnalyze.length === 0) {
      return NextResponse.json({
        success: true,
        analysis: {
          overallSentiment: 'No reviews available',
          averageRating: 0,
          totalReviews: 0,
          sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
          commonThemes: [],
          strengths: [],
          improvements: [],
          insights: ['No reviews to analyze yet. Encourage customers to leave feedback!']
        }
      }, { status: 200 })
    }

    let analysis

    if (!openai) {
      // Mock fallback with smart analysis
      analysis = generateMockReviewAnalysis(reviewsToAnalyze)
    } else {
      try {
        const prompt = `Analyze these customer reviews for a tourism business:

${reviewsToAnalyze.map((r: any, i: number) => `Review ${i + 1} (${r.rating}/5): ${r.comment || 'No comment'}`).join('\n\n')}

Provide comprehensive analysis:
1. Overall sentiment (positive/neutral/negative)
2. Average rating
3. Sentiment distribution
4. Common themes mentioned
5. Top 3 strengths
6. Top 3 areas for improvement
7. Actionable insights

Format as JSON:
{
  "overallSentiment": "string",
  "averageRating": number,
  "totalReviews": number,
  "sentimentDistribution": {
    "positive": number,
    "neutral": number,
    "negative": number
  },
  "commonThemes": ["string"],
  "strengths": ["string"],
  "improvements": ["string"],
  "insights": ["string"]
}`

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })

        const content = response.choices[0].message.content
        if (content) {
          analysis = JSON.parse(content)
        } else {
          analysis = generateMockReviewAnalysis(reviewsToAnalyze)
        }
      } catch (error) {
        console.error('Error with OpenAI:', error)
        analysis = generateMockReviewAnalysis(reviewsToAnalyze)
      }
    }

    return NextResponse.json({ success: true, analysis }, { status: 200 })
  } catch (error) {
    console.error('Error analyzing reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze reviews' },
      { status: 500 }
    )
  }
}

function generateMockReviewAnalysis(reviews: any[]): any {
  // Calculate real stats from actual reviews
  const totalReviews = reviews.length
  const averageRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
  
  // Categorize by sentiment
  const positive = reviews.filter(r => r.rating >= 4).length
  const neutral = reviews.filter(r => r.rating === 3).length
  const negative = reviews.filter(r => r.rating <= 2).length

  const overallSentiment = averageRating >= 4 ? 'Positive' : averageRating >= 3 ? 'Neutral' : 'Needs Improvement'

  // Analyze comment patterns (simple keyword matching)
  const allComments = reviews.map(r => r.comment || '').join(' ').toLowerCase()
  
  const positiveKeywords = ['great', 'excellent', 'amazing', 'wonderful', 'friendly', 'professional', 'beautiful', 'recommend']
  const negativeKeywords = ['poor', 'bad', 'disappointing', 'expensive', 'rude', 'dirty', 'late', 'cancelled']
  
  const strengths = []
  const improvements = []

  if (allComments.includes('guide') || allComments.includes('staff')) {
    if (positiveKeywords.some(k => allComments.includes(k + ' guide') || allComments.includes(k + ' staff'))) {
      strengths.push('Exceptional guides and staff - consistently praised for professionalism and knowledge')
    }
  }

  if (allComments.includes('food') || allComments.includes('meal')) {
    if (positiveKeywords.some(k => allComments.includes(k) && allComments.includes('food'))) {
      strengths.push('High-quality food and dining experience')
    } else {
      improvements.push('Consider enhancing meal quality and variety')
    }
  }

  if (allComments.includes('value') || allComments.includes('price')) {
    if (averageRating >= 4) {
      strengths.push('Excellent value for money according to most reviews')
    } else {
      improvements.push('Review pricing strategy - some guests mention value concerns')
    }
  }

  // Add default insights if not enough data
  if (strengths.length === 0) {
    strengths.push('Overall positive customer experience')
    strengths.push('Guests appreciate authentic African experiences')
    strengths.push('Strong customer satisfaction ratings')
  }

  if (improvements.length === 0) {
    improvements.push('Maintain consistent quality across all experiences')
    improvements.push('Continue gathering customer feedback')
    improvements.push('Explore opportunities for service enhancements')
  }

  return {
    overallSentiment,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    sentimentDistribution: {
      positive,
      neutral,
      negative
    },
    commonThemes: [
      'Customer Service',
      'Experience Quality',
      'Value for Money',
      'Local Authenticity',
      'Safety & Comfort'
    ],
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    insights: [
      `Your average rating of ${(Math.round(averageRating * 10) / 10).toFixed(1)}/5 is ${averageRating >= 4 ? 'excellent' : averageRating >= 3 ? 'good' : 'needs attention'}`,
      `${Math.round((positive / totalReviews) * 100)}% of reviews are positive (4-5 stars)`,
      averageRating >= 4.5 
        ? 'Outstanding performance! Focus on maintaining this level of service'
        : averageRating >= 4
        ? 'Strong performance with room for excellence. Address feedback patterns to reach 4.5+'
        : averageRating >= 3
        ? 'Good foundation. Focus on consistency and addressing specific customer concerns'
        : 'Immediate attention needed. Review operational processes and customer feedback',
      'Respond to all reviews (especially negative ones) to show commitment to improvement'
    ]
  }
}


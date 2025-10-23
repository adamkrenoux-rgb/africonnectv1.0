import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createApplicationSchema = z.object({
  campaignId: z.string(),
  businessId: z.string(),
  proposalText: z.string().min(1),
  contentSamples: z.record(z.any()).optional(), // JSON object
  aiInsights: z.record(z.any()).optional(), // JSON object
  proposedPrice: z.number().positive().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (campaignId) where.campaignId = campaignId
    if (businessId) where.businessId = businessId
    if (status) where.status = status

    // Temporarily return empty array until database is set up
    const applications: any[] = []

    return NextResponse.json({
      success: true,
      applications
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createApplicationSchema.parse(body)

    // Temporarily return mock data until database is set up
    const application = {
      id: 'temp-application-id',
      ...validatedData,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      application
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
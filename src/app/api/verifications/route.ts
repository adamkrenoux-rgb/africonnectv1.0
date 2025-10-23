import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const businessId = searchParams.get('businessId')

    // Mock verifications for demo
    const verifications: any[] = []

    return NextResponse.json({ success: true, data: verifications })
  } catch (error) {
    console.error('Error fetching verifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock verification creation for demo
    const verification = {
      id: 'verification_' + Date.now(),
      ...body,
      verificationStatus: 'PENDING',
      createdAt: new Date()
    }

    return NextResponse.json({ success: true, data: verification }, { status: 201 })
  } catch (error) {
    console.error('Error creating verification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
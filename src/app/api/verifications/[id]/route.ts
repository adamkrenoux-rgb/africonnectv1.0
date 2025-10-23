import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock verification for demo
    const verification = {
      id,
      businessId: 'business_123',
      documentType: 'business_license',
      documentUrl: '/uploads/mock/license.pdf',
      verificationStatus: 'PENDING',
      createdAt: new Date()
    }

    return NextResponse.json({ success: true, data: verification })
  } catch (error) {
    console.error('Error fetching verification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, adminNotes } = body

    // Mock verification update for demo
    const verification = {
      id,
      verificationStatus: status,
      adminNotes,
      verifiedAt: status === 'APPROVED' ? new Date() : null,
      updatedAt: new Date()
    }

    return NextResponse.json({ success: true, data: verification })
  } catch (error) {
    console.error('Error updating verification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
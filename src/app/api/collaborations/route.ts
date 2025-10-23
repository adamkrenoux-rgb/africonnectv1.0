import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Mock collaborations for demo
    const collaborations: any[] = []

    return NextResponse.json({ success: true, data: collaborations })
  } catch (error) {
    console.error('Error fetching collaborations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock collaboration creation for demo
    const collaboration = {
      id: 'temp-collab-id',
      ...body,
      status: 'PENDING',
      createdAt: new Date()
    }

    return NextResponse.json({ success: true, data: collaboration }, { status: 201 })
  } catch (error) {
    console.error('Error creating collaboration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
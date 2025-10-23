import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId, bookingId } = body

    // Mock payment completion for demo
    const result = {
      success: true,
      bookingId,
      paymentIntentId,
      status: 'completed'
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error completing booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
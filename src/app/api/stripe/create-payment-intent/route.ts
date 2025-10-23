import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'usd', bookingId } = body

    // Mock payment intent creation for demo
    const paymentIntent = {
      id: 'pi_mock_' + Date.now(),
      amount,
      currency,
      status: 'requires_payment_method',
      client_secret: 'pi_mock_' + Date.now() + '_secret_mock'
    }

    return NextResponse.json({ success: true, data: paymentIntent })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
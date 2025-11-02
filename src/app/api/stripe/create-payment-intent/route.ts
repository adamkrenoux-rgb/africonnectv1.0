import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'usd', bookingId, metadata = {} } = body

    // Validate amount (minimum $0.50)
    if (!amount || amount < 50) {
      return NextResponse.json(
        { success: false, error: 'Amount must be at least $0.50' },
        { status: 400 }
      )
    }

    // If Stripe is not configured, return mock
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('Stripe not configured, using mock payment intent')
      return NextResponse.json({
        success: true,
        data: {
          id: `pi_mock_${Date.now()}`,
          amount,
          currency,
          status: 'requires_payment_method',
          client_secret: `pi_mock_${Date.now()}_secret_mock`
        },
        mock: true
      })
    }

    // Create payment intent with Stripe
    if (!stripe) {
      return NextResponse.json({
        success: true,
        data: {
          id: `pi_mock_${Date.now()}`,
          amount,
          currency,
          status: 'requires_payment_method',
          client_secret: `pi_mock_${Date.now()}_secret_mock`
        },
        mock: true
      })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        bookingId: bookingId || '',
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Payment will be held in escrow until booking is completed
      capture_method: 'manual',
    })

    return NextResponse.json({
      success: true,
      data: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert back to dollars
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret
      }
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
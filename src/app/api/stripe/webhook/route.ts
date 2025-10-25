import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
// import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata

  if (bookingId) {
    // Mock booking update (replace with real Prisma call when database is set up)
    console.log('Payment succeeded for booking:', bookingId)
    // await prisma.booking.update({
    //   where: { id: bookingId },
    //   data: {
    //     paymentStatus: 'HELD_IN_ESCROW',
    //     status: 'CONFIRMED'
    //   }
    // })

    // TODO: Send confirmation emails
    console.log(`Payment succeeded for booking ${bookingId}`)
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata

  if (bookingId) {
    // Mock booking update (replace with real Prisma call when database is set up)
    console.log('Payment failed for booking:', bookingId)
    // await prisma.booking.update({
    //   where: { id: bookingId },
    //   data: {
    //     paymentStatus: 'FAILED',
    //     status: 'CANCELLED'
    //   }
    // })

    console.log(`Payment failed for booking ${bookingId}`)
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata

  if (bookingId) {
    // Mock booking update (replace with real Prisma call when database is set up)
    console.log('Payment failed for booking:', bookingId)
    // await prisma.booking.update({
    //   where: { id: bookingId },
    //   data: {
    //     paymentStatus: 'FAILED',
    //     status: 'CANCELLED'
    //   }
    // })

    console.log(`Payment canceled for booking ${bookingId}`)
  }
}

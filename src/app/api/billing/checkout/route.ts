import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ success: false, error: 'Stripe not configured' }, { status: 500 })
    }

    const body = await request.json().catch(() => ({}))
    const { planTier = 'PRO', successUrl = `${new URL(request.url).origin}/settings/billing?success=1`, cancelUrl = `${new URL(request.url).origin}/settings/billing?canceled=1` } = body || {}

    // find plan by tier
    const plan = await prisma.plan.findFirst({ where: { tier: planTier } })
    if (!plan?.stripePriceId) {
      return NextResponse.json({ success: false, error: 'Plan not available' }, { status: 400 })
    }

    // Ensure we have or create a Stripe customer
    let stripeCustomerId: string | null = null
    const existingSub = await prisma.subscription.findFirst({ where: { userId: user.id } })
    if (existingSub?.stripeCustomerId) {
      stripeCustomerId = existingSub.stripeCustomerId
    } else {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined
      })
      stripeCustomerId = customer.id
      if (existingSub) {
        await prisma.subscription.update({ where: { id: existingSub.id }, data: { stripeCustomerId } })
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId || undefined,
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { userId: user.id, planTier }
      },
      metadata: { userId: user.id, planTier }
    })

    return NextResponse.json({ success: true, url: session.url }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create checkout session' }, { status: 500 })
  }
}



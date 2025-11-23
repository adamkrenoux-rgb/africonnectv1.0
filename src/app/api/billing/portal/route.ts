import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

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
    const sub = await prisma.subscription.findFirst({ where: { userId: user.id } })
    if (!sub?.stripeCustomerId) {
      return NextResponse.json({ success: false, error: 'No Stripe customer' }, { status: 400 })
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${new URL(request.url).origin}/settings/billing`
    })
    return NextResponse.json({ success: true, url: session.url }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create portal session' }, { status: 500 })
  }
}



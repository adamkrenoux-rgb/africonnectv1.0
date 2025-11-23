import Stripe from 'stripe'

// Server-side Stripe instance (for API routes)
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!stripeInstance) {
    stripeInstance = new Stripe(key, {
      apiVersion: '2024-06-20'
    })
  }
  return stripeInstance
}

// Export a lazy-initialized stripe instance for direct use
export const stripe = process.env.STRIPE_SECRET_KEY
  ? (() => {
      if (!stripeInstance) {
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2024-06-20',
        })
      }
      return stripeInstance
    })()
  : null

// Client-side Stripe loader (for browser)
export const getStripeClient = () => {
  if (typeof window !== 'undefined') {
    return require('@stripe/stripe-js').loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )
  }
  return null
}

'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef')

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          metadata: {
            source: 'africonnect',
          },
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white font-semibold mb-2">Card Details</label>
        <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-white">
          <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
          <span className="text-gray-300 ml-2">Total</span>
        </div>
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </form>
  )
}

export default function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <Card className="bg-gray-800 border-yellow-500/30 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Secure Payment</h3>
          <p className="text-gray-300">Your payment is processed securely through Stripe</p>
        </div>
        <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
      </Card>
    </Elements>
  )
}

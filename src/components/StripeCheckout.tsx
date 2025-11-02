'use client'

import { useState, useEffect } from 'react'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock'
)

interface StripeCheckoutProps {
  amount: number
  currency?: string
  bookingId?: string
  onSuccess: (paymentIntentId: string) => void
  onError?: (error: string) => void
  metadata?: Record<string, string>
  className?: string
}

function CheckoutForm({
  amount,
  bookingId,
  onSuccess,
  onError,
  metadata
}: Omit<StripeCheckoutProps, 'currency' | 'className'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [clientSecret, setClientSecret] = useState<string>('')

  // Create payment intent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: 'usd',
            bookingId,
            metadata
          }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to create payment intent')
        }

        setClientSecret(data.data.client_secret)
      } catch (err: any) {
        setError(err.message || 'Failed to initialize payment')
        onError?.(err.message || 'Failed to initialize payment')
      }
    }

    createPaymentIntent()
  }, [amount, bookingId, metadata, onError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw submitError
      }

      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/booking/success?payment_intent=${''}&booking_id=${bookingId || ''}`,
        },
        redirect: 'if_required',
      })

      const { error: confirmError, paymentIntent } = result
      
      // Update return URL with actual payment intent ID if available
      if (paymentIntent?.id) {
        // Payment intent is available, we can update the URL
      }

      if (confirmError) {
        throw confirmError
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      } else if (paymentIntent && paymentIntent.status === 'requires_capture') {
        // Payment authorized but held in escrow
        onSuccess(paymentIntent.id)
      } else {
        throw new Error('Payment not completed')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed. Please try again.'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-300">Initializing payment...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Lock className="w-4 h-4" />
        <span>Your payment is secure and encrypted</span>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-lg py-6 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Payment will be held in escrow until your experience is completed
      </p>
    </form>
  )
}

export function StripeCheckout({
  amount,
  currency = 'usd',
  bookingId,
  onSuccess,
  onError,
  metadata,
  className = ''
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('')

  useEffect(() => {
    const initPayment = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            bookingId,
            metadata
          }),
        })

        const data = await response.json()
        if (data.success) {
          setClientSecret(data.data.client_secret)
        }
      } catch (error) {
        console.error('Failed to initialize payment:', error)
      }
    }

    initPayment()
  }, [amount, currency, bookingId, metadata])

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <Card className={`bg-gray-800 border-gray-700 p-6 ${className}`}>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Stripe Not Configured</h3>
          <p className="text-gray-400 mb-4">
            Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables
          </p>
          <Button
            onClick={() => onSuccess('mock_payment_' + Date.now())}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Continue with Mock Payment (Demo)
          </Button>
        </div>
      </Card>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#f59e0b',
        colorBackground: '#1f2937',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Payment Details</h3>
        <div className="flex items-center justify-between py-4 border-b border-gray-700">
          <span className="text-gray-300">Total Amount</span>
          <span className="text-2xl font-bold text-yellow-400">${amount.toFixed(2)}</span>
        </div>
      </div>

      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            amount={amount}
            bookingId={bookingId}
            onSuccess={onSuccess}
            onError={onError}
            metadata={metadata}
          />
        </Elements>
      ) : (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
          <span className="ml-2 text-gray-300">Loading payment form...</span>
        </div>
      )}
    </Card>
  )
}


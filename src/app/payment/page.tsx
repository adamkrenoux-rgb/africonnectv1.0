'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    amount: 2500
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setPaymentSuccess(true)
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="bg-gray-800 border-yellow-500/30 p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-white">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Payment Successful!</h2>
          <p className="text-gray-300 mb-6">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          <Link href="/booking/success">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              View Booking Details
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Connexus
              </Link>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Payment Form */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-yellow-500/30 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Secure Payment</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">CVV</label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={paymentData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Amount:</span>
                <span className="text-yellow-400 text-xl font-bold">${paymentData.amount}</span>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold shadow-lg disabled:opacity-50"
              >
                {isProcessing ? 'Processing Payment...' : 'Pay Now'}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

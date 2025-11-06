'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, Send, CheckCircle2 } from 'lucide-react'

interface InquiryFormProps {
  businessId: string
  businessName: string
}

export default function InquiryForm({ businessId, businessName }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          businessName,
          ...formData
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          inquiryType: 'general'
        })
      } else {
        setError(data.error || 'Failed to send inquiry')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send inquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-white mb-2">Inquiry Sent!</h4>
        <p className="text-gray-400 text-sm mb-4">
          We've sent your message to {businessName}. They'll get back to you soon.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="border-gray-600 text-gray-300"
        >
          Send Another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="inquiryType" className="block text-white font-semibold mb-2 text-sm">
          Inquiry Type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        >
          <option value="general">General Inquiry</option>
          <option value="booking">Booking Question</option>
          <option value="custom">Custom Experience</option>
          <option value="partnership">Partnership</option>
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-white font-semibold mb-2 text-sm">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-white font-semibold mb-2 text-sm">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="john@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-white font-semibold mb-2 text-sm">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="+1 234 567 8900"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-white font-semibold mb-2 text-sm">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
          placeholder="Tell us about your inquiry..."
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Inquiry
          </>
        )}
      </Button>

      <p className="text-gray-500 text-xs text-center">
        Your inquiry will be sent to the business owner via email
      </p>
    </form>
  )
}


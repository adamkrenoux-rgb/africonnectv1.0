'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function FAQPage() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const faqData = {
    travelers: [
      {
        question: "How do I book an experience on AFRICONNECT?",
        answer: "Simply browse our verified experiences, select your preferred dates and options, and complete the booking through our secure payment system. You'll receive instant confirmation and all the details you need for your experience."
      },
      {
        question: "Are all businesses on AFRICONNECT verified?",
        answer: "Yes! Every business on our platform goes through a comprehensive verification process including document verification, background checks, and quality assessments. Look for the verified badge on all listings."
      },
      {
        question: "What if I need to cancel my booking?",
        answer: "Cancellation policies vary by business, but most offer free cancellation up to 24-48 hours before your experience. Check the specific cancellation policy when booking, and contact our support team if you need assistance."
      },
      {
        question: "How does the AI trip planning work?",
        answer: "Our AI analyzes your preferences, budget, interests, and travel dates to create a personalized itinerary. It considers travel times, local insights, and matches you with verified businesses that fit your style and budget."
      },
      {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use Stripe for all payments, which is PCI DSS compliant and used by millions of businesses worldwide. Your payment information is encrypted and never stored on our servers."
      }
    ],
    businesses: [
      {
        question: "How do I get my business verified on AFRICONNECT?",
        answer: "Submit your business information, upload required documents (business license, insurance, etc.), and our team will review your application. The process typically takes 2-5 business days, and you'll be notified of the status."
      },
      {
        question: "What commission does AFRICONNECT take?",
        answer: "We charge a 15% commission on bookings and 12% on influencer collaborations. This includes payment processing, platform maintenance, customer support, and marketing to help grow your business."
      },
      {
        question: "How do I optimize my listings for better visibility?",
        answer: "Use our AI listing optimizer to improve your titles, descriptions, and pricing. Add high-quality photos, respond to reviews quickly, and keep your availability updated. Our AI will also suggest improvements based on successful listings."
      },
      {
        question: "Can I work with influencers through AFRICONNECT?",
        answer: "Yes! Create campaigns to collaborate with travel influencers. Set your budget, deliverables, and target audience, then review applications from interested influencers. Our AI helps match you with the best partners."
      },
      {
        question: "How do I get paid for bookings?",
        answer: "Payments are processed through Stripe and deposited to your bank account within 2-7 business days after the experience is completed. You can track all payments in your dashboard."
      }
    ],
    influencers: [
      {
        question: "How do I create a campaign on AFRICONNECT?",
        answer: "Sign up as an influencer, complete your profile with your social media stats and content examples, then create campaigns specifying your deliverables, target audience, and collaboration terms. Businesses will apply to work with you."
      },
      {
        question: "What types of content can I create for campaigns?",
        answer: "You can create sponsored posts, stories, reels, blog content, and more. The specific deliverables depend on the campaign requirements. Our AI helps suggest content ideas that align with your style and the business's goals."
      },
      {
        question: "How does the AI campaign projection work?",
        answer: "Our AI analyzes your follower demographics, engagement rates, and the business's conversion data to predict reach, engagement, and potential bookings. This helps both you and businesses set realistic expectations and pricing."
      },
      {
        question: "When do I get paid for collaborations?",
        answer: "Payment is held in escrow until you deliver the agreed content and it meets the campaign requirements. Once approved by the business, you'll receive payment within 2-7 business days through Stripe."
      },
      {
        question: "Can I work with businesses outside my usual niche?",
        answer: "Absolutely! Our AI matching system considers your content style, audience demographics, and the business's target market to suggest relevant opportunities, even if they're outside your typical content focus."
      }
    ],
    general: [
      {
        question: "Is AFRICONNECT available in multiple languages?",
        answer: "Yes! We support English, French, Portuguese, and Swahili. Our AI chatbot and platform interface automatically detect your language preferences and respond accordingly."
      },
      {
        question: "How do I contact customer support?",
        answer: "You can reach our support team through the chat widget on any page, email us at support@africonnect.com, or use the contact form. We typically respond within 24 hours."
      },
      {
        question: "What makes AFRICONNECT different from other travel platforms?",
        answer: "We focus exclusively on authentic African experiences, use AI to personalize recommendations, verify all businesses, and facilitate meaningful connections between travelers and local communities. Our platform is built specifically for African tourism."
      },
      {
        question: "Do you offer travel insurance?",
        answer: "We partner with leading travel insurance providers to offer comprehensive coverage for your African adventures. You can add insurance during the booking process or contact us for more information."
      },
      {
        question: "How does AFRICONNECT support local communities?",
        answer: "Every booking directly supports local businesses and communities. We also provide business development resources, marketing support, and help businesses grow sustainably while preserving cultural heritage."
      }
    ]
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                AFRICONNECT
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/sign-in">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-600/20 via-orange-500/30 to-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked <span className="text-yellow-400">Questions</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Find answers to common questions about using AFRICONNECT for travel, business, and influencer collaborations.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* For Travelers */}
            <Card className="bg-gray-800 border-gray-700">
              <button
                onClick={() => toggleSection('travelers')}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <h2 className="text-2xl font-bold text-white">For Travelers</h2>
                <span className="text-yellow-400 text-2xl">
                  {openSection === 'travelers' ? '−' : '+'}
                </span>
              </button>
              {openSection === 'travelers' && (
                <div className="px-6 pb-6 space-y-4">
                  {faqData.travelers.map((faq, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* For Businesses */}
            <Card className="bg-gray-800 border-gray-700">
              <button
                onClick={() => toggleSection('businesses')}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <h2 className="text-2xl font-bold text-white">For Businesses</h2>
                <span className="text-yellow-400 text-2xl">
                  {openSection === 'businesses' ? '−' : '+'}
                </span>
              </button>
              {openSection === 'businesses' && (
                <div className="px-6 pb-6 space-y-4">
                  {faqData.businesses.map((faq, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* For Influencers */}
            <Card className="bg-gray-800 border-gray-700">
              <button
                onClick={() => toggleSection('influencers')}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <h2 className="text-2xl font-bold text-white">For Influencers</h2>
                <span className="text-yellow-400 text-2xl">
                  {openSection === 'influencers' ? '−' : '+'}
                </span>
              </button>
              {openSection === 'influencers' && (
                <div className="px-6 pb-6 space-y-4">
                  {faqData.influencers.map((faq, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* General */}
            <Card className="bg-gray-800 border-gray-700">
              <button
                onClick={() => toggleSection('general')}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <h2 className="text-2xl font-bold text-white">General Questions</h2>
                <span className="text-yellow-400 text-2xl">
                  {openSection === 'general' ? '−' : '+'}
                </span>
              </button>
              {openSection === 'general' && (
                <div className="px-6 pb-6 space-y-4">
                  {faqData.general.map((faq, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-xl text-gray-300 mb-8">Our support team is here to help you get the most out of AFRICONNECT</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg">
                Contact Support
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg">
                Help Center
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

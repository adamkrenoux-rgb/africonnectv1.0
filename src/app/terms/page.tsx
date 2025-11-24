import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Africonnect
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
            Terms of <span className="text-yellow-400">Service</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              By accessing and using Africonnect ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Africonnect is an AI-powered platform that connects travelers with verified African tourism businesses and facilitates collaborations between businesses and travel influencers. Our service includes but is not limited to:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li>AI-powered trip planning and itinerary generation</li>
              <li>Verified business listings and booking services</li>
              <li>Influencer campaign creation and management</li>
              <li>Payment processing and escrow services</li>
              <li>Review and rating systems</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">3. User Accounts and Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              To use certain features of the Platform, you must create an account. You are responsible for:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li>Providing accurate and complete information</li>
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">4. Booking and Payment Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              When booking experiences through Africonnect:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li>All bookings are subject to availability and business confirmation</li>
              <li>Payment is processed securely through Stripe</li>
              <li>We charge a 15% commission on bookings and 12% on influencer collaborations</li>
              <li>Cancellation policies vary by business and are displayed at booking</li>
              <li>Refunds are processed according to the business's cancellation policy</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">5. Business Verification and Standards</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              All businesses on Africonnect undergo a verification process including document verification, background checks, and quality assessments. However, we cannot guarantee the performance of any business or the quality of experiences. Users book at their own risk.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">6. Intellectual Property Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Platform and its original content, features, and functionality are owned by Africonnect and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of our material without our prior written consent.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">7. Prohibited Uses</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You may not use our Platform:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">8. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              In no event shall Africonnect, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">9. Dispute Resolution</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall be conducted in English and the decision of the arbitrator shall be final and binding.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">10. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Platform. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">11. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-2">Email: legal@africonnect.com</p>
              <p className="text-gray-300 mb-2">Address: [Company Address]</p>
              <p className="text-gray-300">Phone: [Contact Number]</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Questions About Our Terms?</h2>
          <p className="text-xl text-gray-300 mb-8">Our legal team is here to help clarify any questions you may have</p>
          <Link href="/contact">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg">
              Contact Legal Team
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

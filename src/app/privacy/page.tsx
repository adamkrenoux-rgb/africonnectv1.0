import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
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
            Privacy <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li>Account information (name, email, phone number)</li>
              <li>Profile information (bio, preferences, travel history)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Communication data (messages, reviews, feedback)</li>
              <li>Business verification documents</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your experience with AI recommendations</li>
              <li>Verify business credentials and maintain platform safety</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li>With businesses when you make a booking (limited to necessary information)</li>
              <li>With service providers who assist us in operating our platform</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In connection with a business transfer or acquisition</li>
              <li>With your consent or at your direction</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">5. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the following third-party services that may collect information:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li><strong>Stripe:</strong> Payment processing (see Stripe's privacy policy)</li>
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>OpenAI:</strong> AI-powered features and recommendations</li>
              <li><strong>Vercel:</strong> Hosting and analytics</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">6. Cookies and Tracking</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our platform</li>
              <li>Provide personalized content and recommendations</li>
              <li>Improve our services and user experience</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-6">
              You can control cookies through your browser settings, but disabling them may affect platform functionality.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">7. Your Rights (GDPR Compliance)</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you are in the European Union, you have the following rights:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Restriction:</strong> Request limitation of processing</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">8. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Account information is typically retained for 3 years after account closure, unless a longer retention period is required by law.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">9. International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">10. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected such information, we will take steps to delete it.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">11. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">12. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-2">Email: privacy@africonnect.com</p>
              <p className="text-gray-300 mb-2">Data Protection Officer: dpo@africonnect.com</p>
              <p className="text-gray-300 mb-2">Address: [Company Address]</p>
              <p className="text-gray-300">Phone: [Contact Number]</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Questions About Your Privacy?</h2>
          <p className="text-xl text-gray-300 mb-8">We're committed to protecting your data and being transparent about our practices</p>
          <Link href="/contact">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg">
              Contact Privacy Team
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

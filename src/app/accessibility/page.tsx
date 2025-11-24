import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AccessibilityPage() {
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
            Accessibility <span className="text-yellow-400">Statement</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Africonnect is committed to ensuring digital accessibility for all users, including those with disabilities.
          </p>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Accessibility Features</h2>
            <p className="text-xl text-gray-300">We strive to make Africonnect accessible to everyone</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⌨️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Keyboard Navigation</h3>
              <p className="text-gray-300 text-sm">
                Full keyboard navigation support with visible focus indicators and logical tab order throughout the platform.
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Screen Reader Support</h3>
              <p className="text-gray-300 text-sm">
                Comprehensive ARIA labels, alt text for images, and semantic HTML structure for screen reader compatibility.
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Visual Accessibility</h3>
              <p className="text-gray-300 text-sm">
                High contrast ratios, scalable text, and color-blind friendly design elements throughout the interface.
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Mobile Accessibility</h3>
              <p className="text-gray-300 text-sm">
                Touch-friendly interface with appropriate target sizes and gesture support for mobile devices.
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Time-based Content</h3>
              <p className="text-gray-300 text-sm">
                No auto-playing content, user control over animations, and clear time limits for any time-sensitive features.
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Multilingual Support</h3>
              <p className="text-gray-300 text-sm">
                Platform available in English, French, Portuguese, and Swahili with proper language attributes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Standards Compliance */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Standards Compliance</h2>
            <p className="text-xl text-gray-300">We follow international accessibility standards</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-gray-800 border-gray-700 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">WCAG 2.1 AA Compliance</h3>
              <p className="text-gray-300 mb-4">
                Our platform strives to meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, including:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Perceivable: Information and UI components are presentable in ways users can perceive</li>
                <li>• Operable: Interface components and navigation must be operable</li>
                <li>• Understandable: Information and UI operation must be understandable</li>
                <li>• Robust: Content must be robust enough for interpretation by assistive technologies</li>
              </ul>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Testing & Monitoring</h3>
              <p className="text-gray-300 mb-4">
                We continuously test and monitor our platform for accessibility compliance:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Automated accessibility testing with axe-core</li>
                <li>• Manual testing with screen readers</li>
                <li>• User testing with people with disabilities</li>
                <li>• Regular accessibility audits and improvements</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Feedback */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Accessibility Feedback</h2>
            <p className="text-xl text-gray-300">Help us improve accessibility for everyone</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Report Accessibility Issues</h3>
                <p className="text-gray-300">
                  If you encounter any accessibility barriers on our platform, please let us know. We're committed to addressing issues promptly.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Contact Methods</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-yellow-400 font-medium">Email</p>
                      <p className="text-gray-300">accessibility@africonnect.com</p>
                    </div>
                    <div>
                      <p className="text-yellow-400 font-medium">Phone</p>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-yellow-400 font-medium">Response Time</p>
                      <p className="text-gray-300">Within 48 hours</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">What to Include</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Description of the accessibility issue</li>
                    <li>• Page URL where the issue occurred</li>
                    <li>• Browser and assistive technology used</li>
                    <li>• Steps to reproduce the issue</li>
                    <li>• Any suggested solutions</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/contact">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Contact Accessibility Team
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Accessibility is Our Priority</h2>
          <p className="text-xl text-gray-300 mb-8">We're continuously working to improve accessibility for all users</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg">
                Report an Issue
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg">
                Get Help
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
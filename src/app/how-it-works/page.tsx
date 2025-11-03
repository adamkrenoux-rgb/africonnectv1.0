import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function HowItWorksPage() {
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
            How <span className="text-yellow-400">AFRICONNECT</span> Works
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Simple steps to connect travelers, businesses, and influencers for authentic African experiences
          </p>
        </div>
      </section>

      {/* For Travelers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">For Travelers</h2>
            <p className="text-xl text-gray-300">Discover and book authentic African experiences</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Sign Up</h3>
              <p className="text-gray-300">Create your free account and tell us about your travel preferences</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Trip Planning</h3>
              <p className="text-gray-300">Our AI creates personalized itineraries based on your interests and budget</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Browse & Book</h3>
              <p className="text-gray-300">Explore verified experiences and book directly with secure payments</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Experience Africa</h3>
              <p className="text-gray-300">Enjoy authentic experiences and create unforgettable memories</p>
            </Card>
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">For Businesses</h2>
            <p className="text-xl text-gray-300">Grow your tourism business with AI-powered tools</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Verified</h3>
              <p className="text-gray-300">Complete our verification process to build trust with travelers</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Create Listings</h3>
              <p className="text-gray-300">Use our AI tools to create optimized listings that attract travelers</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Connect with Influencers</h3>
              <p className="text-gray-300">Collaborate with travel influencers to reach new audiences</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Grow Your Business</h3>
              <p className="text-gray-300">Track performance and get AI insights to optimize your offerings</p>
            </Card>
          </div>
        </div>
      </section>

      {/* For Influencers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">For Influencers</h2>
            <p className="text-xl text-gray-300">Monetize your travel content with authentic partnerships</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Create Profile</h3>
              <p className="text-gray-300">Set up your influencer profile with your audience and content style</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Browse Campaigns</h3>
              <p className="text-gray-300">Find collaboration opportunities that match your niche and values</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Apply & Collaborate</h3>
              <p className="text-gray-300">Apply to campaigns and work with businesses to create authentic content</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Paid</h3>
              <p className="text-gray-300">Receive secure payments through our escrow system</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">Join the platform that's transforming African tourism</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

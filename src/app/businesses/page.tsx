import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BusinessesPage() {
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
            Grow Your <span className="text-yellow-400">Tourism Business</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Connect with international travelers, collaborate with influencers, and grow your business with AI-powered tools and verified partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/business/setup">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg">
                List Your Business
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg">
                Join as Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features for Businesses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Tools for Tourism Businesses</h2>
            <p className="text-xl text-gray-300">Everything you need to succeed in African tourism</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">AI Listing Optimization</h3>
              <p className="text-gray-300">
                Our AI analyzes and improves your listings for better visibility, SEO optimization, and higher conversion rates.
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Influencer Collaborations</h3>
              <p className="text-gray-300">
                Connect with travel influencers to create authentic content and reach new audiences through strategic partnerships.
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Analytics & Insights</h3>
              <p className="text-gray-300">
                Track performance, understand customer behavior, and get AI-powered recommendations to grow your business.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">Join verified tourism businesses across Africa</p>
          <Link href="/business/setup">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
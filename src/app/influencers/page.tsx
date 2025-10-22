import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function InfluencersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-black to-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                <span className="text-3xl">🌍</span>
                AFRICONNECT
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-yellow-600 font-semibold">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-orange-500/30 to-red-500/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center opacity-30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-block text-6xl mb-4">📱</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Create Meaningful Content with
              <span className="text-yellow-400"> African Businesses</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with verified African tourism businesses and create authentic content that drives real impact. AI-powered insights help you maximize your reach and ROI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/influencers/dashboard">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold shadow-lg">
                📱 Influencer Dashboard
              </Button>
            </Link>
            <Link href="/campaigns/new">
              <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white border border-yellow-500 px-8 py-4 text-lg font-semibold">
                🔍 Create Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Partner with AFRICONNECT?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Access AI-powered insights, authentic partnerships, and fair compensation for your content creation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI Campaign Projections</h3>
              <p className="text-gray-300">
                Get data-driven insights on reach, engagement, and ROI for your collaborations with African businesses.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Authentic Partnerships</h3>
              <p className="text-gray-300">
                Connect with verified local businesses that align with your values and audience interests.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Fair Compensation</h3>
              <p className="text-gray-300">
                Transparent pricing and secure escrow payments ensure you get paid fairly for your content and influence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-block text-6xl mb-4">📱</span>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Create Impact?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the platform that's connecting influencers with authentic African businesses for meaningful collaborations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campaigns/new">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-600 px-8 py-4 text-lg font-semibold shadow-lg">
                🚀 Start Collaborating
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg font-semibold">
                📝 Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

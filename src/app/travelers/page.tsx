import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function TravelersPage() {
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
              <Link href="/travelers" className="text-yellow-600 font-semibold">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
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
            <span className="inline-block text-6xl mb-4">🧭</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Authentic
              <span className="text-yellow-400"> African Adventures</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered trip planning connects you to verified local businesses offering authentic African experiences tailored for international professionals.
            </p>
          </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/travelers/dashboard">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold shadow-lg">
                  🗺️ Traveler Dashboard
                </Button>
              </Link>
              <Link href="/plan-trip">
                <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white border border-yellow-500 px-8 py-4 text-lg font-semibold">
                  📚 Plan Your Trip
                </Button>
              </Link>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AFRICONNECT for Your African Journey?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed specifically for travelers seeking authentic African experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-yellow-200 hover:border-yellow-300">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🤖</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✨</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">AI-Powered Trip Planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI creates personalized itineraries based on your preferences, budget, and schedule, connecting you to the perfect local experiences.
              </p>
            </Card>
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-gray-300">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🛡️</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Verified Local Partners</h3>
              <p className="text-gray-600 leading-relaxed">
                Every business is thoroughly verified and trusted by the international community. Your safety and satisfaction are our priority.
              </p>
            </Card>
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-yellow-200 hover:border-yellow-300">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl">💼</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🌍</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Professional Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with fellow travelers who share your passion for meaningful travel experiences.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-block text-6xl mb-4">🌍</span>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Explore Africa?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of international professionals who have discovered authentic African experiences through AFRICONNECT.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan-trip">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-600 px-8 py-4 text-lg font-semibold shadow-lg">
                🚀 Start Planning
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

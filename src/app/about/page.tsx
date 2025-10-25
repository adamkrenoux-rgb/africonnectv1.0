import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AboutPage() {
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
              <Link href="/auth/sign-in">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
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
            About <span className="text-yellow-400">AFRICONNECT</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            We're revolutionizing African tourism by connecting travelers to authentic local experiences through AI-powered discovery and verified partnerships.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  To democratize access to authentic African experiences by leveraging AI technology to connect travelers with verified local businesses, while empowering African tourism entrepreneurs and creating meaningful cultural exchanges.
                </p>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🌟</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                <p className="text-gray-300 leading-relaxed">
                  To become the world's leading platform for authentic African travel experiences, where every journey supports local communities, preserves cultural heritage, and creates lasting memories through technology-enabled human connections.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Trust</h3>
              <p className="text-gray-300 text-sm">Every business is verified, every experience is authentic</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Authenticity</h3>
              <p className="text-gray-300 text-sm">Real experiences that showcase the true Africa</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Innovation</h3>
              <p className="text-gray-300 text-sm">AI-powered discovery for better travel experiences</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-300 text-sm">Building bridges between cultures and communities</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Story</h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                AFRICONNECT was born from a simple observation: while Africa offers some of the world's most incredible travel experiences, many authentic local businesses struggle to reach international travelers, and travelers often miss out on genuine cultural experiences.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Founded by a team of travel enthusiasts, technology experts, and African tourism advocates, we recognized the need for a platform that could bridge this gap using intelligent technology while preserving the authenticity that makes African travel so special.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Our AI-powered platform doesn't just connect travelers with businesses—it understands preferences, suggests perfect matches, and ensures every interaction supports local communities and preserves cultural heritage.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Today, AFRICONNECT is proud to support hundreds of verified African tourism businesses while helping thousands of travelers discover the authentic Africa they've always dreamed of experiencing.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Authentic Africa?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of travelers discovering the real Africa</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan-trip">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg">
                Start Planning Your Trip
              </Button>
            </Link>
            <Link href="/business/setup">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg">
                List Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

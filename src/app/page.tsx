import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                AFRICONNECT
              </h1>
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
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Beautiful Sunset Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-orange-500/30 to-red-500/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&h=1080&q=80')] bg-cover bg-center opacity-50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Connect to Authentic
              <span className="text-yellow-400"> African Experiences</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered platform connecting travelers to verified local tourism businesses across Africa, while bridging businesses with travel influencers for strategic collaborations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan-trip">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold shadow-lg">
                Plan Your Trip
              </Button>
            </Link>
            <Link href="/business/setup">
              <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white border border-yellow-500 px-8 py-4 text-lg font-semibold">
                List Your Business
              </Button>
            </Link>
            <Link href="/campaigns/new">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black px-8 py-4 text-lg font-semibold shadow-lg">
                Start Collabs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Three Powerful Forces in Travel
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover how AFRICONNECT transforms African tourism through technology, trust, and authentic connections.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-yellow-500 hover:border-yellow-400 bg-gray-800">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-black font-bold">A</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Authentic Local Experiences</h3>
              <p className="text-gray-300 leading-relaxed">
                AI-powered trip discovery connects you to verified local businesses offering authentic African experiences with wildlife, culture, and adventure. Discover unique experiences that showcase the real Africa.
              </p>
            </Card>
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-gray-600 hover:border-gray-500 bg-gray-800">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">T</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Trustworthy International Clientele</h3>
              <p className="text-gray-300 leading-relaxed">
                Verified travelers with reliable booking patterns and high-value travel experiences. Connect with quality travelers who appreciate authentic experiences.
              </p>
            </Card>
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-yellow-500 hover:border-yellow-400 bg-gray-800">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-black font-bold">I</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">↑</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">High-Impact Influencer Marketing</h3>
              <p className="text-gray-300 leading-relaxed">
                AI-driven campaign projections help businesses connect with the right influencers for maximum reach and ROI. Amplify your business through strategic influencer partnerships.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              About AFRICONNECT
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're on a mission to transform African tourism by connecting authentic local experiences with the international community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Our Story</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                AFRICONNECT was born from a simple observation: small, local African tourism businesses had incredible experiences to offer but virtually no access to the international market. We saw talented safari guides, cultural experts, and adventure operators struggling to reach potential customers beyond their immediate communities.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Meanwhile, travelers were seeking authentic African experiences but had no reliable way to connect with verified local businesses. We realized that technology could bridge this gap, creating a platform that empowers local businesses while providing travelers with access to truly authentic experiences.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-black font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Sustainable Tourism</h4>
                  <p className="text-sm text-gray-300">Supporting local communities</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl p-8 h-96 flex items-center justify-center border border-yellow-500/30">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">African Heritage</h3>
                  <p className="text-gray-300">Celebrating the beauty and diversity of Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Beach Image Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* For Travelers Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                For Travelers
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Discover authentic African experiences tailored for travelers. Our AI-powered platform connects you with verified local businesses offering unforgettable adventures.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">AI</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Trip Planning</h3>
                    <p className="text-gray-300">Our advanced AI creates personalized itineraries based on your preferences, budget, and schedule. Get tailored recommendations that match your travel style.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Verified Local Partners</h3>
                    <p className="text-gray-300">Every business is thoroughly verified and trusted by the international community. Travel with confidence knowing you're in good hands.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">★</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Authentic African Experiences</h3>
                    <p className="text-gray-300">Discover truly authentic African experiences that no other platform can offer. Connect with local communities and create memories that last a lifetime.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl p-8 h-96 flex items-center justify-center border border-yellow-500/30">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Happy Travelers</h3>
                  <p className="text-gray-300">Admiring wildlife on safari adventures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Businesses Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl p-8 h-96 flex items-center justify-center border border-yellow-500/30">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">African Business Owners</h3>
                  <p className="text-gray-300">Connecting with international clients</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-white mb-6">
                For Businesses
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Grow your business with international travelers. Connect with travelers seeking authentic African experiences.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">↑</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Premium International Clientele</h3>
                    <p className="text-gray-300">Connect with quality travelers who appreciate authentic experiences and are willing to invest in meaningful travel.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">AI</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI Listing Optimization</h3>
                    <p className="text-gray-300">Our AI helps create compelling titles, descriptions, and pricing strategies. Optimize your listings for better visibility and bookings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">$</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Secure Payments</h3>
                    <p className="text-gray-300">Escrow protection ensures you get paid after service delivery. 15% commission covers platform maintenance and marketing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Influencers Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 via-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                For Influencers
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Create meaningful content with authentic African businesses. Our AI-powered insights help you maximize your reach and ROI while supporting local communities.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">↑</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI Campaign Projections</h3>
                    <p className="text-gray-300">Get data-driven insights on reach, engagement, and ROI. Make informed decisions about your collaboration partnerships.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">H</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Authentic Partnerships</h3>
                    <p className="text-gray-300">Connect with verified local businesses that align with your values. Build meaningful relationships while creating impactful content.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">$</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Fair Compensation</h3>
                    <p className="text-gray-300">Transparent pricing with secure escrow payments. Fair compensation for your creative work and influence.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl p-8 h-96 flex items-center justify-center border border-yellow-500/30">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Influencer Partnership</h3>
                  <p className="text-gray-300">Shaking hands with African business owners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose AFRICONNECT?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We combine cutting-edge technology with deep respect for African culture and communities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-black font-bold">AI</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI-Powered Matching</h3>
              <p className="text-gray-300">
                Our advanced AI algorithms match travelers with the perfect local experiences based on preferences, budget, and interests. Get personalized recommendations that match your travel style.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-white font-bold">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Verified Partners</h3>
              <p className="text-gray-300">
                Every business on our platform is thoroughly verified, ensuring safety, authenticity, and quality for all travelers. Travel with confidence knowing you're in good hands.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-black font-bold">★</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Authentic Experiences</h3>
              <p className="text-gray-300">
                Discover truly authentic African experiences that no other platform can offer. Connect with local communities and create memories that last a lifetime.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-black font-bold">$</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Fair Pricing</h3>
              <p className="text-gray-300">
                Transparent pricing with escrow protection ensures fair deals for both travelers and local businesses. Fair pricing with full refund guarantee.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-white font-bold">C</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Influencer Collaborations</h3>
              <p className="text-gray-300">
                Connect with travel influencers for authentic content creation and expanded reach for your business. Amplify your business through strategic influencer partnerships.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-black font-bold">S</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Sustainable Impact</h3>
              <p className="text-gray-300">
                Every booking supports local communities and contributes to sustainable tourism development across Africa. Make a positive impact through your travel choices.
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
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform African Travel?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the platform that's making authentic African travel more accessible and profitable for everyone.
            </p>
          </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-600 px-8 py-4 text-lg font-semibold shadow-lg">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/travelers">
                <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg font-semibold">
                  Learn More
                </Button>
              </Link>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-2xl font-bold">AFRICONNECT</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Connecting the world to authentic African experiences through AI-powered technology, sustainable tourism, and community empowerment.
              </p>
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-yellow-500">A</span>
                <span className="text-2xl font-bold text-yellow-500">C</span>
                <span className="text-2xl font-bold text-yellow-500">S</span>
                <span className="text-2xl font-bold text-yellow-500">P</span>
                <span className="text-2xl font-bold text-yellow-500">I</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Travelers</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/safari-tours" className="hover:text-yellow-400 transition-colors">Safari Tours</Link></li>
                <li><Link href="/cultural-experiences" className="hover:text-yellow-400 transition-colors">Cultural Experiences</Link></li>
                <li><Link href="/wildlife-conservation" className="hover:text-yellow-400 transition-colors">Wildlife Conservation</Link></li>
                <li><Link href="/adventure-activities" className="hover:text-yellow-400 transition-colors">Adventure Activities</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Businesses</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/list-your-business" className="hover:text-yellow-400 transition-colors">List Your Business</Link></li>
                <li><Link href="/verification" className="hover:text-yellow-400 transition-colors">Get Verified</Link></li>
                <li><Link href="/influencer-collaborations" className="hover:text-yellow-400 transition-colors">Influencer Collaborations</Link></li>
                <li><Link href="/analytics" className="hover:text-yellow-400 transition-colors">Analytics Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 AFRICONNECT. Connecting hearts to Africa's vibrant culture and natural beauty.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Privacy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Terms</Link>
                <Link href="/contact" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

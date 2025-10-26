import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">AFRICONNECT</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Connecting travelers to authentic African experiences through AI-powered discovery and verified local partnerships.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="text-gray-300 hover:text-yellow-400 transition-colors">How It Works</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors">FAQ</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors">Blog</Link></li>
              <li><Link href="/help" className="text-gray-300 hover:text-yellow-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Users</h4>
            <ul className="space-y-2">
              <li><Link href="/travelers" className="text-gray-300 hover:text-yellow-400 transition-colors">For Travelers</Link></li>
              <li><Link href="/businesses" className="text-gray-300 hover:text-yellow-400 transition-colors">For Businesses</Link></li>
              <li><Link href="/influencers" className="text-gray-300 hover:text-yellow-400 transition-colors">For Influencers</Link></li>
              <li><Link href="/plan-trip" className="text-gray-300 hover:text-yellow-400 transition-colors">Plan Your Trip</Link></li>
              <li><Link href="/campaigns" className="text-gray-300 hover:text-yellow-400 transition-colors">Browse Campaigns</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-300 hover:text-yellow-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-yellow-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/accessibility" className="text-gray-300 hover:text-yellow-400 transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-2">Stay Connected</h4>
            <p className="text-gray-300 mb-4">Get the latest African travel insights and exclusive offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 AFRICONNECT. All rights reserved. Connecting the world to authentic African experiences.</p>
        </div>
      </div>
    </footer>
  )
}

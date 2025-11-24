'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ExperienceDetailPage({ params }: { params: { id: string } }) {
  // No experience data - will be fetched from API when businesses create listings
  const experience = null

  if (!experience) {
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="bg-gray-800 border-yellow-500/30 p-12 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Experience Not Found</h1>
            <p className="text-gray-300 text-lg mb-6">
              This experience doesn't exist yet. When verified businesses create listings, they will be available here.
            </p>
            <Link href="/travelers/dashboard/browse-experiences">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Browse Experiences
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return null
}

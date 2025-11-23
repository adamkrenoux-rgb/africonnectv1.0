import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BlogPage() {
  const blogPosts = [
    {
      title: "10 Must-Visit African Destinations in 2024",
      excerpt: "Discover the most incredible African destinations that should be on every traveler's bucket list this year.",
      author: "Sarah Johnson",
      date: "December 15, 2024",
      readTime: "5 min read",
      category: "Travel Tips"
    },
    {
      title: "How AI is Revolutionizing African Tourism",
      excerpt: "Explore how artificial intelligence is transforming the way travelers discover and experience authentic African culture.",
      author: "Michael Chen",
      date: "December 10, 2024",
      readTime: "7 min read",
      category: "Technology"
    },
    {
      title: "Building Trust in Tourism: The Verification Process",
      excerpt: "Learn about our comprehensive verification system that ensures every business meets our quality standards.",
      author: "Aisha Okafor",
      date: "December 5, 2024",
      readTime: "4 min read",
      category: "Business"
    },
    {
      title: "Sustainable Tourism: Supporting Local Communities",
      excerpt: "How responsible tourism practices can create positive impact for African communities and travelers alike.",
      author: "David Mwangi",
      date: "November 28, 2024",
      readTime: "6 min read",
      category: "Sustainability"
    },
    {
      title: "Influencer Marketing in African Tourism",
      excerpt: "The power of authentic storytelling in promoting African destinations and experiences to global audiences.",
      author: "Emma Thompson",
      date: "November 20, 2024",
      readTime: "8 min read",
      category: "Marketing"
    },
    {
      title: "Wildlife Conservation Through Tourism",
      excerpt: "How tourism can support wildlife conservation efforts across Africa while providing unforgettable experiences.",
      author: "Dr. James Okello",
      date: "November 15, 2024",
      readTime: "9 min read",
      category: "Conservation"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Connexus
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
            Connexus <span className="text-yellow-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Insights, tips, and stories about authentic African travel, sustainable tourism, and the future of travel technology.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Article</h2>
          </div>
          
          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-6xl">🌍</span>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                  <span className="ml-4 text-gray-400 text-sm">Travel Tips</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">The Ultimate Guide to Authentic African Travel</h3>
                <p className="text-gray-300 mb-6">
                  Discover how to experience the real Africa beyond tourist traps. From connecting with local communities to understanding cultural nuances, this comprehensive guide will transform your African adventure.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">S</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Sarah Johnson</p>
                      <p className="text-gray-400 text-sm">December 20, 2024 • 12 min read</p>
                    </div>
                  </div>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Latest Articles</h2>
            <p className="text-xl text-gray-300">Stay updated with the latest insights and stories</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-4xl">
                    {index === 0 && "🏔️"}
                    {index === 1 && "🤖"}
                    {index === 2 && "✓"}
                    {index === 3 && "🌱"}
                    {index === 4 && "📱"}
                    {index === 5 && "🦁"}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-gray-700 text-yellow-400 px-2 py-1 rounded text-xs font-medium">{post.category}</span>
                    <span className="ml-2 text-gray-400 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{post.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{post.author}</p>
                      <p className="text-gray-400 text-xs">{post.date}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Read
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-gray-700 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-6">Get the latest articles and travel insights delivered to your inbox</p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6">
                Subscribe
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

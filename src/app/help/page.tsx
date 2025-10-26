import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function HelpPage() {
  const helpSections = [
    {
      title: "Getting Started",
      items: [
        "How to create an account",
        "Setting up your profile",
        "Understanding user roles",
        "Platform navigation basics"
      ]
    },
    {
      title: "For Travelers",
      items: [
        "How to plan a trip with AI",
        "Booking experiences",
        "Managing your bookings",
        "Writing reviews"
      ]
    },
    {
      title: "For Businesses",
      items: [
        "Listing your business",
        "Verification process",
        "Managing bookings",
        "Analytics and insights"
      ]
    },
    {
      title: "For Influencers",
      items: [
        "Creating campaigns",
        "Finding collaborations",
        "Managing applications",
        "Content guidelines"
      ]
    },
    {
      title: "Account & Billing",
      items: [
        "Payment methods",
        "Billing questions",
        "Account settings",
        "Privacy and security"
      ]
    },
    {
      title: "Technical Support",
      items: [
        "Browser compatibility",
        "Mobile app issues",
        "Performance problems",
        "Error troubleshooting"
      ]
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
            Help <span className="text-yellow-400">Center</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Find answers to common questions and get support for your AFRICONNECT experience
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Search for Help</h2>
              <div className="flex gap-2 max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for help articles, guides, and FAQs..."
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6">
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Help Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Browse Help Topics</h2>
            <p className="text-xl text-gray-300">Find the information you need quickly</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpSections.map((section, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 p-6 hover:border-yellow-500/50 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-xl text-gray-300 mb-8">We're here to assist you with any questions or issues</p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">General Support</h3>
                <p className="text-gray-300 mb-4">
                  For general questions about using the platform, account issues, or technical problems.
                </p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  Contact Support
                </Button>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Business Support</h3>
                <p className="text-gray-300 mb-4">
                  For business-specific questions about listings, verification, or collaboration features.
                </p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  Business Support
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
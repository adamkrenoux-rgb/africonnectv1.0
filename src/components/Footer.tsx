import Link from 'next/link'

export default function Footer() {
  return (
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
  )
}
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BookingSuccessPage() {
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
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Sign In</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-8">
            <span className="text-4xl text-white">✓</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Booking Confirmed!
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your African adventure has been successfully booked. You will receive a confirmation email with all the details shortly.
          </p>
          
          <Card className="bg-gray-800 border-yellow-500/30 p-8 max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">Trip Information</h3>
                <p className="text-gray-300 mb-1">Destination: Kenya</p>
                <p className="text-gray-300 mb-1">Duration: 7 days</p>
                <p className="text-gray-300 mb-1">Travel Dates: March 2024</p>
                <p className="text-gray-300 mb-1">Group Size: 2 people</p>
              </div>
              
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">Payment Details</h3>
                <p className="text-gray-300 mb-1">Total Amount: $2,500</p>
                <p className="text-gray-300 mb-1">Payment Method: Credit Card</p>
                <p className="text-gray-300 mb-1">Booking ID: #AFR-2024-001</p>
                <p className="text-gray-300 mb-1">Status: Confirmed</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <h3 className="text-yellow-400 font-semibold mb-2">What's Next?</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• You will receive a detailed itinerary within 24 hours</li>
                <li>• Our local partner will contact you directly</li>
                <li>• Prepare for your amazing African adventure!</li>
              </ul>
            </div>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold shadow-lg">
                View Dashboard
              </Button>
            </Link>
            <Link href="/plan-trip">
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg font-semibold">
                Plan Another Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 className="text-2xl font-bold">AFRICONNECT</h3>
          </div>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Connecting the world to authentic African experiences through AI-powered technology.
          </p>
          <p className="text-gray-400 text-sm">
            © 2024 AFRICONNECT. Connecting hearts to Africa's vibrant culture and natural beauty.
          </p>
        </div>
      </footer>
    </div>
  )
}
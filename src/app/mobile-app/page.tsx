export default function MobileAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-africa-earth/10 via-africa-green/10 to-africa-blue/10">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-africa-earth mb-6">📱 Mobile App Coming Soon</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take AFRICONNECT with you wherever you go. Our mobile app will bring authentic African travel experiences to your fingertips.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">🧭</div>
            <h3 className="text-xl font-semibold mb-2">AI Trip Planning</h3>
            <p className="text-gray-600">Plan your African adventure with AI-powered recommendations right from your phone.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Influencer Collaborations</h3>
            <p className="text-gray-600">Connect with businesses and manage campaigns on the go.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Book experiences and manage payments with built-in security.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">Location Services</h3>
            <p className="text-gray-600">Find nearby experiences and get real-time recommendations.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">Push Notifications</h3>
            <p className="text-gray-600">Stay updated with booking confirmations and new opportunities.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">Media Sharing</h3>
            <p className="text-gray-600">Share your experiences and connect with the community.</p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Soon</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're working hard to bring you the best mobile experience for African travel.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">iOS App</h3>
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-gray-600">Coming to the App Store</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Android App</h3>
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-gray-600">Coming to Google Play</p>
              </div>
            </div>
          </div>

          <div className="bg-africa-earth/10 border border-africa-earth/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-africa-earth mb-2">Get Notified</h3>
            <p className="text-gray-700 mb-4">
              Be the first to know when our mobile app is available for download.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-africa-earth"
              />
              <button className="bg-africa-earth hover:bg-africa-earth/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Accessibility Statement</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 mb-6">
              AFRICONNECT is committed to ensuring digital accessibility for all users, including those with disabilities. 
              We strive to provide an inclusive experience that meets or exceeds the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Keyboard navigation support throughout the platform</li>
              <li>Screen reader compatibility with proper ARIA labels</li>
              <li>High contrast color schemes and readable fonts</li>
              <li>Alternative text for all images and media</li>
              <li>Focus indicators for interactive elements</li>
              <li>Responsive design that works on all devices</li>
              <li>Clear heading structure and semantic HTML</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback</h2>
            <p className="text-gray-700 mb-6">
              If you encounter any accessibility barriers or have suggestions for improvement, 
              please contact us at accessibility@africonnect.com. We welcome your feedback and 
              are committed to making AFRICONNECT accessible to everyone.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Efforts</h2>
            <p className="text-gray-700">
              We regularly review and test our platform for accessibility compliance and 
              continuously work to improve the user experience for all visitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


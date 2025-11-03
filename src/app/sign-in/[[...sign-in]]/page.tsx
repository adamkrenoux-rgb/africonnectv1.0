import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">🌍 AFRICONNECT</h1>
          <p className="text-gray-300">Sign in to your account</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-yellow-500 hover:bg-yellow-600 text-black',
              card: 'shadow-lg bg-gray-800 border-gray-700',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600',
              formFieldInput: 'bg-gray-700 border-gray-600 text-white',
              formFieldLabel: 'text-gray-300',
            }
          }}
        />
      </div>
    </div>
  )
}

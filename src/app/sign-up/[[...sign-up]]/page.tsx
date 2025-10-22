import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-africa-earth/10 via-africa-green/10 to-africa-blue/10">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-africa-earth mb-2">🌍 AFRICONNECT</h1>
          <p className="text-gray-600">Create your account</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-africa-earth hover:bg-africa-earth/90 text-white',
              card: 'shadow-lg',
            }
          }}
        />
      </div>
    </div>
  )
}

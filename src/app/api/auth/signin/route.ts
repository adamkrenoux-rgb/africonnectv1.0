import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    // Simple mock authentication - in production, use Clerk or similar
    const user = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'TRAVELER',
      createdAt: new Date()
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Signed in successfully!'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to sign in',
      error: (error as Error).message
    }, { status: 500 })
  }
}

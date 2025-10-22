import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json()
    
    // Simple mock authentication - in production, use Clerk or similar
    const user = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: role || 'TRAVELER',
      createdAt: new Date()
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Account created successfully!'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create account',
      error: (error as Error).message
    }, { status: 500 })
  }
}

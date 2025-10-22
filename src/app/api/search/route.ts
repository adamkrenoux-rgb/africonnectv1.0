import { NextResponse, NextRequest } from 'next/server'
// import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const businessType = searchParams.get('type') || ''
    
    // Get verified businesses from database
    const where: any = {
      verificationBadge: true
    }
    
    if (location) where.country = location
    if (businessType) where.businessType = businessType

    // Temporarily return empty array until database is set up
    const verifiedBusinesses = []
    
    // If no verified businesses found
    if (verifiedBusinesses.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        message: 'No verified results match your search.',
        total: 0
      })
    }
    
    // Filter by search query if provided
    const filteredResults = query 
      ? verifiedBusinesses.filter(business => 
          business.businessName.toLowerCase().includes(query.toLowerCase()) ||
          business.description.toLowerCase().includes(query.toLowerCase()) ||
          business.city.toLowerCase().includes(query.toLowerCase())
        )
      : verifiedBusinesses
    
    // If no results after filtering
    if (filteredResults.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        message: 'No verified results match your search.',
        total: 0
      })
    }
    
    return NextResponse.json({
      success: true,
      results: filteredResults,
      message: `Found ${filteredResults.length} verified results`,
      total: filteredResults.length
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}

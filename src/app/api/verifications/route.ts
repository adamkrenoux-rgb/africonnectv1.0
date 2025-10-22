import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { DocumentType, VerificationStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (businessId) {
      where.businessId = businessId
    }
    
    if (status) {
      where.verificationStatus = status
    }

    const verifications = await prisma.verification.findMany({
      where,
      include: {
        business: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: verifications })
  } catch (error) {
    console.error('Error fetching verifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { businessId, documentType, documentUrl } = body

    // Verify user owns the business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found or unauthorized' }, { status: 404 })
    }

    const verification = await prisma.verification.create({
      data: {
        businessId,
        documentType: documentType as DocumentType,
        documentUrl,
        verificationStatus: 'PENDING'
      },
      include: {
        business: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: verification })
  } catch (error) {
    console.error('Error creating verification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


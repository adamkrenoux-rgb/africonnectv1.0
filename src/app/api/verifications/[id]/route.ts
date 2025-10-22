import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { VerificationStatus } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { verificationStatus, notes } = body

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const verification = await prisma.verification.update({
      where: { id: params.id },
      data: {
        verificationStatus: verificationStatus as VerificationStatus,
        verifiedAt: verificationStatus === 'APPROVED' ? new Date() : null,
        verifiedBy: userId,
        notes
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

    // If approved, update business verification badge
    if (verificationStatus === 'APPROVED') {
      await prisma.business.update({
        where: { id: verification.businessId },
        data: { verificationBadge: true }
      })
    }

    return NextResponse.json({ success: true, data: verification })
  } catch (error) {
    console.error('Error updating verification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


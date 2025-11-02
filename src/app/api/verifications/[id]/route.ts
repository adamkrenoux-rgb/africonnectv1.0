import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const verification = await prisma.verification.findUnique({
      where: { id: params.id },
      include: {
        business: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Verification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, verification })
  } catch (error) {
    console.error('Error fetching verification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch verification' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, adminNotes } = body

    // Validate status
    if (status && !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get verification and business
    const verification = await prisma.verification.findUnique({
      where: { id: params.id },
      include: { business: true }
    })

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Verification not found' },
        { status: 404 }
      )
    }

    // Update verification
    const updatedVerification = await prisma.verification.update({
      where: { id: params.id },
      data: {
        status: status || verification.status,
        adminNotes: adminNotes !== undefined ? adminNotes : verification.adminNotes,
        ...(status === 'APPROVED' && { verifiedAt: new Date() })
      },
      include: {
        business: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // If approved, update business verification badge
    if (status === 'APPROVED') {
      await prisma.business.update({
        where: { id: verification.businessId },
        data: { verificationBadge: true }
      })

      // Send email notification (if email service is configured)
      if (verification.business.user?.email) {
        try {
          const { sendEmail, emailTemplates } = await import('@/lib/email')
          await sendEmail({
            to: verification.business.user.email,
            ...emailTemplates.verificationStatus({
              businessName: verification.business.businessName,
              status: 'APPROVED',
              adminNotes
            })
          })
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError)
          // Don't fail the verification update if email fails
        }
      }
    } else if (status === 'REJECTED') {
      // Send rejection email
      if (verification.business.user?.email) {
        try {
          const { sendEmail, emailTemplates } = await import('@/lib/email')
          await sendEmail({
            to: verification.business.user.email,
            ...emailTemplates.verificationStatus({
              businessName: verification.business.businessName,
              status: 'REJECTED',
              adminNotes
            })
          })
        } catch (emailError) {
          console.error('Failed to send rejection email:', emailError)
        }
      }
    }

    return NextResponse.json({ success: true, verification: updatedVerification })
  } catch (error: any) {
    console.error('Error updating verification:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update verification' },
      { status: 500 }
    )
  }
}
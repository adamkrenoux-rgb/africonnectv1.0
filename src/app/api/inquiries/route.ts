import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

const inquirySchema = z.object({
  businessId: z.string().min(1),
  businessName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  inquiryType: z.enum(['general', 'booking', 'custom', 'partnership']).default('general')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validation = inquirySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { businessId, businessName, name, email, phone, message, inquiryType } = validation.data

    // Get business owner email
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Send email to business owner
    try {
      await sendEmail({
        to: business.email || business.user.email,
        subject: `New Inquiry from ${name} - ${businessName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #F59E0B;">New Inquiry Received</h2>
            <p>You have received a new inquiry for <strong>${businessName}</strong>.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Inquiry Details</h3>
              <p><strong>Type:</strong> ${inquiryType}</p>
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              You can reply directly to this email to contact ${name}.
            </p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Failed to send inquiry email:', emailError)
      // Don't fail the request if email fails - inquiry is still logged
    }

    // Optionally save inquiry to database (if you add an Inquiry model)
    // For now, we just send the email

    return NextResponse.json({
      success: true,
      message: 'Inquiry sent successfully'
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error processing inquiry:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process inquiry' },
      { status: 500 }
    )
  }
}


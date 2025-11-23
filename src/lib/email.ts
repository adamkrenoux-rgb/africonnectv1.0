/**
 * Email service using Resend
 * Falls back to console logging if RESEND_API_KEY is not configured
 */

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'Connexus <noreply@connexus.com>'
const USE_MOCK = !RESEND_API_KEY

/**
 * Send an email using Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const { to, subject, html, from = FROM_EMAIL } = options

  // Mock mode - just log
  if (USE_MOCK) {
    console.log('📧 [MOCK EMAIL]', {
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      from,
      html: html.substring(0, 100) + '...'
    })
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      error: 'Email service not configured (mock mode)'
    }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email')
    }

    return {
      success: true,
      messageId: data.id
    }
  } catch (error: any) {
    console.error('Email sending error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send email'
    }
  }
}

/**
 * Email templates
 */
export const emailTemplates = {
  bookingConfirmation: (booking: {
    id: string
    listingTitle: string
    businessName: string
    bookingDate: string
    totalAmount: number
    travelerName: string
  }) => ({
    subject: `Booking Confirmation - ${booking.listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Connexus</h1>
              <p>Booking Confirmation</p>
            </div>
            <div class="content">
              <h2>Hello ${booking.travelerName}!</h2>
              <p>Your booking has been confirmed. We're excited to help you discover authentic African experiences!</p>
              
              <div class="info-box">
                <h3>Booking Details</h3>
                <p><strong>Experience:</strong> ${booking.listingTitle}</p>
                <p><strong>Business:</strong> ${booking.businessName}</p>
                <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
              </div>

              <p>Your payment has been securely held in escrow and will be released to the business after your experience is completed.</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://connexus.com'}/bookings/${booking.id}" class="button">View Booking Details</a>
              
              <div class="footer">
                <p>Need help? Contact us at support@connexus.com</p>
                <p>&copy; 2024 Connexus. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  campaignApplication: (application: {
    businessName: string
    campaignTitle: string
    influencerName: string
    proposalText: string
  }) => ({
    subject: `New Application: ${application.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎥 Connexus</h1>
              <p>New Campaign Application</p>
            </div>
            <div class="content">
              <h2>Hello ${application.influencerName}!</h2>
              <p>You have received a new application for your campaign.</p>
              
              <div class="info-box">
                <h3>Application Details</h3>
                <p><strong>Campaign:</strong> ${application.campaignTitle}</p>
                <p><strong>Business:</strong> ${application.businessName}</p>
                <p><strong>Proposal:</strong></p>
                <p>${application.proposalText}</p>
              </div>

              <p>Review the application and respond through your dashboard.</p>
              
              <div class="footer">
                <p>Need help? Contact us at support@connexus.com</p>
                <p>&copy; 2024 Connexus. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  verificationStatus: (verification: {
    businessName: string
    status: 'APPROVED' | 'REJECTED' | 'PENDING'
    adminNotes?: string
  }) => ({
    subject: `Verification ${verification.status}: ${verification.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${verification.status === 'APPROVED' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : verification.status === 'REJECTED' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${verification.status === 'APPROVED' ? '#10b981' : verification.status === 'REJECTED' ? '#ef4444' : '#f59e0b'}; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Connexus</h1>
              <p>Verification ${verification.status}</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>Your business verification for <strong>${verification.businessName}</strong> has been ${verification.status.toLowerCase()}.</p>
              
              ${verification.adminNotes ? `
              <div class="info-box">
                <p><strong>Admin Notes:</strong></p>
                <p>${verification.adminNotes}</p>
              </div>
              ` : ''}

              ${verification.status === 'APPROVED' ? `
              <p>Congratulations! Your business is now verified. You'll see a verification badge on your profile.</p>
              ` : verification.status === 'REJECTED' ? `
              <p>If you have questions or would like to appeal this decision, please contact our support team.</p>
              ` : `
              <p>We're reviewing your verification documents. We'll notify you once the review is complete.</p>
              `}
              
              <div class="footer">
                <p>Need help? Contact us at support@connexus.com</p>
                <p>&copy; 2024 Connexus. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  })
}


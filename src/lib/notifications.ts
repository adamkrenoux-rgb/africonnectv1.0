import { prisma } from './prisma'

export interface NotificationData {
  type: 'booking' | 'campaign' | 'verification' | 'application' | 'review'
  title: string
  message: string
  userId: string
  data?: any
}

export async function createNotification(notification: NotificationData) {
  try {
    await prisma.notification.create({
      data: {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        userId: notification.userId,
        data: notification.data || {},
        read: false
      }
    })

    // Send email notification (optional)
    await sendEmailNotification(notification)
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

export async function sendEmailNotification(notification: NotificationData) {
  try {
    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: notification.userId },
      select: { email: true, name: true }
    })

    if (!user?.email) return

    // In a real implementation, you would use an email service like Resend, SendGrid, etc.
    console.log(`Email notification to ${user.email}: ${notification.title}`)
    
    // Mock email sending
    const emailData = {
      to: user.email,
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">🌍 AFRICONNECT</h2>
          <h3>${notification.title}</h3>
          <p>${notification.message}</p>
          <p style="color: #666; font-size: 14px;">
            This is an automated notification from AFRICONNECT.
          </p>
        </div>
      `
    }

    // Here you would integrate with your email service
    // await emailService.send(emailData)
  } catch (error) {
    console.error('Error sending email notification:', error)
  }
}

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  BOOKING_CONFIRMED: {
    title: 'Booking Confirmed',
    message: 'Your booking has been confirmed and payment is being processed.'
  },
  BOOKING_CANCELLED: {
    title: 'Booking Cancelled',
    message: 'Your booking has been cancelled and refund is being processed.'
  },
  VERIFICATION_APPROVED: {
    title: 'Business Verified',
    message: 'Congratulations! Your business has been verified and you now have the "✅ Verified Local Partner" badge.'
  },
  VERIFICATION_REJECTED: {
    title: 'Verification Rejected',
    message: 'Your business verification was rejected. Please check the requirements and resubmit.'
  },
  CAMPAIGN_APPLICATION: {
    title: 'New Campaign Application',
    message: 'A business has applied to your campaign.'
  },
  APPLICATION_ACCEPTED: {
    title: 'Application Accepted',
    message: 'Your application has been accepted! The collaboration is ready to begin.'
  },
  APPLICATION_REJECTED: {
    title: 'Application Rejected',
    message: 'Your application was not selected for this campaign.'
  },
  COLLABORATION_STARTED: {
    title: 'Collaboration Started',
    message: 'Your collaboration has begun. Start creating content!'
  },
  CONTENT_SUBMITTED: {
    title: 'Content Submitted',
    message: 'New content has been submitted for your review.'
  },
  COLLABORATION_COMPLETED: {
    title: 'Collaboration Completed',
    message: 'Your collaboration has been completed and payment has been released.'
  },
  NEW_REVIEW: {
    title: 'New Review',
    message: 'You have received a new review from a traveler.'
  }
} as const

// Helper functions for specific notification types
export async function notifyBookingConfirmed(bookingId: string, travelerId: string) {
  return createNotification({
    type: 'booking',
    title: NOTIFICATION_TEMPLATES.BOOKING_CONFIRMED.title,
    message: NOTIFICATION_TEMPLATES.BOOKING_CONFIRMED.message,
    userId: travelerId,
    data: { bookingId }
  })
}

export async function notifyVerificationApproved(businessId: string, businessUserId: string) {
  return createNotification({
    type: 'verification',
    title: NOTIFICATION_TEMPLATES.VERIFICATION_APPROVED.title,
    message: NOTIFICATION_TEMPLATES.VERIFICATION_APPROVED.message,
    userId: businessUserId,
    data: { businessId }
  })
}

export async function notifyCampaignApplication(campaignId: string, influencerId: string, businessName: string) {
  return createNotification({
    type: 'application',
    title: NOTIFICATION_TEMPLATES.CAMPAIGN_APPLICATION.title,
    message: `${NOTIFICATION_TEMPLATES.CAMPAIGN_APPLICATION.message} from ${businessName}.`,
    userId: influencerId,
    data: { campaignId, businessName }
  })
}

export async function notifyApplicationAccepted(applicationId: string, businessUserId: string) {
  return createNotification({
    type: 'application',
    title: NOTIFICATION_TEMPLATES.APPLICATION_ACCEPTED.title,
    message: NOTIFICATION_TEMPLATES.APPLICATION_ACCEPTED.message,
    userId: businessUserId,
    data: { applicationId }
  })
}

export async function notifyNewReview(businessId: string, businessUserId: string, reviewerName: string) {
  return createNotification({
    type: 'review',
    title: NOTIFICATION_TEMPLATES.NEW_REVIEW.title,
    message: `${NOTIFICATION_TEMPLATES.NEW_REVIEW.message} from ${reviewerName}.`,
    userId: businessUserId,
    data: { businessId, reviewerName }
  })
}


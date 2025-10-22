import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import TravelerDashboard from '@/components/dashboard/TravelerDashboard'
import BusinessDashboard from '@/components/dashboard/BusinessDashboard'
import InfluencerDashboard from '@/components/dashboard/InfluencerDashboard'

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      business: true,
      travelerBookings: {
        include: {
          listing: true,
          business: true
        }
      },
      influencerCampaigns: true
    }
  })

  if (!user) {
    redirect('/onboarding')
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case UserRole.TRAVELER:
      return <TravelerDashboard user={user} />
    case UserRole.BUSINESS:
      return <BusinessDashboard user={user} />
    case UserRole.INFLUENCER:
      return <InfluencerDashboard user={user} />
    default:
      return <div>Unknown user role</div>
  }
}

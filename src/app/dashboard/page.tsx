import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth-helpers'

const ROLE_REDIRECTS: Record<string, string> = {
  TRAVELER: '/travelers/dashboard',
  BUSINESS: '/businesses/dashboard',
  INFLUENCER: '/influencers/dashboard',
  ADMIN: '/admin'
}

export default async function Dashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in?redirect_url=/dashboard')
  }

  const destination = ROLE_REDIRECTS[user.role] || '/travelers/dashboard'
  redirect(destination)
}
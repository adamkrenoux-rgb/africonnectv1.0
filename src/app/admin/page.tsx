'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCurrentUser } from '@/components/UserProvider'
import { 
  Users, 
  Building2, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalBusinesses: number
  totalListings: number
  totalBookings: number
  totalCampaigns: number
  pendingVerifications: number
  revenue: {
    total: number
    commission: number
    net: number
  }
  usersByRole: Record<string, number>
  bookingsByStatus: Record<string, number>
  verifiedBusinesses: number
  unverifiedBusinesses: number
  recentBookings: Array<{
    id: string
    listingTitle: string
    travelerName: string
    businessName: string
    amount: number
    status: string
    paymentStatus: string
    createdAt: string
  }>
  pendingVerificationsList: Array<{
    id: string
    businessId: string
    businessName: string
    city: string
    country: string
    ownerName: string
    ownerEmail: string
    status: string
    submittedAt: string
  }>
}

export default function AdminDashboard() {
  const { dbUser, isLoaded } = useCurrentUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isLoaded) {
      // TODO: Add proper admin role check
      // if (dbUser?.role !== 'ADMIN') {
      //   router.push('/')
      //   return
      // }
      fetchStats()
    }
  }, [isLoaded])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.error || 'Failed to load stats')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load admin dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationAction = async (verificationId: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    try {
      const response = await fetch(`/api/verifications/${verificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes: notes || ''
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh stats
        fetchStats()
      } else {
        alert(data.error || 'Failed to update verification')
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification')
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'verifications', name: 'Verifications', icon: '✅' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'bookings', name: 'Bookings', icon: '📅' },
    { id: 'revenue', name: 'Revenue', icon: '💰' },
  ]

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                AFRICONNECT
              </Link>
              <span className="ml-4 px-3 py-1 bg-yellow-500 text-black text-sm font-semibold rounded">
                Admin Dashboard
              </span>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-gray-600 text-gray-700 hover:bg-gray-100">
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <Card className="bg-gray-800 border-red-500/30 p-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </Card>
        ) : stats ? (
          <>
            {/* Tabs */}
            <div className="mb-8">
              <div className="flex space-x-2 border-b border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-yellow-500 text-yellow-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gray-800 border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-12 h-12 text-yellow-400 opacity-50" />
                    </div>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Businesses</p>
                        <p className="text-3xl font-bold text-white">{stats.totalBusinesses}</p>
                      </div>
                      <Building2 className="w-12 h-12 text-yellow-400 opacity-50" />
                    </div>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
                        <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                      </div>
                      <Calendar className="w-12 h-12 text-yellow-400 opacity-50" />
                    </div>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Pending Verifications</p>
                        <p className="text-3xl font-bold text-white">{stats.pendingVerifications}</p>
                      </div>
                      <Shield className="w-12 h-12 text-yellow-400 opacity-50" />
                    </div>
                  </Card>
                </div>

                {/* Revenue Card */}
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Revenue Overview</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">${stats.revenue.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Platform Commission</p>
                      <p className="text-2xl font-bold text-yellow-400">${stats.revenue.commission.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Net Revenue</p>
                      <p className="text-2xl font-bold text-green-400">${stats.revenue.net.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>

                {/* Recent Bookings */}
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Recent Bookings</h3>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      View All
                    </Button>
                  </div>
                  {stats.recentBookings.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No recent bookings</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-white font-semibold">{booking.listingTitle}</p>
                            <p className="text-gray-400 text-sm">
                              {booking.travelerName} → {booking.businessName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">${booking.amount.toFixed(2)}</p>
                            <p className={`text-xs ${
                              booking.status === 'COMPLETED' ? 'text-green-400' :
                              booking.status === 'PENDING' ? 'text-yellow-400' :
                              'text-gray-400'
                            }`}>
                              {booking.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Verifications Tab */}
            {activeTab === 'verifications' && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Verification Queue ({stats.pendingVerifications})
                    </h3>
                  </div>

                  {stats.pendingVerificationsList.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="w-16 h-16 mx-auto text-green-400 mb-4" />
                      <p className="text-gray-300 text-lg">No pending verifications</p>
                      <p className="text-gray-400 text-sm mt-2">All businesses are verified!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stats.pendingVerificationsList.map((verification) => (
                        <Card key={verification.id} className="bg-gray-700/50 border-gray-600 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white mb-2">
                                {verification.businessName}
                              </h4>
                              <div className="space-y-1 text-sm text-gray-300">
                                <p>
                                  <span className="font-medium">Location:</span> {verification.city}, {verification.country}
                                </p>
                                <p>
                                  <span className="font-medium">Owner:</span> {verification.ownerName} ({verification.ownerEmail})
                                </p>
                                <p>
                                  <span className="font-medium">Submitted:</span> {new Date(verification.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
                                <Clock className="w-3 h-3 inline mr-1" />
                                PENDING
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-gray-600">
                            <Button
                              onClick={() => {
                                if (confirm(`Approve verification for ${verification.businessName}?`)) {
                                  handleVerificationAction(verification.id, 'APPROVED')
                                }
                              }}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => {
                                const notes = prompt('Rejection reason (optional):')
                                if (notes !== null) {
                                  handleVerificationAction(verification.id, 'REJECTED', notes)
                                }
                              }}
                              variant="outline"
                              className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Link href={`/admin/verifications/${verification.id}`}>
                              <Button variant="outline" className="border-gray-600 text-gray-300">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">User Statistics</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {Object.entries(stats.usersByRole).map(([role, count]) => (
                      <div key={role} className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">{role}</p>
                        <p className="text-2xl font-bold text-white">{count}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Business Verification</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                        <p className="text-gray-400 text-sm">Verified Businesses</p>
                      </div>
                      <p className="text-3xl font-bold text-green-400">{stats.verifiedBusinesses}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-yellow-400" />
                        <p className="text-gray-400 text-sm">Unverified Businesses</p>
                      </div>
                      <p className="text-3xl font-bold text-yellow-400">{stats.unverifiedBusinesses}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Bookings by Status</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {Object.entries(stats.bookingsByStatus).map(([status, count]) => (
                      <div key={status} className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">{status}</p>
                        <p className="text-2xl font-bold text-white">{count}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Bookings</h3>
                  {stats.recentBookings.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No bookings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-white font-semibold">{booking.listingTitle}</p>
                            <p className="text-gray-400 text-sm">
                              {booking.travelerName} → {booking.businessName}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(booking.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">${booking.amount.toFixed(2)}</p>
                            <p className={`text-xs ${
                              booking.status === 'COMPLETED' ? 'text-green-400' :
                              booking.status === 'PENDING' ? 'text-yellow-400' :
                              'text-gray-400'
                            }`}>
                              {booking.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gray-700/50 rounded-lg p-6">
                      <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                      <p className="text-3xl font-bold text-white">${stats.revenue.total.toFixed(2)}</p>
                      <p className="text-gray-500 text-xs mt-2">All transactions</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                      <p className="text-gray-400 text-sm mb-2">Platform Commission</p>
                      <p className="text-3xl font-bold text-yellow-400">${stats.revenue.commission.toFixed(2)}</p>
                      <p className="text-gray-500 text-xs mt-2">15% commission rate</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                      <p className="text-gray-400 text-sm mb-2">Net Revenue</p>
                      <p className="text-3xl font-bold text-green-400">${stats.revenue.net.toFixed(2)}</p>
                      <p className="text-gray-500 text-xs mt-2">After commission</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
                  {stats.recentBookings.filter(b => b.paymentStatus !== 'PENDING').length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No completed transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentBookings
                        .filter(b => b.paymentStatus !== 'PENDING')
                        .slice(0, 10)
                        .map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                            <div>
                              <p className="text-white font-semibold">{booking.listingTitle}</p>
                              <p className="text-gray-400 text-sm">{booking.businessName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-semibold">${booking.amount.toFixed(2)}</p>
                              <p className="text-gray-500 text-xs">
                                Commission: ${(booking.amount * 0.15).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AdminStats {
  totalUsers: number
  totalBusinesses: number
  totalBookings: number
  totalRevenue: number
  pendingVerifications: number
  activeCampaigns: number
  recentBookings: any[]
  pendingVerificationsList: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-africa-earth mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage AFRICONNECT platform</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="text-2xl">👥</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">🏢</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">📅</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-2xl">💰</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'verifications', name: 'Verifications', icon: '✅' },
              { id: 'transactions', name: 'Transactions', icon: '💳' },
              { id: 'campaigns', name: 'Campaigns', icon: '📱' },
              { id: 'analytics', name: 'Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-africa-earth text-africa-earth'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.recentBookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent bookings</p>
                  ) : (
                    <div className="space-y-3">
                      {stats?.recentBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{booking.listing.title}</p>
                            <p className="text-sm text-gray-600">{booking.business.businessName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${booking.totalAmount}</p>
                            <p className="text-sm text-gray-500">{booking.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Pending Verifications</span>
                      <span className="text-sm text-gray-600">{stats?.pendingVerifications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Campaigns</span>
                      <span className="text-sm text-gray-600">{stats?.activeCampaigns}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average Booking Value</span>
                      <span className="text-sm text-gray-600">
                        ${stats ? (stats.totalRevenue / stats.totalBookings).toFixed(0) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Commission Rate</span>
                      <span className="text-sm text-gray-600">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Business Verifications</h3>
              <Button onClick={fetchAdminData} variant="outline">
                Refresh
              </Button>
            </div>
            {stats?.pendingVerificationsList.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold mb-2">No Pending Verifications</h3>
                  <p className="text-gray-600">All businesses are up to date</p>
                </CardContent>
              </Card>
            ) : (
              stats?.pendingVerificationsList.map((verification) => (
                <Card key={verification.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{verification.business.businessName}</h3>
                        <p className="text-gray-600">{verification.business.user.name}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Document: {verification.documentType}</p>
                          <p>Submitted: {new Date(verification.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Transaction Monitoring</h3>
              <p className="text-gray-600 mb-4">Monitor all platform transactions and payments</p>
              <Button className="bg-africa-earth hover:bg-africa-earth/90">
                View Transaction Report
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'campaigns' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Campaign Management</h3>
              <p className="text-gray-600 mb-4">Monitor influencer campaigns and collaborations</p>
              <Button className="bg-africa-earth hover:bg-africa-earth/90">
                View Campaign Analytics
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Platform Analytics</h3>
              <p className="text-gray-600 mb-4">Detailed insights into platform performance</p>
              <Button className="bg-africa-earth hover:bg-africa-earth/90">
                View Analytics Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


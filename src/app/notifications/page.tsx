'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all')

  // Mock notifications data - in real app this would come from API
  const notifications = [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Received!',
      message: 'Sarah Johnson booked your Maasai Mara Safari for March 15-17, 2024',
      timestamp: '2 minutes ago',
      read: false,
      action: 'View Booking',
      actionUrl: '/businesses/dashboard/bookings'
    },
    {
      id: '2',
      type: 'campaign',
      title: 'Campaign Application Received',
      message: 'TravelWithEmma applied to your Safari Adventure Campaign',
      timestamp: '1 hour ago',
      read: false,
      action: 'Review Application',
      actionUrl: '/campaigns/1/applications'
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'Mike Chen sent you a message about your Cultural Village Tour',
      timestamp: '3 hours ago',
      read: true,
      action: 'Reply',
      actionUrl: '/messages'
    },
    {
      id: '4',
      type: 'review',
      title: 'New Review Received',
      message: 'You received a 5-star review from Sarah Johnson for your Safari experience',
      timestamp: '1 day ago',
      read: true,
      action: 'View Review',
      actionUrl: '/businesses/dashboard/reviews'
    },
    {
      id: '5',
      type: 'collaboration',
      title: 'Collaboration Accepted',
      message: 'Your application to Serengeti Safari Tours campaign was accepted!',
      timestamp: '2 days ago',
      read: true,
      action: 'View Agreement',
      actionUrl: '/influencers/dashboard/agreements'
    },
    {
      id: '6',
      type: 'verification',
      title: 'Business Verified',
      message: 'Congratulations! Your business has been verified and now shows the verified badge',
      timestamp: '3 days ago',
      read: true,
      action: 'View Profile',
      actionUrl: '/businesses/dashboard/profile'
    }
  ]

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    // In real app, this would update the notification in the database
    console.log('Marking notification as read:', id)
  }

  const markAllAsRead = () => {
    // In real app, this would mark all notifications as read
    console.log('Marking all notifications as read')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black flex items-center gap-2">
                Africonnect
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Profile</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Notifications</h1>
              <p className="text-xl text-gray-300">Stay updated with all your platform activity</p>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              >
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Notification Tabs */}
        <div className="flex space-x-1 mb-8">
          <Button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 ${
              activeTab === 'all'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All ({notifications.length})
          </Button>
          <Button
            onClick={() => setActiveTab('booking')}
            className={`px-6 py-3 ${
              activeTab === 'booking'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Bookings
          </Button>
          <Button
            onClick={() => setActiveTab('campaign')}
            className={`px-6 py-3 ${
              activeTab === 'campaign'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Campaigns
          </Button>
          <Button
            onClick={() => setActiveTab('message')}
            className={`px-6 py-3 ${
              activeTab === 'message'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Messages
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`bg-gray-800 border-yellow-500/30 p-6 hover:shadow-lg transition-all duration-300 ${
                !notification.read ? 'border-l-4 border-l-yellow-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-gray-300 mb-3">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{notification.timestamp}</span>
                    <Link href={notification.actionUrl}>
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                        onClick={() => markAsRead(notification.id)}
                      >
                        {notification.action}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Notifications</h3>
            <p className="text-gray-300 mb-6">
              {activeTab === 'all' 
                ? 'You\'re all caught up! No new notifications.'
                : `No ${activeTab} notifications yet.`
              }
            </p>
            <Link href="/travelers/dashboard">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

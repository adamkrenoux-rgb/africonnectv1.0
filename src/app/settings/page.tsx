'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Mock user data - in real app, this would come from API/Clerk
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Travel enthusiast exploring Africa',
    country: 'Kenya',
    profilePicture: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailBookings: true,
    emailCampaigns: true,
    emailMessages: true,
    pushNotifications: false,
    marketingEmails: false
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showBookings: true
  })

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, call API to save settings
    // await fetch('/api/users/[id]', { method: 'PATCH', body: JSON.stringify(data) })
    
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '🔐' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'data', label: 'Data & Security', icon: '📊' }
  ]

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
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Dashboard</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-300">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-yellow-500 text-black font-semibold'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700 p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                          {profileData.profilePicture ? (
                            <img src={profileData.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-3xl">👤</span>
                          )}
                        </div>
                        <Button variant="outline" className="border-gray-600 text-gray-300">
                          Change Photo
                        </Button>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-sm text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <select
                        value={profileData.country}
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option>Kenya</option>
                        <option>Tanzania</option>
                        <option>South Africa</option>
                        <option>Morocco</option>
                        <option>Egypt</option>
                        <option>Zambia</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Account Security</h2>
                  
                  <div className="space-y-6">
                    {/* Password Change */}
                    <Card className="bg-gray-700 border-gray-600 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                          Update Password
                        </Button>
                      </div>
                    </Card>

                    {/* Two-Factor Authentication */}
                    <Card className="bg-gray-700 border-gray-600 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-300 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" className="border-gray-500 text-gray-300">
                        Enable 2FA
                      </Button>
                    </Card>

                    {/* Active Sessions */}
                    <Card className="bg-gray-700 border-gray-600 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">Current Device</p>
                            <p className="text-sm text-gray-400">Last active: Just now</p>
                          </div>
                          <span className="text-green-400 text-sm">Active</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <Card className="bg-gray-700 border-gray-600 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailBookings', label: 'Booking Confirmations & Updates' },
                          { key: 'emailCampaigns', label: 'Campaign Applications & Status' },
                          { key: 'emailMessages', label: 'New Messages' },
                          { key: 'marketingEmails', label: 'Marketing & Promotional Emails' }
                        ].map((item) => (
                          <label key={item.key} className="flex items-center justify-between cursor-pointer">
                            <span className="text-gray-300">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked
                              })}
                              className="w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 rounded focus:ring-yellow-500"
                            />
                          </label>
                        ))}
                      </div>
                    </Card>

                    <Card className="bg-gray-700 border-gray-600 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Push Notifications</h3>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-300">Enable Push Notifications</span>
                        <input
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            pushNotifications: e.target.checked
                          })}
                          className="w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 rounded focus:ring-yellow-500"
                        />
                      </label>
                    </Card>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <Card className="bg-gray-700 border-gray-600 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Profile Visibility</h3>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="public">Public - Anyone can see</option>
                        <option value="private">Private - Only connections</option>
                        <option value="hidden">Hidden - Only me</option>
                      </select>
                    </Card>

                    <Card className="bg-gray-700 border-gray-600 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">What Others Can See</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Show Email Address</span>
                          <input
                            type="checkbox"
                            checked={privacySettings.showEmail}
                            onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
                            className="w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 rounded focus:ring-yellow-500"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Show Booking History</span>
                          <input
                            type="checkbox"
                            checked={privacySettings.showBookings}
                            onChange={(e) => setPrivacySettings({...privacySettings, showBookings: e.target.checked})}
                            className="w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 rounded focus:ring-yellow-500"
                          />
                        </label>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Platform Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        <option>English</option>
                        <option>French</option>
                        <option>Portuguese</option>
                        <option>Swahili</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        <option>GMT+3 (East Africa Time)</option>
                        <option>GMT+2 (Central Africa Time)</option>
                        <option>GMT+1 (West Africa Time)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Currency
                      </label>
                      <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>KES (KSh)</option>
                        <option>ZAR (R)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Security Tab */}
              {activeTab === 'data' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Data & Security</h2>
                  
                  <div className="space-y-6">
                    <Card className="bg-gray-700 border-gray-600 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Download Your Data</h3>
                      <p className="text-gray-300 mb-4">
                        Request a copy of all your data including bookings, reviews, and messages
                      </p>
                      <Button variant="outline" className="border-gray-500 text-gray-300">
                        Request Data Export
                      </Button>
                    </Card>

                    <Card className="bg-red-900/20 border-red-800 p-6">
                      <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                      <p className="text-gray-300 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                        Delete Account
                      </Button>
                    </Card>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex items-center justify-between">
                <div>
                  {saved && (
                    <span className="text-green-400 flex items-center gap-2">
                      <span>✓</span>
                      Settings saved successfully
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8"
                >
                  {isSaving ? <LoadingSpinner size="sm" text="Saving..." /> : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')

  // Mock conversations data - in real app this would come from API
  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      type: 'Traveler',
      lastMessage: 'Thank you for the amazing safari experience!',
      timestamp: '2 minutes ago',
      unread: true,
      avatar: 'S',
      messages: [
        {
          id: '1',
          sender: 'Sarah Johnson',
          message: 'Hi! I\'m interested in booking your Maasai Mara Safari',
          timestamp: '2 hours ago',
          isOwn: false
        },
        {
          id: '2',
          sender: 'You',
          message: 'Hello Sarah! I\'d be happy to help you plan your safari. What dates are you looking at?',
          timestamp: '2 hours ago',
          isOwn: true
        },
        {
          id: '3',
          sender: 'Sarah Johnson',
          message: 'We\'re thinking March 15-17, 2024. What\'s included in the package?',
          timestamp: '1 hour ago',
          isOwn: false
        },
        {
          id: '4',
          sender: 'You',
          message: 'Great dates! The package includes 3 days of game drives, accommodation, all meals, and airport transfers. I\'ll send you the detailed itinerary.',
          timestamp: '1 hour ago',
          isOwn: true
        },
        {
          id: '5',
          sender: 'Sarah Johnson',
          message: 'Perfect! I\'d like to book it. How do I proceed with payment?',
          timestamp: '30 minutes ago',
          isOwn: false
        },
        {
          id: '6',
          sender: 'You',
          message: 'I\'ll send you the booking link. Payment is held in escrow until after your trip, so you\'re fully protected.',
          timestamp: '25 minutes ago',
          isOwn: true
        },
        {
          id: '7',
          sender: 'Sarah Johnson',
          message: 'Thank you for the amazing safari experience!',
          timestamp: '2 minutes ago',
          isOwn: false
        }
      ]
    },
    {
      id: '2',
      name: 'TravelWithEmma',
      type: 'Influencer',
      lastMessage: 'I would love to collaborate on your safari tours',
      timestamp: '1 day ago',
      unread: false,
      avatar: 'T',
      messages: [
        {
          id: '1',
          sender: 'TravelWithEmma',
          message: 'Hi! I saw your safari business and would love to collaborate on content creation.',
          timestamp: '2 days ago',
          isOwn: false
        },
        {
          id: '2',
          sender: 'You',
          message: 'Hello Emma! I\'d be interested in hearing more about your collaboration ideas.',
          timestamp: '2 days ago',
          isOwn: true
        },
        {
          id: '3',
          sender: 'TravelWithEmma',
          message: 'I have 125K followers and specialize in wildlife content. I could create 3 Instagram posts and 2 reels showcasing your safari experience.',
          timestamp: '1 day ago',
          isOwn: false
        }
      ]
    },
    {
      id: '3',
      name: 'Mike Chen',
      type: 'Traveler',
      lastMessage: 'I\'m interested in booking your cultural tour.',
      timestamp: '3 days ago',
      unread: false,
      avatar: 'M',
      messages: [
        {
          id: '1',
          sender: 'Mike Chen',
          message: 'Hi! I\'m interested in booking your cultural tour.',
          timestamp: '3 days ago',
          isOwn: false
        }
      ]
    }
  ]

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send the message via API
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Messages</h1>
          <p className="text-xl text-gray-300">Connect and communicate with other users</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-yellow-500/30 h-full">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Conversations</h3>
              </div>
              <div className="overflow-y-auto h-full">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation)}
                    className={`w-full p-4 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 ${
                      activeConversation?.id === conversation.id ? 'bg-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">
                          {conversation.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold truncate">{conversation.name}</h4>
                          <span className="text-gray-400 text-xs">{conversation.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm truncate">{conversation.lastMessage}</p>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {activeConversation ? (
              <Card className="bg-gray-800 border-yellow-500/30 h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold">
                        {activeConversation.avatar}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{activeConversation.name}</h4>
                      <p className="text-gray-400 text-sm">{activeConversation.type}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeConversation.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-yellow-500/30 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Select a Conversation</h3>
                  <p className="text-gray-300">Choose a conversation from the list to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Send, Search, MessageCircle, User } from 'lucide-react'
import { useCurrentUser } from '@/components/UserProvider'

interface Message {
  id: string
  content: string
  read: boolean
  createdAt: string
  sender: {
    id: string
    name: string
    profilePicture?: string
    role: string
  }
  receiver: {
    id: string
    name: string
    profilePicture?: string
    role: string
  }
}

interface Conversation {
  user: {
    id: string
    name: string
    profilePicture?: string
    role: string
  }
  lastMessage?: Message
  unreadCount: number
}

export default function MessagesPage() {
  const { dbUser, isLoaded } = useCurrentUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoaded && dbUser) {
      fetchConversations()
    }
  }, [isLoaded, dbUser])

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation)
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        fetchMessages(activeConversation, false)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()

      if (data.success) {
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (userId: string, markAsRead = true) => {
    try {
      const response = await fetch(`/api/messages?with=${userId}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages || [])
        if (markAsRead) {
          // Refresh conversations to update unread counts
          fetchConversations()
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || isSending) return

    setIsSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: activeConversation,
          content: newMessage.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        setNewMessage('')
        // Add message to local state immediately
        setMessages(prev => [...prev, data.message])
        // Refresh conversations to update last message
        fetchConversations()
      } else {
        alert(data.error || 'Failed to send message')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeUser = activeConversation
    ? conversations.find(c => c.user.id === activeConversation)?.user
    : null

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
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
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/travelers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Travelers</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-yellow-600 transition-colors">For Businesses</Link>
              <Link href="/influencers" className="text-gray-600 hover:text-yellow-600 transition-colors">For Influencers</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/settings">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Settings</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-300">Connect with travelers, businesses, and influencers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 flex flex-col">
            <Card className="bg-gray-800 border-gray-700 flex-1 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-400">Loading conversations...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.user.id}
                      onClick={() => setActiveConversation(conversation.user.id)}
                      className={`w-full p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors text-left ${
                        activeConversation === conversation.user.id ? 'bg-gray-700/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          {conversation.user.profilePicture ? (
                            <Image
                              src={conversation.user.profilePicture}
                              alt={conversation.user.name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-white truncate">{conversation.user.name}</p>
                            {conversation.lastMessage && (
                              <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-gray-400 text-sm truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2 flex flex-col">
            {activeConversation && activeUser ? (
              <Card className="bg-gray-800 border-gray-700 flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    {activeUser.profilePicture ? (
                      <Image
                        src={activeUser.profilePicture}
                        alt={activeUser.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{activeUser.name}</p>
                    <p className="text-gray-400 text-xs">{activeUser.role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.sender.id === dbUser?.id
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                            <div
                              className={`rounded-lg p-3 ${
                                isOwn
                                  ? 'bg-yellow-500 text-black'
                                  : 'bg-gray-700 text-white'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            </div>
                            <p className="text-gray-500 text-xs mt-1 px-2">
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={2}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700 flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a conversation to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

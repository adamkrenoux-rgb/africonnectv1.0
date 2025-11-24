'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LoadingSpinner from '@/components/LoadingSpinner'
import { safeJsonParse } from '@/lib/api-helpers'

interface ChatMessage {
  id: string
  role: 'traveler' | 'assistant'
  content: string
  metadata?: Record<string, any>
  createdAt?: string
}

interface TravelerAIChatAssistantProps {
  locale?: string
}

export function TravelerAIChatAssistant({ locale }: TravelerAIChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm your Africonnect travel concierge. Ask me anything—from safety logistics to hidden cultural gems—and I'll craft suggestions tailored just for you."
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const messageContent = inputValue.trim()
    const userMessage: ChatMessage = {
      id: `${Date.now()}`,
      role: 'traveler',
      content: messageContent,
      createdAt: new Date().toISOString()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/travel-chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          message: messageContent,
          locale
        })
      })

      const data = await safeJsonParse<{
        success: boolean
        sessionId: string
        reply: { id: string; content: string; metadata?: any; createdAt?: string }
        suggestions?: string[]
        provider?: string
        error?: string
      }>(response)

      if (!data || !data.success) {
        const errorMsg = data?.error || 'AI assistant is unavailable right now.'
        console.error('[TravelerAIChatAssistant] API error:', errorMsg, 'Response status:', response.status)
        
        // Provide more helpful error messages
        if (response.status === 401) {
          throw new Error('Please sign in to use the AI concierge.')
        } else if (response.status === 403) {
          throw new Error('AI concierge is only available for travelers.')
        } else if (data?.error?.includes('quota') || data?.error?.includes('billing')) {
          throw new Error('OpenAI API quota exceeded. Please add credits to your OpenAI account.')
        } else if (data?.error?.includes('OpenAI') || data?.error?.includes('API key')) {
          throw new Error('AI service is temporarily unavailable. Please try again later.')
        } else {
          throw new Error(errorMsg)
        }
      }

      console.log('[TravelerAIChatAssistant] Success! Provider:', data.provider, 'Reply length:', data.reply.content.length)

      setSessionId(data.sessionId)
      setMessages((prev) => [
        ...prev,
        {
          id: data.reply.id,
          role: 'assistant',
          content: data.reply.content,
          metadata: data.reply.metadata,
          createdAt: data.reply.createdAt
        }
      ])
    } catch (error: any) {
      console.error('AI chat failed:', error)
      setError(error?.message || 'Unable to reach the AI concierge. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full h-14 w-14 shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
        </Button>
      )}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[520px] bg-slate-900/80 backdrop-blur-xl border-slate-700/70 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-700/70 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-100">
              <MessageCircle className="w-5 h-5 text-yellow-300" />
              <div>
                <p className="text-sm font-semibold">AI Travel Concierge</p>
                <p className="text-xs text-slate-400">Personalized recommendations in seconds</p>
              </div>
            </div>
            <button className="text-slate-300 hover:text-white" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'traveler' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'traveler'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-slate-800/80 text-slate-100 border border-slate-700/70'
                  }`}
                >
                  <p>{message.content}</p>
                  {message.metadata?.suggestions?.length ? (
                    <ul className="mt-2 space-y-1 text-xs text-slate-200/80">
                      {message.metadata.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 text-slate-100 rounded-lg px-3 py-2 text-sm">
                  <LoadingSpinner size="sm" text="Crafting ideas..." />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {error && (
            <div className="px-4 pb-2 text-xs text-amber-300">
              <span>{error}</span>
            </div>
          )}

          <div className="px-4 pb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about permits, logistics, or experiences..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
                className="flex-1 bg-slate-800/80 border border-slate-700/70 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                size="icon"
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}


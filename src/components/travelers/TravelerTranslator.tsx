'use client'

import { useState } from 'react'
import { Languages, Loader2, Volume2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { safeJsonParse } from '@/lib/api-helpers'

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'sw', label: 'Swahili' },
  { code: 'ar', label: 'Arabic' }
]

export function TravelerTranslator() {
  const [content, setContent] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('fr')
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translate = async () => {
    if (!content.trim()) return
    setLoading(true)
    setError(null)
    setTranslatedText(null)
    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, targetLanguage })
      })
      const data = await safeJsonParse<{
        success: boolean
        translation: string
        detectedLanguage?: string
        error?: string
      }>(response)
      if (!data || !data.success) {
        throw new Error(data?.error || 'Translation failed')
      }
      setTranslatedText(data.translation)
    } catch (error: any) {
      console.error('Translation error:', error)
      setError(error?.message || 'Unable to translate message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-900/70 border-slate-700/60 p-5 text-slate-100 space-y-3">
      <div className="flex items-center gap-2">
        <Languages className="w-5 h-5 text-sky-300" />
        <h3 className="text-lg font-semibold text-white">Language Bridge</h3>
      </div>
      <p className="text-xs text-slate-300">
        Craft messages to local hosts in their language. Paste what you want to say and we’ll translate it instantly.
      </p>
      <textarea
        className="w-full h-28 bg-slate-800/80 border border-slate-700/70 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
        placeholder="Write your message..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <label className="text-xs text-slate-300">Translate to</label>
        <select
          value={targetLanguage}
          onChange={(event) => setTargetLanguage(event.target.value)}
          className="bg-slate-800/80 border border-slate-700/70 rounded-md px-3 py-2 text-sm text-slate-100"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option value={option.code} key={option.code} className="text-black">
              {option.label}
            </option>
          ))}
        </select>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-black ml-auto"
          onClick={translate}
          disabled={!content.trim() || loading}
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Translate
        </Button>
      </div>
      {error && <p className="text-xs text-amber-300">{error}</p>}
      {translatedText && (
        <div className="rounded-md border border-slate-700/60 bg-slate-900/60 p-3 text-sm text-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Volume2 className="w-4 h-4 text-emerald-300" />
            Translated Message
          </div>
          <p>{translatedText}</p>
        </div>
      )}
    </Card>
  )
}


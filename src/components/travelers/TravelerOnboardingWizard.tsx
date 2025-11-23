'use client'

import { useEffect, useState } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { safeJsonParse } from '@/lib/api-helpers'

interface WizardAnswer {
  question: string
  answer: string
  category?: string
}

interface WizardStep {
  question: string
  category: string
  helperText?: string
  expectedType?: 'text' | 'number' | 'choice' | 'multi-select'
  suggestedChoices?: string[]
}

interface TravelerOnboardingWizardProps {
  open: boolean
  onClose: () => void
  onCompleted?: (answers: WizardAnswer[]) => void
}

export function TravelerOnboardingWizard({ open, onClose, onCompleted }: TravelerOnboardingWizardProps) {
  const [answers, setAnswers] = useState<WizardAnswer[]>([])
  const [step, setStep] = useState<WizardStep | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setAnswers([])
      setInputValue('')
      loadNextStep([])
    }
  }, [open])

  const loadNextStep = async (currentAnswers: WizardAnswer[]) => {
    setLoading(true)
    setError(null)
    try {
      // Ensure we're sending the answers array correctly
      const payload = { answers: currentAnswers }
      console.log('Loading next step with answers:', currentAnswers.length, 'questions answered')
      
      const response = await fetch('/api/ai/traveler-onboarding', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await safeJsonParse<{ success: boolean; step: WizardStep; error?: string }>(response)
      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to load onboarding step')
      }

      // Validate we got a new question
      if (data.step && data.step.question) {
        console.log('Received new question:', data.step.question.substring(0, 50))
        setStep(data.step)
        setInputValue('')
      } else {
        throw new Error('Invalid step data received')
      }
    } catch (error: any) {
      console.error('Onboarding wizard failed:', error)
      setError(error?.message || 'Unable to load next question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (answerValue: string) => {
    if (!step) return
    const newAnswers = [
      ...answers,
      {
        question: step.question,
        answer: answerValue,
        category: step.category
      }
    ]
    setAnswers(newAnswers)
    setInputValue('')

    if (newAnswers.length >= 5) {
      // Save answers to database
      setLoading(true)
      setError(null)
      try {
        const saveResponse = await fetch('/api/travelers/onboarding', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answers: newAnswers })
        })
        
        const saveData = await safeJsonParse<{ success: boolean; error?: string }>(saveResponse)
        if (!saveData || !saveData.success) {
          console.error('Failed to save onboarding answers:', saveData?.error)
          setError('Failed to save your answers. Please try again.')
          setLoading(false)
          return
        }
        
        // Call completion callback and close
        onCompleted?.(newAnswers)
        onClose()
      } catch (error: any) {
        console.error('Error saving onboarding answers:', error)
        setError('Failed to save your answers. Please try again.')
        setLoading(false)
      }
    } else {
      loadNextStep(newAnswers)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <Card className="w-full max-w-xl bg-slate-900/90 border-slate-700/70 text-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="text-lg font-semibold">Smart Traveler Setup</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-300">
          Answer a few quick questions and we’ll tailor safety tips, experiences, and notifications for you.
        </p>

        {answers.length > 0 && (
          <div className="rounded-md border border-slate-700/60 bg-slate-900/70 p-3 text-xs text-slate-300 space-y-1 max-h-32 overflow-auto">
            {answers.map((item, index) => (
              <div key={index}>
                <strong className="text-slate-200">{index + 1}. {item.question}</strong>
                <p className="text-slate-400">→ {item.answer}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Loader2 className="w-4 h-4 animate-spin" />
            Finding the next best question for you...
          </div>
        ) : step ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-white">{step.question}</p>
              {step.helperText && <p className="text-xs text-slate-400 mt-1">{step.helperText}</p>}
            </div>

            {step.expectedType === 'choice' && step.suggestedChoices?.length ? (
              <div className="grid sm:grid-cols-2 gap-2">
                {step.suggestedChoices.map((choice) => (
                  <button
                    key={choice}
                    className="rounded-md border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 hover:border-yellow-400 hover:text-yellow-200 transition-colors"
                    onClick={() => handleSubmit(choice)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            ) : (
              <form
                className="space-y-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (inputValue.trim()) {
                    handleSubmit(inputValue.trim())
                  }
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/70 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  placeholder="Type your answer..."
                  autoFocus
                />
                <div className="flex justify-end">
                  <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black" disabled={!inputValue.trim()}>
                    Continue
                  </Button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p className="text-sm text-amber-300">We couldn’t load the next question. Please close and try again.</p>
        )}

        {error && <p className="text-xs text-amber-300">{error}</p>}
      </Card>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { aiHelper } from '@/lib/ai-helper'
import LoadingSpinner from '@/components/LoadingSpinner'

interface WizardStep {
  id: string
  title: string
  description: string
  fields: {
    name: string
    type: 'text' | 'select' | 'textarea' | 'number'
    placeholder?: string
    options?: string[]
    required: boolean
  }[]
}

interface AIItineraryWizardProps {
  onComplete: (itinerary: any) => void
  className?: string
}

export default function AIItineraryWizard({ onComplete, className = '' }: AIItineraryWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  const steps: WizardStep[] = [
    {
      id: 'destination',
      title: 'Choose Your Destination',
      description: 'Where would you like to explore in Africa?',
      fields: [
        {
          name: 'destination',
          type: 'select',
          options: ['Tanzania', 'Kenya', 'South Africa', 'Morocco', 'Egypt', 'Ghana', 'Botswana', 'Namibia'],
          required: true
        },
        {
          name: 'region',
          type: 'text',
          placeholder: 'Specific region or city (optional)',
          required: false
        }
      ]
    },
    {
      id: 'timing',
      title: 'When Are You Traveling?',
      description: 'Help us plan the perfect timing for your trip',
      fields: [
        {
          name: 'duration',
          type: 'select',
          options: ['3-5 days', '1 week', '2 weeks', '3 weeks', '1 month+'],
          required: true
        },
        {
          name: 'travelDates',
          type: 'text',
          placeholder: 'e.g., June 2024, December 2024',
          required: true
        },
        {
          name: 'flexibility',
          type: 'select',
          options: ['Very flexible', 'Somewhat flexible', 'Fixed dates'],
          required: true
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Your Travel Style',
      description: 'Tell us what kind of experiences you\'re looking for',
      fields: [
        {
          name: 'interests',
          type: 'select',
          options: ['Wildlife & Safari', 'Culture & History', 'Adventure & Sports', 'Relaxation & Beach', 'Food & Cuisine', 'Photography', 'All of the above'],
          required: true
        },
        {
          name: 'activities',
          type: 'textarea',
          placeholder: 'Specific activities you want to do (e.g., see the Big Five, visit Maasai villages, climb Kilimanjaro)',
          required: false
        },
        {
          name: 'accommodation',
          type: 'select',
          options: ['Luxury lodges', 'Mid-range hotels', 'Budget-friendly', 'Camping', 'Local homestays'],
          required: true
        }
      ]
    },
    {
      id: 'group',
      title: 'Travel Group Details',
      description: 'Help us customize for your group',
      fields: [
        {
          name: 'groupSize',
          type: 'select',
          options: ['Solo traveler', 'Couple', 'Family (3-4)', 'Small group (5-8)', 'Large group (9+)'],
          required: true
        },
        {
          name: 'budget',
          type: 'select',
          options: ['Budget ($500-1000)', 'Mid-range ($1000-3000)', 'Luxury ($3000+)', 'Let me know options'],
          required: true
        },
        {
          name: 'specialRequirements',
          type: 'textarea',
          placeholder: 'Any special requirements or accessibility needs?',
          required: false
        }
      ]
    }
  ]

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      // Get AI suggestions for next step
      if (currentStep === 0 && formData.destination) {
        setIsGenerating(true)
        try {
          const response = await aiHelper.generateResponse({
            prompt: `Based on destination ${formData.destination}, suggest 3 popular regions or cities to visit`,
            maxTokens: 100
          })
          if (response.success) {
            setAiSuggestions(response.data.split('\n').slice(0, 3))
          }
        } catch (error) {
          console.error('AI suggestion error:', error)
        } finally {
          setIsGenerating(false)
        }
      }
      setCurrentStep(prev => prev + 1)
    } else {
      // Generate final itinerary
      await generateItinerary()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const generateItinerary = async () => {
    setIsGenerating(true)
    try {
      const prompt = `Create a detailed itinerary for:
        Destination: ${formData.destination}
        Duration: ${formData.duration}
        Travel dates: ${formData.travelDates}
        Interests: ${formData.interests}
        Group size: ${formData.groupSize}
        Budget: ${formData.budget}
        Activities: ${formData.activities || 'general tourism'}
        Accommodation: ${formData.accommodation}
        Special requirements: ${formData.specialRequirements || 'none'}
        
        Include day-by-day plans, realistic travel times, transport options, and local tips.`

      const response = await aiHelper.generateResponse({
        prompt,
        maxTokens: 1000,
        temperature: 0.7
      })

      if (response.success) {
        onComplete({
          ...formData,
          aiGenerated: response.data,
          source: response.source
        })
      }
    } catch (error) {
      console.error('Itinerary generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const currentStepData = steps[currentStep]
  const isStepComplete = currentStepData.fields.every(field => 
    !field.required || formData[field.name]
  )

  return (
    <Card className={`bg-gray-800 border-gray-700 p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">AI Trip Planner</h2>
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">{currentStepData.title}</h3>
        <p className="text-gray-300">{currentStepData.description}</p>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-400 mb-2">AI Suggestions:</h4>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleInputChange('region', suggestion)}
                className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4 mb-6">
        {currentStepData.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1')}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Previous
        </Button>
        
        {isGenerating ? (
          <LoadingSpinner size="sm" text="Generating itinerary..." />
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isStepComplete}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {currentStep === steps.length - 1 ? 'Generate Itinerary' : 'Next'}
          </Button>
        )}
      </div>
    </Card>
  )
}

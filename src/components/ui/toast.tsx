'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500 border-green-400'
      case 'error':
        return 'bg-red-500 border-red-400'
      case 'warning':
        return 'bg-yellow-500 border-yellow-400'
      case 'info':
        return 'bg-blue-500 border-blue-400'
      default:
        return 'bg-gray-500 border-gray-400'
    }
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        ${getColors()} border rounded-lg shadow-lg p-4
        backdrop-blur-sm bg-opacity-95
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-lg">{getIcon()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-sm text-white opacity-90 mt-1">
                {toast.message}
              </p>
            )}
            {toast.action && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 text-white border-white hover:bg-white hover:text-black"
                onClick={toast.action.onClick}
              >
                {toast.action.label}
              </Button>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

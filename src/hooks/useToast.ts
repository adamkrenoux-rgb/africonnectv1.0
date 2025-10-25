'use client'

import { useState, useCallback } from 'react'
import { Toast } from '@/components/ui/toast'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }, [addToast])

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 8000, // Longer duration for errors
      ...options
    })
  }, [addToast])

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }, [addToast])

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }, [addToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  }
}

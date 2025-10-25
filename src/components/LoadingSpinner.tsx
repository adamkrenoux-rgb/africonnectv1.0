'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  variant?: 'default' | 'dots' | 'pulse'
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  if (variant === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        {text && (
          <p className={`mt-2 ${textSizeClasses[size]} text-gray-300`}>{text}</p>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} bg-yellow-500 rounded-full animate-pulse`}></div>
        {text && (
          <p className={`mt-2 ${textSizeClasses[size]} text-gray-300`}>{text}</p>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-600 border-t-yellow-500 ${sizeClasses[size]}`}></div>
      {text && (
        <p className={`mt-2 ${textSizeClasses[size]} text-gray-300`}>{text}</p>
      )}
    </div>
  )
}


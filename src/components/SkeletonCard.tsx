interface SkeletonCardProps {
  variant?: 'card' | 'list' | 'profile' | 'image'
  className?: string
}

export default function SkeletonCard({ variant = 'card', className = '' }: SkeletonCardProps) {
  const baseClasses = "animate-pulse bg-gray-700 rounded"
  
  if (variant === 'card') {
    return (
      <div className={`${baseClasses} p-6 ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
          <div className="h-3 bg-gray-600 rounded w-5/6"></div>
          <div className="h-3 bg-gray-600 rounded w-2/3"></div>
          <div className="flex space-x-2 mt-4">
            <div className="h-6 bg-gray-600 rounded w-16"></div>
            <div className="h-6 bg-gray-600 rounded w-20"></div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={`${baseClasses} p-4 ${className}`}>
        <div className="flex space-x-4">
          <div className="h-12 w-12 bg-gray-600 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            <div className="h-3 bg-gray-600 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'profile') {
    return (
      <div className={`${baseClasses} p-6 ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gray-600 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-600 rounded w-1/3"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            <div className="h-3 bg-gray-600 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'image') {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className="h-48 bg-gray-600 rounded"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return null
}

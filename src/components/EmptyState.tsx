import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionText: string
  actionHref: string
  secondaryActionText?: string
  secondaryActionHref?: string
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  secondaryActionText,
  secondaryActionHref,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300 mb-8 max-w-md mx-auto">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={actionHref}>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
            {actionText}
          </Button>
        </Link>
        {secondaryActionText && secondaryActionHref && (
          <Link href={secondaryActionHref}>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              {secondaryActionText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
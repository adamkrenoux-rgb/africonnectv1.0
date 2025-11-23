'use client'

import { useMemo } from 'react'
import { Bell, Check, Clock, Compass, LifeBuoy, MessageCircle, Sparkles, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TravelerNotificationsPanelProps {
  notifications: any[]
  onMarkRead: (ids: string[]) => Promise<void>
}

const ICON_MAP: Record<string, React.ReactNode> = {
  SAFETY_ALERT: <TriangleAlert className="w-4 h-4 text-amber-300" />,
  OFFER: <Sparkles className="w-4 h-4 text-pink-300" />,
  MESSAGE: <MessageCircle className="w-4 h-4 text-blue-300" />,
  NEW_TRIP: <Compass className="w-4 h-4 text-emerald-300" />,
  RECOMMENDATION: <LifeBuoy className="w-4 h-4 text-purple-300" />,
  GENERAL: <Bell className="w-4 h-4 text-slate-300" />
}

export function TravelerNotificationsPanel({ notifications, onMarkRead }: TravelerNotificationsPanelProps) {
  const unreadIds = useMemo(
    () => notifications.filter((notification) => !notification.read).map((notification) => notification.id),
    [notifications]
  )

  const markAllRead = () => {
    if (!unreadIds.length) return
    onMarkRead(unreadIds).catch((error) => {
      console.error('Failed to mark notifications as read:', error)
    })
  }

  return (
    <Card className="bg-slate-900/70 border-slate-700/60 p-6 text-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Smart Notifications</h3>
          <p className="text-sm text-slate-300">Stay informed about safety updates, new offers, and trip matches.</p>
        </div>
        <Button
          variant="outline"
          className="border-slate-600 text-slate-200 hover:bg-slate-800/70"
          onClick={markAllRead}
          disabled={!unreadIds.length}
        >
          <Check className="w-4 h-4 mr-2" />
          Mark all read
        </Button>
      </div>

      {notifications.length ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${
                notification.read ? 'border-slate-700/50 bg-slate-900/40' : 'border-yellow-400/30 bg-yellow-500/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{ICON_MAP[notification.notificationType] || ICON_MAP.GENERAL}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">{notification.message}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(notification.sentAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-300">No notifications yet. We’ll keep an eye on updates for you.</p>
      )}
    </Card>
  )
}


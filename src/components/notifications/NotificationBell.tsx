'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}

interface NotificationBellProps {
  locale: string
  initialCount?: number
}

export function NotificationBell({ locale, initialCount = 0 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch {
      // Failed to fetch notifications
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PUT' })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // Failed to mark as read
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT' })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      // Failed to mark all as read
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'sr-Cyrl' || locale === 'sr-Latn' ? 'sr-RS' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative rounded-lg p-2 transition-colors',
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        )}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gov-accent text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="font-semibold text-slate-900">
                {locale === 'sr-Cyrl' ? 'Обавештења' : locale === 'sr-Latn' ? 'Obaveštenja' : 'Notifications'}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gov-primary hover:underline"
                >
                  {locale === 'sr-Cyrl' ? 'Означи све као прочитано' : locale === 'sr-Latn' ? 'Označi sve kao pročitano' : 'Mark all as read'}
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-gov-primary" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  {locale === 'sr-Cyrl' ? 'Нема обавештења' : locale === 'sr-Latn' ? 'Nema obaveštenja' : 'No notifications'}
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    className={cn(
                      'cursor-pointer border-b border-slate-100 px-4 py-3 transition-colors last:border-0',
                      notification.read ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={cn(
                          'text-sm',
                          notification.read ? 'text-slate-700' : 'font-medium text-slate-900'
                        )}>
                          {notification.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gov-accent" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(notification.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

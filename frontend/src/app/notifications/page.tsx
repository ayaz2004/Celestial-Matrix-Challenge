'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ApiService } from '@/services/api'
import { Notification } from '@/types'
import { formatTimeAgo } from '@/lib/utils'
import { Bell, CheckCheck, Loader2, MessageCircle } from 'lucide-react'

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated])

  const fetchNotifications = async () => {
    try {
      setError(null)
      const data = await ApiService.getNotifications()
      
      // Handle both array and paginated response formats
      let notificationsList: Notification[] = []
      
      if (Array.isArray(data)) {
        notificationsList = data
      } else if (data && typeof data === 'object' && 'notifications' in data) {
        notificationsList = (data as { notifications: Notification[] }).notifications
      }
      
      setNotifications(notificationsList)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Failed to load notifications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (!currentStatus) {
        // Mark as read
        await ApiService.markNotificationAsRead(id)
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        )
      }
      // Note: We don't support marking as unread from the backend, 
      // so we only allow marking as read
    } catch (error) {
      console.error('Error updating notification status:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await ApiService.markAllNotificationsAsRead()
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please log in to view your notifications.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading notifications...</span>
        </div>
      </div>
    )
  }

  const unreadNotifications = Array.isArray(notifications) ? notifications.filter(n => !n.isRead) : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadNotifications.length > 0 
                    ? `${unreadNotifications.length} unread notification${unreadNotifications.length > 1 ? 's' : ''}`
                    : 'All caught up!'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {notifications.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mark-all-read"
                    checked={notifications.every(n => n.isRead)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        markAllAsRead()
                      }
                    }}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <label 
                    htmlFor="mark-all-read"
                    className={`text-sm cursor-pointer transition-colors ${
                      notifications.every(n => n.isRead)
                        ? 'text-green-600 font-medium' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => {
                      if (!notifications.every(n => n.isRead)) {
                        markAllAsRead()
                      }
                    }}
                  >
                    {notifications.every(n => n.isRead) ? '✓ All read' : 'Mark all as read'}
                  </label>
                </div>
              )}
              
              {unreadNotifications.length > 0 && (
                <Button onClick={markAllAsRead} variant="outline">
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchNotifications} variant="outline">
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications yet
                </h3>
                <p className="text-gray-500">
                  You&apos;ll be notified when someone replies to your comments.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`transition-all duration-200 ${
                  !notification.isRead 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <MessageCircle className={`h-5 w-5 ${
                        !notification.isRead ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm ${
                            !notification.isRead 
                              ? 'text-gray-900 font-medium' 
                              : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`notification-${notification.id}`}
                              checked={notification.isRead}
                              onCheckedChange={(checked) => {
                                if (checked && !notification.isRead) {
                                  toggleReadStatus(notification.id, notification.isRead)
                                }
                              }}
                              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            <label 
                              htmlFor={`notification-${notification.id}`}
                              className={`text-sm cursor-pointer transition-colors ${
                                notification.isRead 
                                  ? 'text-green-600 font-medium' 
                                  : 'text-gray-600 hover:text-blue-600'
                              }`}
                              onClick={() => {
                                if (!notification.isRead) {
                                  toggleReadStatus(notification.id, notification.isRead)
                                }
                              }}
                            >
                              {notification.isRead ? '✓ Read' : 'Mark as read'}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

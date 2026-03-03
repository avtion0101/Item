import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotificationStore } from '../stores/useNotificationStore'
import { usePetStore } from '../stores/usePetStore'

export function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    subscribeToNotifications, 
    unsubscribeFromNotifications 
  } = useNotificationStore()
  
  const { user } = usePetStore()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchNotifications()
      subscribeToNotifications()
    }
    return () => unsubscribeFromNotifications()
  }, [user])

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 clay-card p-0 z-50 overflow-hidden animate-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-orange-50">
              <h3 className="font-bold text-[var(--color-text-main)]">通知</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-xs text-[var(--color-primary)] hover:underline font-medium"
                >
                  全部已读
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  暂无通知
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.is_read ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notification.is_read ? 'font-bold text-[var(--color-text-main)]' : 'text-gray-600'}`}>
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                        {notification.content}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

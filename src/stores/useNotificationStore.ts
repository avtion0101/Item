import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface Notification {
  id: number
  created_at: string
  user_id: string
  type: 'system' | 'message' | 'adoption_update'
  title: string
  content: string
  is_read: boolean
  link?: string
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  
  fetchNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  subscribeToNotifications: () => void
  unsubscribeFromNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    if (!supabase) return
    set({ isLoading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) {
        set({ 
          notifications: data as Notification[],
          unreadCount: data.filter(n => !n.is_read).length
        })
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  markAsRead: async (id: number) => {
    if (!supabase) return
    try {
      // Optimistic update
      set(state => {
        const newNotifications = state.notifications.map(n => 
          n.id === id ? { ...n, is_read: true } : n
        )
        return {
          notifications: newNotifications,
          unreadCount: newNotifications.filter(n => !n.is_read).length
        }
      })

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Revert if needed (skipped for simplicity)
    }
  },

  markAllAsRead: async () => {
    if (!supabase) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0
      }))

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      
      if (error) throw error
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  },

  subscribeToNotifications: () => {
    if (!supabase) return
    
    // Subscribe to new notifications for current user
    // Note: We need user ID for filter, but subscription filter limitations might require
    // subscribing to all and filtering in callback, OR using RLS-aware realtime (Postgres Changes)
    
    const channel = supabase
      .channel('my-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          // Verify if it belongs to current user (though RLS should handle visibility if enabled on realtime)
          // Ideally, we fetch user ID first.
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user && payload.new.user_id === user.id) {
              set(state => ({
                notifications: [payload.new as Notification, ...state.notifications],
                unreadCount: state.unreadCount + 1
              }))
            }
          })
        }
      )
      .subscribe()
  },

  unsubscribeFromNotifications: () => {
    if (!supabase) return
    supabase.channel('my-notifications').unsubscribe()
  }
}))

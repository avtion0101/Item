import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface Post {
  id: number
  created_at: string
  user_id: string
  title: string
  content: string
  image?: string
  likes_count: number
  comments_count: number
}

export interface ChatMessage {
  id: number
  created_at: string
  user_id: string
  content: string
  user_email?: string
}

export interface PrivateMessage {
  id: number
  created_at: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
}

interface CommunityStore {
  activeTab: 'forum' | 'chat' | 'messages'
  posts: Post[]
  chatMessages: ChatMessage[]
  privateMessages: PrivateMessage[]
  isLoading: boolean
  
  setActiveTab: (tab: 'forum' | 'chat' | 'messages') => void
  
  // Forum Actions
  fetchPosts: () => Promise<void>
  createPost: (post: Omit<Post, 'id' | 'created_at' | 'user_id' | 'likes_count' | 'comments_count'>) => Promise<void>
  
  // Chat Actions
  fetchChatMessages: () => Promise<void>
  sendChatMessage: (content: string, email: string) => Promise<void>
  subscribeToChat: () => void
  unsubscribeFromChat: () => void
  
  // Private Message Actions
  fetchPrivateMessages: () => Promise<void>
  sendPrivateMessage: (receiverId: string, content: string) => Promise<void>
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  activeTab: 'forum',
  posts: [],
  chatMessages: [],
  privateMessages: [],
  isLoading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  // Forum
  fetchPosts: async () => {
    if (!supabase) return
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) set({ posts: data as Post[] })
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  createPost: async (post) => {
    if (!supabase) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('posts')
        .insert({
          ...post,
          user_id: user.id
        })
      
      if (error) throw error
      await get().fetchPosts()
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  // Chat
  fetchChatMessages: async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50) // Last 50 messages
      
      if (error) throw error
      if (data) set({ chatMessages: data as ChatMessage[] })
    } catch (error) {
      console.error('Error fetching chat:', error)
    }
  },

  sendChatMessage: async (content, email) => {
    if (!supabase) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          user_id: user.id,
          user_email: email
        })
      
      if (error) throw error
      // Optimistic update handled by subscription or re-fetch
    } catch (error) {
      console.error('Error sending chat:', error)
      throw error
    }
  },

  subscribeToChat: () => {
    if (!supabase) return
    
    const channel = supabase
      .channel('public-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          set(state => ({
            chatMessages: [...state.chatMessages, payload.new as ChatMessage]
          }))
        }
      )
      .subscribe()
      
    // Store channel reference if needed for cleanup, but for now we just rely on unsubscribe
  },

  unsubscribeFromChat: () => {
    if (!supabase) return
    supabase.channel('public-chat').unsubscribe()
  },

  // Private Messages (Basic implementation)
  fetchPrivateMessages: async () => {
    // This is complex because it involves grouping by user. 
    // For now, let's just fetch all for the current user.
    if (!supabase) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) set({ privateMessages: data as PrivateMessage[] })
    } catch (error) {
      console.error('Error fetching PMs:', error)
    }
  },

  sendPrivateMessage: async (receiverId, content) => {
    if (!supabase) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content
        })
      
      if (error) throw error
      await get().fetchPrivateMessages()
    } catch (error) {
      console.error('Error sending PM:', error)
      throw error
    }
  }
}))

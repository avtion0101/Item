
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Loader2, MessageSquare, Send, Trash2, User as UserIcon } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface Post {
  id: number
  created_at: string
  user_id: string
  user_email: string
  title: string
  content: string
}

interface CommunityProps {
  user: User | null
  onAuthRequired: () => void
}

export function Community({ user, onAuthRequired }: CommunityProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) setPosts(data)
    } catch (err) {
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      onAuthRequired()
      return
    }
    if (!supabase) return

    setIsPosting(true)
    try {
      const { error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        user_email: user.email,
        title,
        content
      })
      if (error) throw error
      setTitle('')
      setContent('')
      fetchPosts()
    } catch (err: any) {
      console.error('Error posting:', err)
      alert(`发布失败：${err.message || '请重试'}`)
    } finally {
      setIsPosting(false)
    }
  }

  const handleDelete = async (postId: number) => {
    if (!supabase || !window.confirm('确定要删除这条内容吗？')) return
    try {
      const { error } = await supabase.from('community_posts').delete().eq('id', postId)
      if (error) throw error
      setPosts(posts.filter(p => p.id !== postId))
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-[var(--color-text-main)] mb-4">宠友交流中心</h2>
        <p className="text-gray-600 font-medium">分享你的养宠心得，获取专业的喂养指南 🧡</p>
      </div>

      {/* Post Form */}
      <div className="clay-card p-6 mb-12 bg-white">
        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-[var(--color-primary)]" />
          发布新话题
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="话题标题"
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none"
          />
          <textarea 
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的心得或指南..."
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none resize-none"
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isPosting}
              className="clay-button px-8 flex items-center gap-2"
            >
              {isPosting ? '发布中...' : <><Send size={18} /> 发布</>}
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 font-bold py-12">暂无交流内容，快来抢沙发吧！</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="clay-card p-6 bg-white hover:bg-orange-50/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full text-[var(--color-primary)]">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{post.user_email}</p>
                    <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {user?.id === post.user_id && (
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <h4 className="text-xl font-black text-[var(--color-text-main)] mb-2">{post.title}</h4>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

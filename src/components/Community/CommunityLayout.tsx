import { useState, useEffect } from 'react'
import { MessageCircle, Users, Mail, Send } from 'lucide-react'
import { useCommunityStore } from '../../stores/useCommunityStore'
import { usePetStore } from '../../stores/usePetStore'
import { ImageUpload } from '../ImageUpload'

export function CommunityLayout() {
  const { activeTab, setActiveTab } = useCommunityStore()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="clay-card p-4 space-y-2 sticky top-24">
            <h3 className="text-xl font-black text-[var(--color-text-main)] mb-4 px-2">交流中心</h3>
            
            <button
              onClick={() => setActiveTab('forum')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'forum'
                  ? 'bg-[var(--color-primary)] text-white shadow-lg'
                  : 'text-gray-500 hover:bg-orange-50'
              }`}
            >
              <MessageCircle size={20} />
              <span>宠友论坛</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-[var(--color-primary)] text-white shadow-lg'
                  : 'text-gray-500 hover:bg-orange-50'
              }`}
            >
              <Users size={20} />
              <span>实时聊天室</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'messages'
                  ? 'bg-[var(--color-primary)] text-white shadow-lg'
                  : 'text-gray-500 hover:bg-orange-50'
              }`}
            >
              <Mail size={20} />
              <span>我的私信</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-[600px]">
          {activeTab === 'forum' && <Forum />}
          {activeTab === 'chat' && <ChatRoom />}
          {activeTab === 'messages' && <PrivateMessages />}
        </div>
      </div>
    </div>
  )
}

function Forum() {
  const { posts, fetchPosts, createPost, isLoading } = useCommunityStore()
  const { user } = usePetStore()
  const [showCreate, setShowCreate] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', image: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    try {
      await createPost(newPost)
      setNewPost({ title: '', content: '', image: '' })
      setShowCreate(false)
    } catch (error) {
      alert('发布失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-[var(--color-text-main)]">最新话题</h2>
        {user && (
          <button 
            onClick={() => setShowCreate(!showCreate)}
            className="clay-button px-6 py-2 text-sm"
          >
            {showCreate ? '取消发布' : '发布新帖'}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="clay-card p-6 mb-8 animate-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="标题"
              required
              value={newPost.title}
              onChange={e => setNewPost({...newPost, title: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none"
            />
            <textarea
              placeholder="分享你的宠物趣事..."
              required
              value={newPost.content}
              onChange={e => setNewPost({...newPost, content: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none h-32 resize-none"
            />
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">添加图片 (可选)</label>
              <ImageUpload 
                onUploadComplete={url => setNewPost({...newPost, image: url})}
                initialImage={newPost.image}
              />
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              className="clay-button w-full"
            >
              {submitting ? '发布中...' : '发布帖子'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">暂无帖子，快来抢沙发！</div>
      ) : (
        <div className="grid gap-6">
          {posts.map(post => (
            <div key={post.id} className="clay-card p-6 hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[var(--color-text-main)]">{post.title}</h3>
                <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>
              {post.image && (
                <img src={post.image} alt="Post" className="rounded-xl max-h-64 object-cover mb-4" />
              )}
              <div className="flex gap-4 text-sm text-gray-400">
                <span>❤️ {post.likes_count}</span>
                <span>💬 {post.comments_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ChatRoom() {
  const { chatMessages, fetchChatMessages, sendChatMessage, subscribeToChat, unsubscribeFromChat } = useCommunityStore()
  const { user } = usePetStore()
  const [input, setInput] = useState('')

  useEffect(() => {
    fetchChatMessages()
    subscribeToChat()
    return () => unsubscribeFromChat()
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user) return
    
    try {
      await sendChatMessage(input, user.email || 'Anonymous')
      setInput('')
    } catch (error) {
      alert('发送失败')
    }
  }

  if (!user) {
    return (
      <div className="clay-card p-8 text-center">
        <h3 className="text-xl font-bold mb-4">请先登录</h3>
        <p className="text-gray-500">加入聊天室需要先登录账号。</p>
      </div>
    )
  }

  return (
    <div className="clay-card h-[600px] flex flex-col p-0 overflow-hidden">
      <div className="bg-orange-50 p-4 border-b border-orange-100">
        <h3 className="font-bold text-[var(--color-text-main)]">🐶 萌宠交流大厅 ({chatMessages.length} 条消息)</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {chatMessages.map(msg => {
          const isMe = msg.user_id === user.id
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-400 mb-1 px-2">{msg.user_email?.split('@')[0]}</span>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                isMe 
                  ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="说点什么..."
          className="flex-1 px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <button 
          type="submit"
          className="bg-[var(--color-primary)] text-white p-2 rounded-xl hover:bg-orange-600 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

function PrivateMessages() {
  const { privateMessages, fetchPrivateMessages } = useCommunityStore()
  const { user } = usePetStore()

  useEffect(() => {
    fetchPrivateMessages()
  }, [])

  if (!user) {
    return (
      <div className="clay-card p-8 text-center">
        <h3 className="text-xl font-bold mb-4">请先登录</h3>
        <p className="text-gray-500">查看私信需要先登录账号。</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-[var(--color-text-main)]">我的私信</h2>
      
      {privateMessages.length === 0 ? (
        <div className="clay-card p-8 text-center text-gray-400">
          暂无消息
        </div>
      ) : (
        <div className="space-y-4">
          {privateMessages.map(msg => (
            <div key={msg.id} className="clay-card p-4 flex gap-4 items-start">
              <div className={`p-2 rounded-full ${msg.sender_id === user.id ? 'bg-orange-100' : 'bg-blue-100'}`}>
                <Mail size={20} className={msg.sender_id === user.id ? 'text-orange-500' : 'text-blue-500'} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm">
                    {msg.sender_id === user.id ? '我' : '对方'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center text-xs text-gray-400 mt-8">
        * 私信功能目前仅支持查看历史记录，发起聊天请在宠物详情页点击“联系送养人” (开发中)
      </div>
    </div>
  )
}

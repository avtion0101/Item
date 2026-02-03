
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Modal } from './Modal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError('请先配置 Supabase 环境变量')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onClose() // 登录成功关闭弹窗
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setSuccess('注册成功！请检查邮箱完成验证，然后登录。')
        setIsLogin(true) // 注册后切换到登录界面
        setPassword('') // 清空密码
      }
    } catch (err: any) {
      setError(err.message || '发生错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isLogin ? '欢迎回来' : '加入我们'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="text-green-600 text-sm font-bold bg-green-50 p-3 rounded-lg border border-green-100">
            {success}
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">邮箱</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">密码</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="clay-button w-full flex justify-center items-center gap-2"
        >
          {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
        </button>

        <div className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[var(--color-primary)] font-bold ml-1 hover:underline cursor-pointer"
          >
            {isLogin ? '去注册' : '去登录'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

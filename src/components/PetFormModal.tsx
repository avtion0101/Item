
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Modal } from './Modal'
import type { Pet } from '../mockData'
import type { User } from '@supabase/supabase-js'

interface PetFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  pet?: Pet | null
  user: User | null
}

export function PetFormModal({ isOpen, onClose, onSuccess, pet, user }: PetFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    type: '狗狗' as '狗狗' | '猫咪' | '小兔',
    breed: '',
    age: '',
    image: '',
    description: '',
    tags: '',
    contact: ''
  })

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        image: pet.image,
        description: pet.description,
        tags: pet.tags.join(', '),
        contact: pet.contact || ''
      })
    } else {
      setFormData({
        name: '',
        type: '狗狗',
        breed: '',
        age: '',
        image: '',
        description: '',
        tags: '',
        contact: ''
      })
    }
  }, [pet, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabase) return

    setLoading(true)
    setError(null)

    const petData = {
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      age: formData.age,
      image: formData.image,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      contact: formData.contact,
      owner_id: user.id
    }

    try {
      if (pet) {
        const { error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', pet.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('pets')
          .insert(petData)
        if (error) throw error
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || '保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={pet ? '编辑宠物信息' : '发布宠物领养'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">宠物名称</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none"
              placeholder="如：贝拉"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">宠物类型</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none bg-white"
            >
              <option value="狗狗">狗狗</option>
              <option value="猫咪">猫咪</option>
              <option value="小兔">小兔</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">品种</label>
            <input 
              required
              value={formData.breed}
              onChange={(e) => setFormData({...formData, breed: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none"
              placeholder="如：金毛寻回犬"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">年龄</label>
            <input 
              required
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none"
              placeholder="如：2 岁"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">图片链接</label>
          <input 
            required
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">描述</label>
          <textarea 
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none resize-none"
            placeholder="描述一下宠物性格和故事..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">标签 (用逗号分隔)</label>
          <input 
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none"
            placeholder="如：友好, 活泼, 已打疫苗"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">联系方式</label>
          <input 
            required
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none"
            placeholder="电话或微信号"
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
          className="clay-button w-full py-3"
        >
          {loading ? '保存中...' : (pet ? '更新信息' : '立即发布')}
        </button>
      </form>
    </Modal>
  )
}

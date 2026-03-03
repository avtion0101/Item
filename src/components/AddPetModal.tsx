import { useState } from 'react'
import { Modal } from './Modal'
import { ImageUpload } from './ImageUpload'
import { supabase } from '../lib/supabase'
import { usePetStore } from '../stores/usePetStore'

interface AddPetModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPetModal({ isOpen, onClose }: AddPetModalProps) {
  const { user, addPet } = usePetStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '狗狗' as '狗狗' | '猫咪' | '小兔',
    breed: '',
    age: '',
    description: '',
    image: '',
    tags: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    try {
      // If we had a real backend, we would call addPet here
      // Use store action
      await addPet({
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        owner_id: user.id
      } as any) // Type assertion as mockData Pet doesn't strictly match Supabase schema 100% yet
      
      onClose()
      // Reset form
      setFormData({
        name: '',
        type: '狗狗',
        breed: '',
        age: '',
        description: '',
        image: '',
        tags: ''
      })
      alert('发布成功！')
    } catch (error) {
      console.error('Error adding pet:', error)
      alert('发布失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="发布领养信息">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">宠物照片</label>
          <ImageUpload 
            onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))}
            initialImage={formData.image}
          />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">名字</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors"
              placeholder="例如: 旺财"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">种类</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors"
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
              type="text"
              required
              value={formData.breed}
              onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors"
              placeholder="例如: 金毛"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">年龄</label>
            <input
              type="text"
              required
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors"
              placeholder="例如: 2 岁"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">描述</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors h-24 resize-none"
            placeholder="描述一下它的性格和习性..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">标签 (用逗号分隔)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors"
            placeholder="例如: 粘人, 安静, 已绝育"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formData.image}
          className="clay-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '发布中...' : '发布信息'}
        </button>
      </form>
    </Modal>
  )
}

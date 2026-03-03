
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Modal } from './Modal'
import { LazyImage } from './LazyImage'
import { HealthRecords } from './HealthRecords'
import type { Pet } from '../mockData'
import type { User } from '@supabase/supabase-js'

interface AdoptionModalProps {
  isOpen: boolean
  onClose: () => void
  pet: Pet | null
  user: User | null
}

export function AdoptionModal({ isOpen, onClose, pet, user }: AdoptionModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'health'>('info')
  const [message, setMessage] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !user || !pet) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          pet_id: pet.id,
          message,
          contact_info: contactInfo,
          status: 'pending'
        })
      
      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('提交申请失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (!pet) return null

  const isOwner = user?.id === (pet as any).owner_id

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={pet.name}
    >
      <div className="flex gap-4 mb-6 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-2 font-bold transition-colors relative ${
            activeTab === 'info' 
              ? 'text-[var(--color-primary)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--color-primary)]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          领养申请
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`pb-2 font-bold transition-colors relative ${
            activeTab === 'health' 
              ? 'text-[var(--color-primary)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--color-primary)]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          健康档案
        </button>
      </div>

      {activeTab === 'health' ? (
        <HealthRecords petId={pet.id} isOwner={isOwner} />
      ) : (
        success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h4 className="text-xl font-black text-[var(--color-primary)] mb-2">申请已提交！</h4>
            <p className="text-gray-600">工作人员会尽快通过您留下的联系方式与您确认。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-xl flex gap-4 items-center mb-4">
              <LazyImage src={pet.image} alt={pet.name} className="w-16 h-16 rounded-lg" />
              <div>
                <p className="font-bold text-[var(--color-text-main)]">{pet.name}</p>
                <p className="text-sm text-gray-500">{pet.breed} • {pet.age}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">联系方式 (手机/微信)</label>
              <input 
                type="text" 
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors"
                placeholder="请填写您的联系方式"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">给领养中心的留言</label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-[var(--color-primary)] outline-none transition-colors h-32 resize-none"
                placeholder="请简单介绍一下您的家庭环境和养宠经验..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="clay-button w-full"
            >
              {loading ? '提交中...' : '确认申请'}
            </button>
          </form>
        )
      )}
    </Modal>
  )
}

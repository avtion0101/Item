import { useEffect, useState } from 'react'
import { Activity, Calendar, Syringe, Stethoscope, FileText, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface HealthRecord {
  id: number
  record_date: string
  type: 'vaccine' | 'checkup' | 'surgery' | 'other'
  title: string
  description: string
  vet_name: string
  next_due_date?: string
}

interface HealthRecordsProps {
  petId: number
  isOwner?: boolean
}

export function HealthRecords({ petId, isOwner = false }: HealthRecordsProps) {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [showAdd, setShowAdd] = useState(false)
  const [newRecord, setNewRecord] = useState({
    type: 'vaccine',
    title: '',
    description: '',
    record_date: new Date().toISOString().split('T')[0],
    vet_name: '',
    next_due_date: ''
  })

  useEffect(() => {
    fetchRecords()
  }, [petId])

  const fetchRecords = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('pet_id', petId)
        .order('record_date', { ascending: false })
      
      if (error) throw error
      if (data) setRecords(data as HealthRecord[])
    } catch (error) {
      console.error('Error fetching health records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    
    try {
      const { error } = await supabase
        .from('health_records')
        .insert({
          pet_id: petId,
          ...newRecord,
          next_due_date: newRecord.next_due_date || null
        })
      
      if (error) throw error
      
      setShowAdd(false)
      setNewRecord({
        type: 'vaccine',
        title: '',
        description: '',
        record_date: new Date().toISOString().split('T')[0],
        vet_name: '',
        next_due_date: ''
      })
      fetchRecords()
    } catch (error) {
      alert('添加记录失败')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccine': return <Syringe size={18} className="text-blue-500" />
      case 'checkup': return <Stethoscope size={18} className="text-green-500" />
      case 'surgery': return <Activity size={18} className="text-red-500" />
      default: return <FileText size={18} className="text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vaccine': return '疫苗接种'
      case 'checkup': return '常规体检'
      case 'surgery': return '手术治疗'
      default: return '其他记录'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-[var(--color-primary)]" />
          健康档案
        </h3>
        {isOwner && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs flex items-center gap-1 bg-orange-50 text-[var(--color-primary)] px-2 py-1 rounded-lg font-bold hover:bg-orange-100"
          >
            <Plus size={14} />
            添加记录
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleAddRecord} className="clay-card p-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <select
              value={newRecord.type}
              onChange={e => setNewRecord({...newRecord, type: e.target.value})}
              className="p-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="vaccine">疫苗接种</option>
              <option value="checkup">常规体检</option>
              <option value="surgery">手术治疗</option>
              <option value="other">其他记录</option>
            </select>
            <input
              type="date"
              value={newRecord.record_date}
              onChange={e => setNewRecord({...newRecord, record_date: e.target.value})}
              className="p-2 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="记录标题 (如: 狂犬疫苗)"
            required
            value={newRecord.title}
            onChange={e => setNewRecord({...newRecord, title: e.target.value})}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm"
          />
          <textarea
            placeholder="详细描述..."
            value={newRecord.description}
            onChange={e => setNewRecord({...newRecord, description: e.target.value})}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm h-16 resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="兽医/医院"
              value={newRecord.vet_name}
              onChange={e => setNewRecord({...newRecord, vet_name: e.target.value})}
              className="p-2 rounded-lg border border-gray-200 text-sm"
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 mb-1">下次复查 (可选)</span>
              <input
                type="date"
                value={newRecord.next_due_date}
                onChange={e => setNewRecord({...newRecord, next_due_date: e.target.value})}
                className="p-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg text-sm font-bold">
            保存记录
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-4 text-sm">加载中...</div>
      ) : records.length === 0 ? (
        <div className="text-center text-gray-400 py-4 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
          暂无健康记录
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {records.map(record => (
            <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {getTypeIcon(record.type)}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 text-sm">{record.title}</div>
                  <time className="font-caveat font-medium text-indigo-500 text-xs">{record.record_date}</time>
                </div>
                <div className="text-slate-500 text-xs mb-2">{getTypeLabel(record.type)}</div>
                {record.description && (
                  <div className="text-slate-500 text-xs mb-2 bg-slate-50 p-2 rounded">
                    {record.description}
                  </div>
                )}
                <div className="flex items-center gap-4 text-[10px] text-gray-400">
                  {record.vet_name && (
                    <span className="flex items-center gap-1">
                      <Stethoscope size={12} /> {record.vet_name}
                    </span>
                  )}
                  {record.next_due_date && (
                    <span className="flex items-center gap-1 text-orange-500 font-medium">
                      <Calendar size={12} /> 复查: {record.next_due_date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

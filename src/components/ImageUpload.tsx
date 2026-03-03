import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  initialImage?: string
}

export function ImageUpload({ onUploadComplete, initialImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    
    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    
    // Upload to Supabase
    if (supabase) {
      setUploading(true)
      try {
        // Check auth session first
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('请先登录后再上传图片')
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`
        
        console.log('Starting upload to pet-images:', filePath)
        
        const { error: uploadError } = await supabase.storage
          .from('pet-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
          
        if (uploadError) {
          console.error('Supabase upload error details:', uploadError)
          throw uploadError
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('pet-images')
          .getPublicUrl(filePath)
          
        onUploadComplete(publicUrl)
      } catch (error: any) {
        console.error('Error uploading image:', error)
        // Show detailed error message
        const errorMsg = error.message || '未知错误'
        alert(`图片上传失败: ${errorMsg}\n请检查控制台(Console)获取更多详情。`)
        setPreview(null)
      } finally {
        setUploading(false)
      }
    } else {
      // Mock mode: just use object URL
      onUploadComplete(objectUrl)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-orange-100 group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors cursor-pointer"
              title="更换图片"
            >
              <Upload size={20} />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors cursor-pointer"
              title="移除图片"
            >
              <X size={20} />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col gap-2 text-white">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-sm font-bold">上传中...</span>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-orange-50 transition-all cursor-pointer group"
        >
          <div className="p-4 bg-orange-50 rounded-full text-orange-300 group-hover:text-[var(--color-primary)] transition-colors">
            <ImageIcon size={32} />
          </div>
          <p className="font-bold">点击上传宠物照片</p>
          <p className="text-xs text-gray-400">支持 JPG, PNG, WEBP (最大 5MB)</p>
        </button>
      )}
    </div>
  )
}

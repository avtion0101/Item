
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Content */}
      <div className="clay-card relative w-full max-w-md p-6 animate-in zoom-in-95 duration-200 z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-[var(--color-text-main)]">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-orange-100 rounded-full transition-colors text-gray-500 hover:text-[var(--color-primary)] cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

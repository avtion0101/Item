import { useState } from 'react'
import { Modal } from './Modal'
import { Heart, Gift, QrCode, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

type PaymentMethod = 'wechat' | 'alipay'

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat')

  const handleDonate = () => {
    setStep(2)
    // Simulate order creation and QR code generation
    setTimeout(() => {
      setStep(3) // Show QR Code
    }, 1000)
  }

  const handlePaymentComplete = () => {
    setStep(4) // Show Success
  }

  // Mock payment URL - in real app this comes from backend
  const paymentUrl = `https://pet-haven.com/pay?method=${paymentMethod}&amount=${amount || customAmount}`

  const resetModal = () => {
    onClose()
    setStep(1)
    setAmount(null)
    setCustomAmount('')
    setPaymentMethod('wechat')
  }

  return (
    <Modal isOpen={isOpen} onClose={resetModal} title="支持我们的工作">
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-block p-4 bg-red-50 rounded-full text-red-500 mb-4">
              <Heart size={48} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">您的爱心，改变它们的命运</h3>
            <p className="text-gray-600 text-sm">
              所有的捐款将直接用于流浪动物的医疗救助、食物供给和庇护所维护。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[10, 50, 100].map((val) => (
              <button
                key={val}
                onClick={() => { setAmount(val); setCustomAmount('') }}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  amount === val
                    ? 'border-[var(--color-primary)] bg-orange-50 text-[var(--color-primary)]'
                    : 'border-gray-100 hover:border-orange-200'
                }`}
              >
                ¥{val}
                <div className="text-xs font-normal text-gray-400 mt-1">
                  {val === 10 ? '一顿美餐' : val === 50 ? '疫苗接种' : '绝育手术'}
                </div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">自定义金额</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">¥</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(null) }}
                className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] outline-none font-bold"
                placeholder="任意金额"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">支付方式</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('wechat')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'wechat'
                    ? 'border-[#07C160] bg-[#07C160]/10 text-[#07C160]'
                    : 'border-gray-100 hover:border-gray-200 text-gray-600'
                }`}
              >
                <div className="w-5 h-5 bg-[#07C160] rounded-full flex items-center justify-center text-white text-xs">
                  <Check size={12} className={paymentMethod === 'wechat' ? 'opacity-100' : 'opacity-0'} />
                </div>
                <span className="font-bold">微信支付</span>
              </button>

              <button
                onClick={() => setPaymentMethod('alipay')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'alipay'
                    ? 'border-[#1677FF] bg-[#1677FF]/10 text-[#1677FF]'
                    : 'border-gray-100 hover:border-gray-200 text-gray-600'
                }`}
              >
                <div className="w-5 h-5 bg-[#1677FF] rounded-full flex items-center justify-center text-white text-xs">
                  <Check size={12} className={paymentMethod === 'alipay' ? 'opacity-100' : 'opacity-0'} />
                </div>
                <span className="font-bold">支付宝</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleDonate}
            disabled={!amount && !customAmount}
            className="clay-button w-full py-4 text-lg"
          >
            立即捐赠
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="py-12 text-center space-y-4">
          <div className="animate-spin text-[var(--color-primary)] mx-auto">
            <Gift size={48} />
          </div>
          <p className="font-bold text-gray-600">正在创建订单...</p>
        </div>
      )}

      {step === 3 && (
        <div className="py-6 text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-500">支付金额</p>
            <p className="text-4xl font-black text-[var(--color-text-main)]">
              ¥{amount || customAmount}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
              <QRCodeSVG value={paymentUrl} size={180} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${
              paymentMethod === 'wechat' ? 'bg-[#07C160]' : 'bg-[#1677FF]'
            }`}>
              <QrCode size={14} />
            </div>
            <span>请使用{paymentMethod === 'wechat' ? '微信' : '支付宝'}扫一扫</span>
          </div>

          {/* Simulate Payment Success for Demo */}
          <button
            onClick={handlePaymentComplete}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            (模拟支付成功)
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="py-8 text-center space-y-6">
          <div className="text-6xl animate-bounce">🙏</div>
          <div>
            <h3 className="text-2xl font-black text-[var(--color-text-main)] mb-2">感谢您的支持！</h3>
            <p className="text-gray-600">
              您捐赠的 ¥{amount || customAmount} 将帮助更多毛孩子找到温暖的家。
            </p>
          </div>
          <button
            onClick={resetModal}
            className="clay-button w-full"
          >
            完成
          </button>
        </div>
      )}
    </Modal>
  )
}

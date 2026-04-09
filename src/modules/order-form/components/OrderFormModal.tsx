import { useState, useEffect } from 'react'
import type { OrderFormData, OrderFormStep1, OrderFormStep2, OrderFormStep3 } from '../types/order-form.types'
import Step1BasicInfo from './Step1BasicInfo'
import Step2ProductType from './Step2ProductType'
import Step3Brief from './Step3Brief'
import Step4Confirm from './Step4Confirm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import { useCurrentUser } from '../../../shared/hooks/useCurrentUser'

interface Props {
  open: boolean
  onClose: () => void
}

const STEPS = [
  { label: 'Thông tin',      emoji: '👤' },
  { label: 'Loại sản phẩm',  emoji: '🎨' },
  { label: 'Nội dung brief', emoji: '✍️' },
  { label: 'Xác nhận gửi',   emoji: '🚀' },
]

const STEP_SUBTITLES = [
  'Cho chúng mình biết về dự án của bạn nhé!',
  'Bạn cần thiết kế loại gì?',
  'Mô tả phong cách để designer hiểu ý bạn 💡',
  'Kiểm tra lại một lần nữa trước khi gửi nhé!',
]

const EMPTY: OrderFormData = {
  draft_order_id: crypto.randomUUID(),
  step1: { orderer_name: '', team_id: '', task_name: '', deadline: '', is_urgent: false },
  step2: { product_type_id: '', product_type_name: '', product_size_name: '' },
  step3: { brief_text: '', style_reference: '', primary_colors: [], media_cloudflare_uids: [], moodboard_id: null, style_description: '' },
}

export default function OrderFormModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<OrderFormData>({ ...EMPTY, draft_order_id: crypto.randomUUID() })
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { data: user } = useCurrentUser()
  const qc = useQueryClient()
  const DEV = import.meta.env.VITE_DEV_BYPASS === 'true'

  const { data: productTypes = [] } = useQuery({
    queryKey: ['product-types'],
    queryFn: () => apiClient.get<{ id: string; name: string; slug: string; standard_sizes: { name: string; width: number; height: number; unit: 'px'|'mm' }[] }[]>('/api/v1/meta/product-types'),
  })

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => apiClient.get<{ id: string; name: string; slug: string }[]>('/api/v1/meta/teams'),
  })

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        step1: { ...f.step1, orderer_name: user.display_name, team_id: user.team?.id ?? '' },
      }))
    }
  }, [user])

  const submitMutation = useMutation({
    mutationFn: () => apiClient.post<{ order_number: string }>('/api/v1/orders', {
      ...form.step1, ...form.step2, ...form.step3,
      draft_order_id: form.draft_order_id,
      moodboard_id: form.step3.moodboard_id,
    }),
    onSuccess: (res) => {
      setOrderNumber(res.order_number)
      setSubmitted(true)
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (err: { code?: string; message?: string }) => {
      setError(err?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.')
    },
  })

  const upd1 = (d: Partial<OrderFormStep1>) => setForm(f => ({ ...f, step1: { ...f.step1, ...d } }))
  const upd2 = (d: Partial<OrderFormStep2>) => setForm(f => ({ ...f, step2: { ...f.step2, ...d } }))
  const upd3 = (d: Partial<OrderFormStep3>) => setForm(f => ({ ...f, step3: { ...f.step3, ...d } }))

  const canNext = () => {
    if (step === 0) return !!form.step1.task_name.trim() && !!form.step1.team_id && !!form.step1.deadline
    if (step === 1) return !!form.step2.product_type_id && !!form.step2.product_size_name
    if (step === 2) return form.step3.brief_text.length >= 10 && (DEV || !!form.step3.moodboard_id)
    return true
  }

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
    else { setError(null); submitMutation.mutate() }
  }

  const handleClose = () => {
    setStep(0); setSubmitted(false); setError(null)
    setForm({ ...EMPTY, draft_order_id: crypto.randomUUID() })
    onClose()
  }

  const teamName = teams.find(t => t.id === form.step1.team_id)?.name ?? ''

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-[rgba(45,45,58,0.5)] z-[80] flex items-start justify-center px-4 py-6 overflow-y-auto backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl w-full max-w-[600px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25)] my-auto">

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#F0EFF8]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7B8EF7] to-[#6C6BAE] flex items-center justify-center">
                  <svg className="w-3 h-3 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <span className="text-[15px] font-bold tracking-tight text-[#2D2D3A]">
                  {submitted ? 'Gửi thành công!' : 'Yêu cầu thiết kế mới'}
                </span>
              </div>
              {!submitted && (
                <p className="text-[11px] text-[#A89EC0] ml-8">{STEP_SUBTITLES[step]}</p>
              )}
            </div>
            <button onClick={handleClose}
              className="w-7 h-7 rounded-full border border-[#E4E0EF] flex items-center justify-center text-[#A89EC0] hover:bg-[#F2F0F7] hover:text-[#2D2D3A] transition-all shrink-0">
              <svg className="w-3 h-3 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          {!submitted && (
            <div className="h-[3px] bg-[#F2F0F7] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / 4) * 100}%`, background: 'linear-gradient(90deg, #7B8EF7, #6C6BAE)' }}/>
            </div>
          )}
        </div>

        {/* Step indicator */}
        {!submitted && (
          <div className="flex px-6 py-2 border-b border-[#F0EFF8] gap-0 overflow-x-auto">
            {STEPS.map((s, i) => (
              <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap shrink-0 transition-all
                ${i === step ? 'bg-[#EEF0FE] text-[#7B8EF7]' : i < step ? 'text-[#5BB89A]' : 'text-[#C4BEDD]'}`}>
                <div className={`w-[16px] h-[16px] rounded-full border-[1.5px] flex items-center justify-center text-[7px] font-bold shrink-0 transition-all
                  ${i === step ? 'bg-[#7B8EF7] border-[#7B8EF7] text-white'
                    : i < step ? 'bg-[#5BB89A] border-[#5BB89A] text-white'
                    : 'border-[#C4BEDD] text-[#C4BEDD]'}`}>
                  {i < step ? '✓' : s.emoji}
                </div>
                {s.label}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        {submitted ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            {/* Success animation */}
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B8EF7] to-[#5BB89A] flex items-center justify-center shadow-[0_8px_24px_rgba(123,142,247,0.35)]">
                <svg className="w-7 h-7 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 text-lg">🎉</div>
            </div>
            <h3 className="text-[19px] font-bold tracking-tight text-[#2D2D3A] mb-1">
              Yêu cầu đã được gửi!
            </h3>
            <p className="text-[12px] text-[#6E6488] leading-relaxed max-w-[280px] mb-1">
              Design team đã nhận được yêu cầu của bạn và sẽ liên hệ xác nhận brief sớm nhất có thể.
            </p>
            <p className="text-[11px] text-[#A89EC0]">Thường trong vòng 2–4 giờ làm việc ⏰</p>
            <div className="mt-4 text-[11px] text-[#7B8EF7] px-4 py-2 rounded-xl border border-[rgba(123,142,247,0.25)] bg-[#EEF0FE] font-bold font-mono tracking-wider">
              {orderNumber}
            </div>
            <p className="text-[9px] text-[#A89EC0] mt-1.5">Mã yêu cầu của bạn — dùng để theo dõi tiến độ</p>
            <button onClick={handleClose}
              className="mt-5 px-6 py-2.5 bg-gradient-to-r from-[#7B8EF7] to-[#6C6BAE] text-white rounded-xl text-[13px] font-bold
                hover:shadow-[0_4px_14px_rgba(123,142,247,0.4)] hover:-translate-y-0.5 transition-all">
              ✦ Gửi yêu cầu mới
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 max-h-[58vh] overflow-y-auto">
            {step === 0 && <Step1BasicInfo data={form.step1} onChange={upd1} teams={teams} currentUserName={user?.display_name ?? ''} />}
            {step === 1 && <Step2ProductType data={form.step2} onChange={upd2} productTypes={productTypes} />}
            {step === 2 && <Step3Brief data={form.step3} onChange={upd3} draftOrderId={form.draft_order_id} />}
            {step === 3 && <Step4Confirm data={form} teamName={teamName} />}
          </div>
        )}

        {/* Footer */}
        {!submitted && (
          <div className="flex gap-2 px-6 py-3.5 border-t border-[#F0EFF8] bg-[#FAFAFA]">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="px-4 h-10 bg-white border-[1.5px] border-[#E4E0EF] rounded-xl text-[12px] font-bold text-[#6E6488]
                  hover:border-[#A89EC0] hover:text-[#2D2D3A] transition-all">
                ← Quay lại
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canNext() || submitMutation.isPending}
              className="flex-1 h-10 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2
                bg-gradient-to-r from-[#7B8EF7] to-[#6C6BAE]
                hover:shadow-[0_4px_14px_rgba(123,142,247,0.4)] hover:-translate-y-[1px]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none
                transition-all active:translate-y-0"
            >
              {submitMutation.isPending ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Đang gửi đến design team...</>
              ) : step === 3 ? (
                <>🚀 Gửi đến Design Team</>
              ) : (
                <>Tiếp theo
                  <svg className="w-3.5 h-3.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-6 mb-3 px-3.5 py-2.5 bg-[#FFF5F5] border border-[#FECACA] rounded-xl text-[11px] text-[#E07A7A] flex items-center gap-2">
            <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2 shrink-0" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

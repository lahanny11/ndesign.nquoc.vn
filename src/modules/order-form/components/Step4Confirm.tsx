import type { OrderFormData } from '../types/order-form.types'

interface Props {
  data: OrderFormData
  teamName: string
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 px-3 py-2.5 border-b border-[#F2F0F7] last:border-b-0 text-[12px]">
      <span className="text-[#A89EC0] min-w-[88px] font-semibold shrink-0">{label}</span>
      <span className="text-[#2D2D3A] font-bold flex-1">{value}</span>
    </div>
  )
}

export default function Step4Confirm({ data, teamName }: Props) {
  const { step1, step2, step3 } = data

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] text-[#A89EC0]">Kiểm tra lại thông tin trước khi gửi order.</p>

      <div className="border-[1.5px] border-[#E4E0EF] rounded-[11px] overflow-hidden">
        <div className="px-3 py-2 bg-[#FAF9FC] border-b border-[#E4E0EF]">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0]">Thông tin cơ bản</span>
        </div>
        <Row label="Người order" value={step1.orderer_name} />
        <Row label="Team" value={teamName} />
        <Row label="Tên task" value={step1.task_name} />
        <Row label="Deadline" value={new Date(step1.deadline).toLocaleDateString('vi-VN')} />
        <Row label="Độ ưu tiên" value={step1.is_urgent
          ? <span className="text-[#E07A7A] font-bold">⚡ Gấp</span>
          : <span className="text-[#A89EC0]">Bình thường</span>
        } />
      </div>

      <div className="border-[1.5px] border-[#E4E0EF] rounded-[11px] overflow-hidden">
        <div className="px-3 py-2 bg-[#FAF9FC] border-b border-[#E4E0EF]">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0]">Sản phẩm</span>
        </div>
        <Row label="Loại" value={step2.product_type_name} />
        <Row label="Kích thước" value={step2.product_size_name} />
      </div>

      <div className="border-[1.5px] border-[#E4E0EF] rounded-[11px] overflow-hidden">
        <div className="px-3 py-2 bg-[#FAF9FC] border-b border-[#E4E0EF]">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0]">Brief & Style</span>
        </div>
        <Row label="Brief" value={
          <span className="line-clamp-3 text-[11px] leading-relaxed font-normal text-[#6E6488]">
            {step3.brief_text || '—'}
          </span>
        } />
        <Row label="Style" value={step3.style_reference || '—'} />
        {step3.primary_colors.length > 0 && (
          <Row label="Màu" value={
            <div className="flex gap-1">
              {step3.primary_colors.map(c => (
                <div key={c} className="w-5 h-5 rounded" style={{ background: c }}/>
              ))}
            </div>
          } />
        )}
        <Row label="Moodboard" value={
          step3.moodboard_id
            ? <span className="text-[#5BB89A]">✓ Đã chọn</span>
            : <span className="text-[#E07A7A]">⚠ Chưa có</span>
        } />
      </div>
    </div>
  )
}

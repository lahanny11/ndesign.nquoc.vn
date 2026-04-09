import type { OrderFormData } from '../types/order-form.types'

interface Props {
  data: OrderFormData
  teamName: string
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="border-[1.5px] border-[#E4E0EF] rounded-xl overflow-hidden">
      <div className="px-3.5 py-2.5 bg-[#F8F7FD] border-b border-[#E4E0EF] flex items-center gap-1.5">
        <span className="text-sm">{emoji}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8B82C4]">{title}</span>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3 px-3.5 py-2.5 border-b border-[#F2F0F7] last:border-b-0">
      <span className="text-[10px] text-[#A89EC0] min-w-[90px] font-semibold shrink-0 pt-0.5">{label}</span>
      <span className="text-[11px] text-[#2D2D3A] font-semibold flex-1">{value}</span>
    </div>
  )
}

export default function Step4Confirm({ data, teamName }: Props) {
  const { step1, step2, step3 } = data

  return (
    <div className="flex flex-col gap-3">
      {/* Reassurance banner */}
      <div className="bg-gradient-to-r from-[#EEF0FE] to-[#F0F7FF] rounded-xl px-4 py-3 border border-[rgba(123,142,247,0.2)]">
        <p className="text-[11px] font-bold text-[#7B8EF7]">🚀 Sắp xong rồi!</p>
        <p className="text-[10px] text-[#8B82C4] mt-0.5">
          Xem lại thông tin lần cuối — sau khi gửi, design team sẽ liên hệ bạn để xác nhận trong 2–4 giờ làm việc.
        </p>
      </div>

      <Section title="Thông tin cơ bản" emoji="👤">
        <Row label="Người gửi" value={step1.orderer_name} />
        <Row label="Team" value={teamName} />
        <Row label="Tên dự án" value={step1.task_name} />
        <Row label="Deadline" value={step1.deadline ? new Date(step1.deadline).toLocaleDateString('vi-VN') : '—'} />
        <Row label="Độ ưu tiên" value={
          step1.is_urgent
            ? <span className="text-[#E07A7A] font-bold">⚡ Gấp — designer sẽ nhận trước</span>
            : <span className="text-[#6E6488]">Bình thường</span>
        } />
      </Section>

      <Section title="Loại sản phẩm" emoji="🎨">
        <Row label="Nhóm" value={step2.product_type_name || '—'} />
        <Row label="Kích thước" value={step2.product_size_name || '—'} />
      </Section>

      <Section title="Brief & Phong cách" emoji="✍️">
        <Row label="Mô tả brief" value={
          <span className="text-[10px] leading-relaxed font-normal text-[#6E6488] whitespace-pre-wrap line-clamp-4">
            {step3.brief_text || '—'}
          </span>
        } />
        {step3.style_reference && <Row label="Style tham khảo" value={step3.style_reference} />}
        {step3.primary_colors.length > 0 && (
          <Row label="Màu chủ đạo" value={
            <div className="flex gap-1.5">
              {step3.primary_colors.map(c => (
                <div key={c} title={c} className="w-5 h-5 rounded-md shadow-sm border border-white/50" style={{ background: c }}/>
              ))}
            </div>
          } />
        )}
        <Row label="Moodboard AI" value={
          step3.moodboard_id
            ? <span className="text-[#5BB89A] font-bold">✓ Đã phân tích phong cách</span>
            : <span className="text-[#A89EC0]">Chưa phân tích (tuỳ chọn)</span>
        } />
      </Section>

      {/* Trust signal */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F8FDF9] rounded-xl border border-[#D4EDDA]">
        <span className="text-base">💜</span>
        <p className="text-[10px] text-[#5B8E70] leading-relaxed">
          <strong>Design team cam kết:</strong> Phản hồi trong 2–4 giờ làm việc, và làm đúng yêu cầu của bạn!
        </p>
      </div>
    </div>
  )
}

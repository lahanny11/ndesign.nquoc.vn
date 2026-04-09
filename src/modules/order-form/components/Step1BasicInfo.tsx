import type { OrderFormStep1 } from '../types/order-form.types'

interface Team { id: string; name: string; slug: string }

interface Props {
  data: OrderFormStep1
  onChange: (data: Partial<OrderFormStep1>) => void
  teams: Team[]
  currentUserName: string
}

const inputCls = `w-full bg-[#FAFAF9] border-[1.5px] border-[#E4E0EF] rounded-xl px-3.5 py-2.5
  text-[13px] text-[#2D2D3A] font-[inherit] outline-none transition-all
  focus:border-[#7B8EF7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,142,247,0.08)]`

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0]">{children}</label>
      {hint && <p className="text-[9px] text-[#C4BEDD] mt-0.5">{hint}</p>}
    </div>
  )
}

export default function Step1BasicInfo({ data, onChange, teams, currentUserName }: Props) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome note */}
      <div className="bg-gradient-to-r from-[#EEF0FE] to-[#F0F4FF] rounded-xl px-3.5 py-3 border border-[rgba(123,142,247,0.15)]">
        <p className="text-[11px] font-semibold text-[#7B8EF7]">👋 Chào {currentUserName || 'bạn'}!</p>
        <p className="text-[10px] text-[#8B82C4] mt-0.5">
          Điền thông tin để design team hiểu đúng yêu cầu của bạn nhé. Càng rõ càng nhanh! ⚡
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label hint="Tự động điền từ tài khoản của bạn">Người gửi yêu cầu</Label>
          <input type="text" value={currentUserName} readOnly
            className={`${inputCls} opacity-60 cursor-not-allowed`} />
        </div>
        <div>
          <Label hint="Team nào đang cần thiết kế?">Team của bạn</Label>
          <select value={data.team_id} onChange={e => onChange({ team_id: e.target.value })}
            className={inputCls}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9' fill='none' stroke='%23bbb' stroke-width='2'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 30, appearance: 'none' }}>
            <option value="">Chọn team của bạn...</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label hint="Tên cụ thể giúp designer hiểu ngay mục đích của dự án">Tên dự án / Task</Label>
        <input type="text" value={data.task_name}
          onChange={e => onChange({ task_name: e.target.value })}
          placeholder="VD: Banner Tết 2026 cho fanpage Admin Nhile..."
          className={inputCls} maxLength={200} />
        <div className="flex items-center justify-between mt-1">
          <p className="text-[9px] text-[#C4BEDD]">Đặt tên rõ ràng = designer hiểu đúng ngay từ đầu 🎯</p>
          <p className="text-[9px] text-[#A89EC0]">{data.task_name.length}/200</p>
        </div>
      </div>

      <div>
        <Label hint="Designer sẽ ưu tiên dựa theo deadline này">Deadline mong muốn</Label>
        <input type="date" value={data.deadline} min={today}
          onChange={e => onChange({ deadline: e.target.value })}
          className={inputCls} />
        {data.deadline && (
          <p className="text-[9px] text-[#5BB89A] mt-1 font-medium">
            ✓ Design team sẽ cố gắng hoàn thành trước ngày này!
          </p>
        )}
      </div>

      {/* Urgent toggle */}
      <div onClick={() => onChange({ is_urgent: !data.is_urgent })}
        className={`flex items-center justify-between p-3.5 rounded-xl border-[1.5px] cursor-pointer transition-all
          ${data.is_urgent ? 'border-[#F2BEBE] bg-[#FDF5F5]' : 'border-[#E4E0EF] hover:border-[#C4BEDD]'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
            ${data.is_urgent ? 'bg-[#FCEAEA]' : 'bg-[#F2F0F7]'}`}>
            <span className="text-base">{data.is_urgent ? '⚡' : '🕐'}</span>
          </div>
          <div>
            <div className="text-[12px] font-bold text-[#2D2D3A]">
              {data.is_urgent ? 'Yêu cầu gấp — đã bật ⚡' : 'Đây có phải yêu cầu gấp không?'}
            </div>
            <div className="text-[9px] text-[#A89EC0] mt-0.5">
              {data.is_urgent
                ? 'Designer sẽ ưu tiên nhận task của bạn trước'
                : 'Bật nếu bạn cần giao sớm hơn deadline thông thường'}
            </div>
          </div>
        </div>
        <div className={`w-[36px] h-[20px] rounded-full relative transition-colors shrink-0
          ${data.is_urgent ? 'bg-[#E07A7A]' : 'bg-[#CEC9E0]'}`}>
          <div className={`absolute w-[16px] h-[16px] bg-white rounded-full top-0.5 shadow transition-transform
            ${data.is_urgent ? 'translate-x-[16px]' : 'translate-x-[2px]'}`}/>
        </div>
      </div>
    </div>
  )
}

import type { OrderFormStep1 } from '../types/order-form.types'

interface Team { id: string; name: string; slug: string }

interface Props {
  data: OrderFormStep1
  onChange: (data: Partial<OrderFormStep1>) => void
  teams: Team[]
  currentUserName: string
}

const inputCls = `w-full bg-[#FAF9FC] border-[1.5px] border-[#E4E0EF] rounded-[10px] px-3 py-2.5
  text-[13px] text-[#2D2D3A] font-[inherit] outline-none transition-all
  focus:border-[#7B8EF7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,142,247,0.08)]`

export default function Step1BasicInfo({ data, onChange, teams, currentUserName }: Props) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
            Người order
          </label>
          <input
            type="text"
            value={currentUserName}
            readOnly
            className={`${inputCls} opacity-60 cursor-not-allowed`}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
            Team
          </label>
          <select
            value={data.team_id}
            onChange={e => onChange({ team_id: e.target.value })}
            className={inputCls}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9' fill='none' stroke='%23bbb' stroke-width='2'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 11px center', paddingRight: 28, appearance: 'none' }}
          >
            <option value="">Chọn team...</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
          Tên task
        </label>
        <input
          type="text"
          value={data.task_name}
          onChange={e => onChange({ task_name: e.target.value })}
          placeholder="VD: Thumbnail YouTube series tháng 4..."
          className={inputCls}
          maxLength={200}
        />
        <p className="text-[10px] text-[#A89EC0] mt-1">{data.task_name.length}/200</p>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
          Deadline
        </label>
        <input
          type="date"
          value={data.deadline}
          min={today}
          onChange={e => onChange({ deadline: e.target.value })}
          className={inputCls}
        />
      </div>

      {/* Urgent toggle */}
      <div
        onClick={() => onChange({ is_urgent: !data.is_urgent })}
        className={`flex items-center justify-between p-3 rounded-[11px] border-[1.5px] cursor-pointer transition-all
          ${data.is_urgent ? 'border-[#F2BEBE] bg-[#FDF5F5]' : 'border-[#E4E0EF]'}`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center transition-all
            ${data.is_urgent ? 'bg-[#FCEAEA]' : 'bg-[#F2F0F7]'}`}>
            <svg className={`w-[13px] h-[13px] fill-none stroke-2 ${data.is_urgent ? 'stroke-[#D97070]' : 'stroke-[#A89EC0]'}`} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#2D2D3A]">Task gấp</div>
            <div className="text-[10px] text-[#A89EC0] mt-0.5">Ưu tiên designer nhận ngay lập tức</div>
          </div>
        </div>
        {/* iOS-style toggle */}
        <div className={`w-[34px] h-[19px] rounded-[10px] relative transition-colors shrink-0
          ${data.is_urgent ? 'bg-[#7BCBA8]' : 'bg-[#CEC9E0]'}`}>
          <div className={`absolute w-[15px] h-[15px] bg-white rounded-full top-0.5 shadow-sm transition-transform
            ${data.is_urgent ? 'translate-x-[15px]' : 'translate-x-0.5'}`}/>
        </div>
      </div>
    </div>
  )
}

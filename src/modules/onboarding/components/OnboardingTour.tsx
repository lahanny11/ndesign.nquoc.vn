import { useState } from 'react'

interface Props {
  userName: string
  onDismiss: () => void
}

const STEPS = [
  {
    icon: '📋',
    title: 'Nhận task từ pool',
    color: '#5E5CE6',
    desc: 'Vào tab "Chờ nhận" — đây là pool các order chưa có designer. Đọc kỹ brief trước khi nhấn "+ Nhận task". Capacity tối đa 7 task đang chạy cùng lúc.',
    tip: 'Nếu brief không rõ, hỏi lại orderer ngay — đừng đoán.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {['Bộ Avatar Nhân viên mới Q2', 'Thumbnail Youtube Series mới'].map((name, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: '#F5F5F7', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>{name}</p>
              <p style={{ fontSize: 10, color: '#AEAEB2', margin: '2px 0 0' }}>Chưa assign · Social Media</p>
            </div>
            <div style={{ padding: '5px 12px', borderRadius: 20, background: '#1D1D1F', color: '#fff', fontSize: 11, fontWeight: 600 }}>+ Nhận task</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '📖',
    title: 'Đọc brief & Checklist nhận task',
    color: '#FF9F0A',
    desc: 'Sau khi nhận, mở Tracking Panel → bước "Designer nhận task". Tick từng checklist item: brief đầy đủ, deadline rõ, confirm phong cách với orderer. Blocking items phải pass trước khi bắt đầu làm.',
    tip: 'Checklist không phải thủ tục — mỗi item là một sai lầm thật từ kinh nghiệm đội.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { label: 'Brief đính kèm và đầy đủ', done: true },
          { label: 'Deadline được xác nhận', done: true },
          { label: 'Double-check brief với orderer', done: false },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 9, background: item.done ? 'rgba(22,163,74,0.06)' : 'rgba(0,0,0,0.03)', border: `1px solid ${item.done ? 'rgba(22,163,74,0.2)' : 'rgba(0,0,0,0.08)'}` }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: item.done ? '#16A34A' : '#fff', border: item.done ? 'none' : '1.5px solid rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <span style={{ fontSize: 12, color: item.done ? '#3D3D3F' : '#1D1D1F' }}>{item.label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '⏱',
    title: 'Check-in mỗi 5 ngày',
    color: '#34C759',
    desc: 'Trong lúc đang làm, nhấn "Check-in tiến độ" tối thiểu mỗi 5 ngày. Hệ thống tự đặt cờ nếu quá 5 ngày không có check-in — đây là tín hiệu để Leader can thiệp. Không cần report dài, chỉ cần 1 click.',
    tip: 'Check-in sớm = Leader biết bạn đang làm. Không check-in = Leader lo, hỏi, mất thời gian 2 chiều.',
    visual: (
      <div style={{ padding: '12px 14px', borderRadius: 12, background: '#F5F5F7', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F' }}>Ảnh Quote Motivation Daily</span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(52,199,89,0.1)', color: '#16A34A', fontWeight: 600 }}>Đang làm</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, padding: '8px 12px', borderRadius: 9, background: '#fff', border: '1px solid rgba(52,199,89,0.25)', textAlign: 'center', cursor: 'pointer' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', margin: 0 }}>Check-in tiến độ</p>
            <p style={{ fontSize: 10, color: '#AEAEB2', margin: '2px 0 0' }}>Reset bộ đếm 5 ngày</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: '🎯',
    title: 'Giao sản phẩm đúng chuẩn',
    color: '#FF3B30',
    desc: 'Khi xong, check lại checklist "Giao sản phẩm lần đầu" trước khi bấm "Giao sản phẩm". Phải là bản hoàn thiện (không phải draft), đúng kích thước, có source file. Nếu orderer gửi feedback, bắt đầu revision round — hệ thống tự đếm.',
    tip: 'Revision round 2 → cờ vàng. Round 3+ → cờ đỏ và Leader sẽ vào cuộc. Hãy làm đúng ngay từ đầu.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: 'Round 1', color: '#AEAEB2', fill: false },
            { label: 'Round 2', color: '#FF9F0A', fill: true },
            { label: 'Round 3', color: '#E11D48', fill: true },
          ].map((r, i) => (
            <div key={i} style={{ flex: 1, padding: '8px', borderRadius: 9, background: r.fill ? `${r.color}12` : '#F5F5F7', border: `1px solid ${r.fill ? r.color + '30' : 'rgba(0,0,0,0.08)'}`, textAlign: 'center' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: r.color, margin: 0 }}>{r.label}</p>
              <p style={{ fontSize: 9, color: r.fill ? r.color : '#AEAEB2', margin: '2px 0 0' }}>{i === 0 ? 'Bình thường' : i === 1 ? '⚠ Cảnh báo' : '🚨 Cờ đỏ'}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: '✅',
    title: 'Hoàn thành & Bàn giao',
    color: '#16A34A',
    desc: 'Orderer xác nhận xong → order chuyển "Done". Đây là lúc tick checklist "Hoàn thành & Bàn giao": orderer hài lòng, đủ file xuất, source file được lưu trữ. Capacity của bạn tự giảm xuống khi order done.',
    tip: 'Mỗi order done là dữ liệu thật — revision rounds, deadline, chất lượng — Leader xem để đánh giá bạn.',
    visual: (
      <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(22,163,74,0.05)', border: '1.5px solid rgba(22,163,74,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#16A34A', margin: 0 }}>Order Hoàn thành!</p>
            <p style={{ fontSize: 11, color: '#6E6E73', margin: '2px 0 0' }}>Poster Tuyển dụng IT · 1 revision · Sớm 2 ngày</p>
          </div>
        </div>
      </div>
    ),
  },
]

export default function OnboardingTour({ userName, onDismiss }: Props) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
    >
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(0,0,0,0.06)' }}>
          <div style={{
            height: '100%', background: current.color,
            width: `${((step + 1) / STEPS.length) * 100}%`,
            transition: 'width 0.4s ease, background 0.4s ease',
            borderRadius: '0 3px 3px 0',
          }}/>
        </div>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${current.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {current.icon}
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#AEAEB2', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Bước {step + 1} / {STEPS.length}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1D1D1F', margin: '1px 0 0', letterSpacing: '-0.02em' }}>
                  {current.title}
                </p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', fontSize: 13, color: '#6E6E73', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >×</button>
          </div>

          {/* Welcome message only on step 0 */}
          {step === 0 && (
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: `${current.color}08`, border: `1px solid ${current.color}20` }}>
              <p style={{ fontSize: 13, color: '#1D1D1F', margin: 0 }}>
                Chào <strong>{userName}</strong>! Bạn vừa hoàn thành training. Đây là hướng dẫn nhanh 5 bước để làm việc hiệu quả trong N-Design.
              </p>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', flex: 1, overflow: 'auto' }}>
          {/* Description */}
          <p style={{ fontSize: 13, color: '#3D3D3F', lineHeight: 1.65, margin: '0 0 16px' }}>
            {current.desc}
          </p>

          {/* Visual demo */}
          <div style={{ marginBottom: 16 }}>{current.visual}</div>

          {/* Tip box */}
          <div style={{ padding: '10px 14px', borderRadius: 10, background: `${current.color}08`, border: `1px solid ${current.color}20`, display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: 12, color: '#3D3D3F', margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: current.color }}>Lưu ý:</strong> {current.tip}
            </p>
          </div>
        </div>

        {/* Step dots + nav */}
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: 5, flex: 1 }}>
            {STEPS.map((_s, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: i === step ? 20 : 6, height: 6, borderRadius: 99, cursor: 'pointer',
                  background: i <= step ? current.color : 'rgba(0,0,0,0.12)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ padding: '0 16px', height: 40, borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: 'rgba(0,0,0,0.07)', color: '#1D1D1F' }}
              >
                ← Trước
              </button>
            )}
            <button
              onClick={() => isLast ? onDismiss() : setStep(s => s + 1)}
              style={{
                padding: '0 20px', height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, color: '#fff',
                background: current.color,
                boxShadow: `0 4px 12px ${current.color}40`,
                transition: 'all 0.2s',
              }}
            >
              {isLast ? '✓ Bắt đầu làm việc' : 'Tiếp →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

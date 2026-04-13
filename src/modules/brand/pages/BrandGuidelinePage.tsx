'use client'

import AppLayout from '@/shared/layouts/AppLayout'

const BRAND_COLORS = [
  { hex: '#1B3A6B', name: 'Navy — Primary',    usage: 'Header, title, accent chính' },
  { hex: '#2E86AB', name: 'Blue — Accent',      usage: 'Subheading, buttons, links' },
  { hex: '#00838F', name: 'Teal',               usage: 'N-EDU, special sections' },
  { hex: '#E07B39', name: 'Gold — Highlight',   usage: 'Tags, badges, CTA' },
  { hex: '#2E7D32', name: 'Green — Pass',       usage: 'KPI tốt, milestone' },
  { hex: '#C62828', name: 'Red — Warning',      usage: 'KPI tệ, lỗi' },
  { hex: '#EBF4F8', name: 'Light BG',           usage: 'Row alt, info boxes', light: true },
]

const TYPOGRAPHY = [
  { name: 'Playfair Display', role: 'Headlines / Tiêu đề lớn', weight: '700 · 800', sample: 'NhiLe Holdings', serif: true },
  { name: 'Inter',            role: 'Body / UI text',           weight: '400 · 500 · 600', sample: 'Nội dung chính', serif: false },
]

const DO_LIST  = ['Yen_T100', 'Linh_BannerEvent', 'Trang_Carousel07']
const DONT_LIST = ['design_1.png', 'banner copy', 'Untitled']

const LOGO_RULES = [
  'Luôn dùng logo trắng trên nền tối (Navy, Black)',
  'Luôn dùng logo màu đầy đủ trên nền sáng',
  'Không stretch / distort logo',
  'Vùng bảo vệ tối thiểu = chiều cao chữ "N" ở mỗi cạnh',
  'Không đặt logo trên nền bận (busy background)',
]

export default function BrandGuidelinePage() {
  return (
    <AppLayout activeNav="brand" title="Brand Guideline">
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Page header */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1D1D1F', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Brand Guideline
          </h1>
          <p style={{ fontSize: 13, color: '#6E6E73', margin: 0 }}>
            Màu sắc & chuẩn nhận diện NhiLe Holding · Áp dụng bắt buộc cho mọi output
          </p>
        </div>

        {/* ── Bảng màu chính thức ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', margin: '0 0 18px', letterSpacing: '-0.01em' }}>
            Bảng màu chính thức
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
            {BRAND_COLORS.map(c => (
              <div key={c.hex}>
                <div
                  style={{
                    height: 72, borderRadius: 12, marginBottom: 8,
                    background: c.hex,
                    border: c.light ? '1px solid #D1E9F3' : 'none',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                />
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: '0 0 2px' }}>{c.name}</p>
                <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#6E6E73', margin: '0 0 2px' }}>{c.hex}</p>
                <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0, lineHeight: 1.4 }}>{c.usage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Typography ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', margin: '0 0 18px', letterSpacing: '-0.01em' }}>
            Typography
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TYPOGRAPHY.map(t => (
              <div key={t.name} style={{
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '14px 18px', borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.07)', background: '#FAFAFA',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {t.role}
                  </p>
                  <p style={{
                    fontSize: 22, fontWeight: 700, color: '#1D1D1F', margin: '0 0 2px',
                    fontFamily: t.serif ? 'Georgia, serif' : 'inherit',
                  }}>
                    {t.sample}
                  </p>
                  <p style={{ fontSize: 11, color: '#AEAEB2', margin: 0 }}>{t.name} · Weight {t.weight}</p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                  background: 'rgba(0,0,0,0.05)', color: '#6E6E73', flexShrink: 0,
                }}>
                  {t.serif ? 'Serif' : 'Sans-serif'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quy tắc đặt tên file ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Quy tắc đặt tên file Canva
          </h2>
          <div style={{ background: '#F5F5F7', borderRadius: 10, padding: '10px 16px', marginBottom: 14, fontFamily: 'monospace', fontSize: 14 }}>
            <span style={{ color: '#2563EB', fontWeight: 700 }}>Tên_TaskName</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div style={{ background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.15)', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', margin: '0 0 8px' }}>✅ Đúng</p>
              {DO_LIST.map(s => (
                <p key={s} style={{ fontSize: 11, fontFamily: 'monospace', color: '#3A3A3C', margin: '3px 0' }}>{s}</p>
              ))}
            </div>
            <div style={{ background: 'rgba(225,29,72,0.05)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#E11D48', margin: '0 0 8px' }}>❌ Sai</p>
              {DONT_LIST.map(s => (
                <p key={s} style={{ fontSize: 11, fontFamily: 'monospace', color: '#3A3A3C', margin: '3px 0' }}>{s}</p>
              ))}
            </div>
            <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', margin: '0 0 8px' }}>📌 Lưu ý</p>
              <p style={{ fontSize: 11, color: '#3A3A3C', lineHeight: 1.6, margin: 0 }}>
                <strong>Tên</strong> = Designer phụ trách.<br/>
                <strong>TaskName</strong> = nội dung ngắn gọn, viết liền không dấu
              </p>
            </div>
          </div>
        </div>

        {/* ── Quy tắc dùng Logo ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Quy tắc sử dụng Logo
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOGO_RULES.map((rule, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: '#F5F5F7' }}>
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#1B3A6B',
                  color: '#fff', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: 13, color: '#3A3A3C', margin: 0, lineHeight: 1.5 }}>{rule}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}

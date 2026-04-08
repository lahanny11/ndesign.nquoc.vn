import type { OrderFormStep2, ProductType } from '../types/order-form.types'

interface Props {
  data: OrderFormStep2
  onChange: (data: Partial<OrderFormStep2>) => void
  productTypes: ProductType[]
}

const TYPE_ICONS: Record<string, string> = {
  'social-media': '📱',
  'linkedin': '💼',
  'youtube': '▶️',
  'print': '🖨️',
  'email': '📧',
  'custom': '✏️',
}

const TYPE_COLORS: Record<string, string> = {
  'social-media': 'from-[#C4A8D4] to-[#B89CC8]',
  'linkedin':     'from-[#A8B8F4] to-[#8FA6EF]',
  'youtube':      'from-[#F4B08A] to-[#E8925A]',
  'print':        'from-[#8FAAC4] to-[#7A98B8]',
  'email':        'from-[#F5E6C8] to-[#D4A853]',
  'custom':       'from-[#EEF0FE] to-[#DDE0FC]',
}

export default function Step2ProductType({ data, onChange, productTypes }: Props) {
  const selected = productTypes.find(t => t.id === data.product_type_id)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-2">
          Chọn loại sản phẩm
        </label>

        {/* Product type grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {productTypes.map(pt => {
            const isActive = data.product_type_id === pt.id
            const gradient = TYPE_COLORS[pt.slug] ?? 'from-[#F2F0F7] to-[#E4E0EF]'
            return (
              <button
                key={pt.id}
                onClick={() => onChange({ product_type_id: pt.id, product_type_name: pt.name, product_size_name: '' })}
                className={`border-[1.5px] rounded-[10px] overflow-hidden cursor-pointer transition-all text-left
                  ${isActive
                    ? 'border-[#7B8EF7] shadow-[0_0_0_3px_rgba(123,142,247,0.1)]'
                    : 'border-[#E4E0EF] hover:border-[#7B8EF7] hover:-translate-y-0.5 hover:shadow-md'
                  }`}
              >
                <div className={`h-12 bg-gradient-to-br ${gradient} flex items-center justify-center text-xl`}>
                  {TYPE_ICONS[pt.slug] ?? '📄'}
                </div>
                <div className="px-2 py-1.5 border-t border-[#F2F0F7]">
                  <div className="text-[11px] font-bold text-[#2D2D3A]">{pt.name}</div>
                  <div className="text-[9px] text-[#A89EC0] mt-0.5">
                    {pt.standard_sizes.length > 0 ? `${pt.standard_sizes.length} kích thước` : 'Tuỳ chỉnh'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Size selection */}
        {selected && selected.standard_sizes.length > 0 && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-2">
              Chọn kích thước — {selected.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {selected.standard_sizes.map(sz => {
                const isSelected = data.product_size_name === sz.name
                return (
                  <button
                    key={sz.name}
                    onClick={() => onChange({ product_size_name: sz.name })}
                    className={`px-3 py-2 rounded-[9px] border-[1.5px] text-left transition-all
                      ${isSelected
                        ? 'border-[#7B8EF7] bg-[#EEF0FE] shadow-[0_0_0_2px_rgba(123,142,247,0.15)]'
                        : 'border-[#E4E0EF] hover:border-[#7B8EF7] bg-white'
                      }`}
                  >
                    <div className="text-[11px] font-bold text-[#2D2D3A]">{sz.name}</div>
                    {sz.width && (
                      <div className="text-[9px] text-[#7B8EF7] font-bold mt-0.5 font-mono">
                        {sz.width} × {sz.height} {sz.unit}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Custom size */}
        {selected?.slug === 'custom' && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
              Tên/mô tả kích thước
            </label>
            <input
              type="text"
              value={data.product_size_name}
              onChange={e => onChange({ product_size_name: e.target.value })}
              placeholder="VD: 1920×1080px, A4 ngang..."
              className="w-full bg-[#FAF9FC] border-[1.5px] border-[#E4E0EF] rounded-[10px] px-3 py-2.5 text-[13px] text-[#2D2D3A] outline-none transition-all focus:border-[#7B8EF7] focus:bg-white"
            />
          </div>
        )}

        {/* Selected banner */}
        {data.product_type_id && data.product_size_name && (
          <div className="flex items-center gap-1.5 mt-3 px-3 py-2 bg-[#EEF0FE] border border-[rgba(123,142,247,0.2)] rounded-[8px] text-[12px] text-[#7B8EF7] font-semibold">
            <svg className="w-3 h-3 stroke-[#7B8EF7] fill-none stroke-[2.5] shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            {data.product_type_name} — {data.product_size_name}
          </div>
        )}
      </div>
    </div>
  )
}

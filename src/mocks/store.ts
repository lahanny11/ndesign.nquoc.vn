// Shared in-memory store — dùng chung cho tất cả mock handlers
// Khi POST /orders tạo order mới → push vào đây → GET /orders sẽ thấy ngay

export interface MockOrder {
  id: string
  order_number: string
  task_name: string
  status: string
  deadline: string
  is_urgent: boolean
  is_overdue: boolean
  has_warn_flag: boolean
  has_red_flag: boolean
  revision_rounds: number
  team_name: string
  team_id: string
  orderer_name: string
  orderer_avatar: null
  designer_name: string | null
  designer_avatar: null
  product_type_name: string
  product_size_name: string
  created_at: string
  done_at: string | null
  progress: number
}

// Today: 2026-05-08
export const mockOrders: MockOrder[] = [
  // ─── Đang chạy / urgent / cần để ý ───────────────────────────────────────────
  {
    id: '1', order_number: 'ND-20260501-0001',
    task_name: 'Banner Mạng xã hội Xuân 2026 — NhiLe Edition',
    status: 'assigned', deadline: '2026-05-12', is_urgent: true,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'Admin Nhile', team_id: 'team-admin',
    orderer_name: 'Phạm Lan Anh', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post 1080×1080px',
    created_at: '2026-05-01T09:00:00Z', done_at: null, progress: 2,
  },
  {
    id: '2', order_number: 'ND-20260502-0002',
    task_name: 'Thumbnail YouTube Series Kinh doanh tập 12',
    status: 'pending', deadline: '2026-05-15', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Nedu', team_id: 'team-nedu',
    orderer_name: 'Trần Minh Khoa', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'YouTube', product_size_name: 'Thumbnail 1280×720px',
    created_at: '2026-05-02T10:00:00Z', done_at: null, progress: 1,
  },
  {
    id: '3', order_number: 'ND-20260418-0003',
    task_name: 'Infographic Báo cáo tài chính Q1/2026 — NhiLe Holdings',
    status: 'feedback', deadline: '2026-05-02', is_urgent: false,
    is_overdue: true, has_warn_flag: false, has_red_flag: true,
    revision_rounds: 3, team_name: 'Ms Nhi', team_id: 'team-ms-nhi',
    orderer_name: 'Nguyễn Thị Hoa', designer_name: 'Trần Thị B', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A4 Ngang 297×210mm',
    created_at: '2026-04-18T08:00:00Z', done_at: null, progress: 5,
  },
  {
    id: '4', order_number: 'ND-20260420-0004',
    task_name: 'Email Newsletter tháng 5 — NhiLe Community',
    status: 'done', deadline: '2026-05-01', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'Content', team_id: 'team-content',
    orderer_name: 'Đỗ Phương Thảo', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Email', product_size_name: 'Email Header 600×200px',
    created_at: '2026-04-20T00:00:00Z', done_at: '2026-04-30T16:00:00Z', progress: 7,
  },
  {
    id: '5', order_number: 'ND-20260425-0005',
    task_name: 'LinkedIn Cover Photo — NhiLe Holdings Official Page',
    status: 'in_progress', deadline: '2026-05-18', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'IT', team_id: 'team-it',
    orderer_name: 'Lê Hoàng Nam', designer_name: 'Phạm Văn C', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'LinkedIn', product_size_name: 'Cover 1584×396px',
    created_at: '2026-04-25T00:00:00Z', done_at: null, progress: 3,
  },
  {
    id: '6', order_number: 'ND-20260503-0006',
    task_name: 'Poster Workshop "Design Thinking" — NhiLe Academy',
    status: 'pending', deadline: '2026-05-10', is_urgent: true,
    is_overdue: false, has_warn_flag: true, has_red_flag: false,
    revision_rounds: 0, team_name: 'Edit', team_id: 'team-edit',
    orderer_name: 'Vũ Thanh Tùng', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Story 1080×1920px',
    created_at: '2026-05-03T07:00:00Z', done_at: null, progress: 1,
  },
  {
    id: '7', order_number: 'ND-20260428-0007',
    task_name: 'Carousel Instagram — 5 Tips Quản lý thời gian hiệu quả',
    status: 'in_progress', deadline: '2026-05-13', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'nlt', team_id: 'team-nlt',
    orderer_name: 'Hoàng Bảo Châu', designer_name: 'Trần Thị B', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Carousel 1080×1080px',
    created_at: '2026-04-28T11:00:00Z', done_at: null, progress: 3,
  },

  // ─── Done trong tháng (để Stat "Hoàn thành" có số) ───────────────────────────
  {
    id: '8', order_number: 'ND-20260415-0008',
    task_name: 'Standee sự kiện Hội nghị thành viên Q2',
    status: 'done', deadline: '2026-04-25', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'Nedu', team_id: 'team-nedu',
    orderer_name: 'Trần Minh Khoa', designer_name: 'Phạm Văn C', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'Standee 60×160cm',
    created_at: '2026-04-15T00:00:00Z', done_at: '2026-04-24T14:00:00Z', progress: 7,
  },
  {
    id: '9', order_number: 'ND-20260410-0009',
    task_name: 'Bộ icon UI Dashboard nội bộ',
    status: 'done', deadline: '2026-04-22', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 2, team_name: 'IT', team_id: 'team-it',
    orderer_name: 'Lê Hoàng Nam', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Custom', product_size_name: '24×24px SVG',
    created_at: '2026-04-10T00:00:00Z', done_at: '2026-04-22T10:00:00Z', progress: 7,
  },
  {
    id: '10', order_number: 'ND-20260408-0010',
    task_name: 'Brochure giới thiệu khoá học IELTS 2026',
    status: 'done', deadline: '2026-04-20', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'Nedu', team_id: 'team-nedu',
    orderer_name: 'Trần Minh Khoa', designer_name: 'Trần Thị B', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A4 Gấp 3',
    created_at: '2026-04-08T00:00:00Z', done_at: '2026-04-19T16:00:00Z', progress: 7,
  },
  {
    id: '11', order_number: 'ND-20260412-0011',
    task_name: 'Ảnh Quote Daily Motivation — Bộ tháng 4',
    status: 'done', deadline: '2026-04-30', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Content', team_id: 'team-content',
    orderer_name: 'Đỗ Phương Thảo', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post 1080×1080px',
    created_at: '2026-04-12T00:00:00Z', done_at: '2026-04-28T14:00:00Z', progress: 7,
  },
  {
    id: '12', order_number: 'ND-20260416-0012',
    task_name: 'Banner livestream "NhiLe Talk #08"',
    status: 'done', deadline: '2026-04-26', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'nlt', team_id: 'team-nlt',
    orderer_name: 'Hoàng Bảo Châu', designer_name: 'Phạm Văn C', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'YouTube', product_size_name: 'Banner 1920×1080px',
    created_at: '2026-04-16T00:00:00Z', done_at: '2026-04-25T15:00:00Z', progress: 7,
  },
  {
    id: '13', order_number: 'ND-20260422-0013',
    task_name: 'Email signature templates cho team Marketing',
    status: 'done', deadline: '2026-05-02', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Admin Nhile', team_id: 'team-admin',
    orderer_name: 'Phạm Lan Anh', designer_name: 'Nguyễn Thị D', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Email', product_size_name: 'Signature 300×100px',
    created_at: '2026-04-22T00:00:00Z', done_at: '2026-05-01T11:00:00Z', progress: 7,
  },
  {
    id: '14', order_number: 'ND-20260427-0014',
    task_name: 'Set 5 ảnh giảng viên Workshop tháng 5',
    status: 'done', deadline: '2026-05-05', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 2, team_name: 'Edit', team_id: 'team-edit',
    orderer_name: 'Vũ Thanh Tùng', designer_name: 'Trần Thị B', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post 1080×1080px',
    created_at: '2026-04-27T00:00:00Z', done_at: '2026-05-05T10:00:00Z', progress: 7,
  },

  // ─── Đang chạy thêm (để dashboard không trống) ──────────────────────────────
  {
    id: '15', order_number: 'ND-20260430-0015',
    task_name: 'Bộ thumbnail Podcast "Founder\'s Talk" tập 22-25',
    status: 'in_progress', deadline: '2026-05-14', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'nlt', team_id: 'team-nlt',
    orderer_name: 'Hoàng Bảo Châu', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'YouTube', product_size_name: 'Thumbnail 1280×720px',
    created_at: '2026-04-30T00:00:00Z', done_at: null, progress: 3,
  },
  {
    id: '16', order_number: 'ND-20260504-0016',
    task_name: 'Sticker pack Telegram cho Community NhiLe',
    status: 'assigned', deadline: '2026-05-20', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Content', team_id: 'team-content',
    orderer_name: 'Đỗ Phương Thảo', designer_name: 'Nguyễn Thị D', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Custom', product_size_name: '512×512px PNG',
    created_at: '2026-05-04T00:00:00Z', done_at: null, progress: 2,
  },
  {
    id: '17', order_number: 'ND-20260505-0017',
    task_name: 'LinkedIn Post — Thông báo tuyển dụng Senior Designer',
    status: 'delivered', deadline: '2026-05-09', is_urgent: true,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'IT', team_id: 'team-it',
    orderer_name: 'Lê Hoàng Nam', designer_name: 'Phạm Văn C', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'LinkedIn', product_size_name: 'Post 1200×627px',
    created_at: '2026-05-05T00:00:00Z', done_at: null, progress: 4,
  },
  {
    id: '18', order_number: 'ND-20260506-0018',
    task_name: 'Slide deck Pitch — Giới thiệu sản phẩm Q2',
    status: 'in_progress', deadline: '2026-05-16', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Ms Nhi', team_id: 'team-ms-nhi',
    orderer_name: 'Nguyễn Thị Hoa', designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Custom', product_size_name: '16:9 Slide Deck',
    created_at: '2026-05-06T00:00:00Z', done_at: null, progress: 3,
  },
  {
    id: '19', order_number: 'ND-20260424-0019',
    task_name: 'Báo cáo thường niên NhiLe Holdings 2025 — Bìa & Layout',
    status: 'feedback', deadline: '2026-05-08', is_urgent: false,
    is_overdue: false, has_warn_flag: true, has_red_flag: false,
    revision_rounds: 2, team_name: 'Admin Nhile', team_id: 'team-admin',
    orderer_name: 'Phạm Lan Anh', designer_name: 'Trần Thị B', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A4 Đứng 50 trang',
    created_at: '2026-04-24T00:00:00Z', done_at: null, progress: 5,
  },
  {
    id: '20', order_number: 'ND-20260507-0020',
    task_name: 'Animation logo intro 5s cho video tuyển sinh',
    status: 'pending', deadline: '2026-05-22', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Nedu', team_id: 'team-nedu',
    orderer_name: 'Trần Minh Khoa', designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Custom', product_size_name: '1920×1080 MP4',
    created_at: '2026-05-07T00:00:00Z', done_at: null, progress: 1,
  },
]

// Map: team-id → team-name (dùng khi tạo order mới)
export const TEAM_MAP: Record<string, string> = {
  'team-admin':   'Admin Nhile',
  'team-nedu':    'Nedu',
  'team-edit':    'Edit',
  'team-it':      'IT',
  'team-ms-nhi':  'Ms Nhi',
  'team-content': 'Content',
  'team-nlt':     'nlt',
}

// Map: product-type-id → name
export const PRODUCT_TYPE_MAP: Record<string, string> = {
  'pt-1': 'Social Media',
  'pt-2': 'LinkedIn',
  'pt-3': 'YouTube',
  'pt-4': 'Print',
  'pt-5': 'Email',
  'pt-6': 'Custom',
}

// ─── Designer metadata (leave + member status) ───────────────────────────────

export interface DesignerMeta {
  id: string
  name: string
  member_status: 'new' | 'regular'
  joined_at: string
  training_note: string | null
  leave: {
    is_on_leave: boolean
    leave_start: string
    leave_end: string
    reason: string
    approved_by: string
    handover_status: 'pending' | 'partial' | 'complete' | 'standby'
    handover_to: string | null
  } | null
}

export const designerMetas: DesignerMeta[] = [
  {
    id: 'u-de-1',
    name: 'Lê Văn A',
    member_status: 'regular',
    joined_at: '2025-06-01',
    training_note: null,
    leave: null,
  },
  {
    id: 'u-de-2',
    name: 'Trần Thị B',
    member_status: 'regular',
    joined_at: '2025-03-15',
    training_note: null,
    leave: null,
  },
  {
    id: 'u-de-3',
    name: 'Phạm Văn C',
    member_status: 'regular',
    joined_at: '2025-08-10',
    training_note: null,
    leave: null,
  },
  {
    id: 'u-de-4',
    name: 'Nguyễn Thị D',
    member_status: 'regular',
    joined_at: '2026-01-12',
    training_note: null,
    leave: null,
  },
  {
    id: 'u-de-5',
    name: 'Hoàng E',
    member_status: 'new',
    joined_at: '2026-04-15',
    training_note: 'Vừa hoàn thành training 30/4. Cần quan sát kỹ 2 task đầu tiên. Điểm mạnh: typography. Cần cải thiện: tốc độ phản hồi feedback.',
    leave: null,
  },
]

// ─── Deliveries in-memory store ───────────────────────────────────────────────

export interface MockDelivery {
  id: string
  order_id: string
  round: number
  link_url: string
  link_type: string
  link_label: string
  note: string | null
  delivered_by: string
  delivered_at: string
  is_confirmed: boolean
  confirmed_at: string | null
}

export const mockDeliveries: MockDelivery[] = [
  {
    id: 'del-1',
    order_id: '17',
    round: 1,
    link_url: 'https://drive.google.com/drive/folders/mock-linkedin-tuyen-dung',
    link_type: 'google_drive',
    link_label: 'Google Drive',
    note: 'LinkedIn Post Senior Designer + 2 size phụ (vuông cho Story, ngang cho Email).',
    delivered_by: 'Phạm Văn C',
    delivered_at: '2026-05-07T14:00:00Z',
    is_confirmed: false,
    confirmed_at: null,
  },
  {
    id: 'del-2',
    order_id: '4',
    round: 1,
    link_url: 'https://drive.google.com/drive/folders/mock-newsletter-may',
    link_type: 'google_drive',
    link_label: 'Google Drive',
    note: 'Newsletter tháng 5: header + 3 module + footer. File source .psd kèm.',
    delivered_by: 'Lê Văn A',
    delivered_at: '2026-04-29T10:00:00Z',
    is_confirmed: true,
    confirmed_at: '2026-04-30T15:30:00Z',
  },
]

let _counter = 21
export function nextOrderNumber() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const num = String(_counter++).padStart(4, '0')
  return `ND-${today}-${num}`
}

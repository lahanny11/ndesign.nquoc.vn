import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:3000'

const MOCK_ORDERS = [
  {
    id: '1', order_number: 'ND-20260401-0001',
    task_name: 'Banner Mạng xã hội Xuân 2025',
    status: 'assigned', deadline: '2025-04-15', is_urgent: true,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Admin Nhile', orderer_name: 'Felix',
    designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post',
    created_at: '2026-04-01T09:00:00Z', done_at: null, progress: 4,
  },
  {
    id: '2', order_number: 'ND-20260404-0002',
    task_name: 'Bộ Avatar Nhân viên mới Q2',
    status: 'pending', deadline: '2025-04-20', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Nedu', orderer_name: 'Ms. Hồng',
    designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Story',
    created_at: '2026-04-04T10:00:00Z', done_at: null, progress: 1,
  },
  {
    id: '3', order_number: 'ND-20260320-0003',
    task_name: 'Slide bài giảng tháng 4',
    status: 'feedback', deadline: '2025-04-10', is_urgent: true,
    is_overdue: true, has_warn_flag: false, has_red_flag: true,
    revision_rounds: 3, team_name: 'Edit', orderer_name: 'Nhi Le',
    designer_name: 'Trần Thị B', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A4',
    created_at: '2026-03-20T08:00:00Z', done_at: null, progress: 6,
  },
  {
    id: '4', order_number: 'ND-20260310-0004',
    task_name: 'Poster Tuyển dụng IT',
    status: 'done', deadline: '2025-03-20', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 1, team_name: 'IT', orderer_name: 'Anh Tech',
    designer_name: 'Felix', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A3',
    created_at: '2026-03-10T00:00:00Z', done_at: '2026-03-19T00:00:00Z', progress: 7,
  },
  {
    id: '5', order_number: 'ND-20260401-0005',
    task_name: 'Ảnh Quote Motivation Daily',
    status: 'in_progress', deadline: '2025-04-08', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Ms Nhi', orderer_name: 'Ms Nhi',
    designer_name: 'Lê Văn A', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Social Media', product_size_name: 'Feed Post',
    created_at: '2026-04-01T00:00:00Z', done_at: null, progress: 3,
  },
  {
    id: '6', order_number: 'ND-20260328-0006',
    task_name: 'Thumbnail Youtube Series mới',
    status: 'pending', deadline: '2025-04-01', is_urgent: true,
    is_overdue: true, has_warn_flag: true, has_red_flag: false,
    revision_rounds: 0, team_name: 'NLT', orderer_name: 'Content',
    designer_name: null, designer_avatar: null, orderer_avatar: null,
    product_type_name: 'YouTube', product_size_name: 'Thumbnail',
    created_at: '2026-03-28T00:00:00Z', done_at: null, progress: 1,
  },
  {
    id: '7', order_number: 'ND-20260405-0007',
    task_name: 'Standee Workshop tháng 4',
    status: 'in_progress', deadline: '2025-04-25', is_urgent: false,
    is_overdue: false, has_warn_flag: false, has_red_flag: false,
    revision_rounds: 0, team_name: 'Nedu', orderer_name: 'Manager',
    designer_name: 'Trần Thị B', designer_avatar: null, orderer_avatar: null,
    product_type_name: 'Print', product_size_name: 'A3',
    created_at: '2026-04-05T00:00:00Z', done_at: null, progress: 3,
  },
]

const MOCK_ORDER_DETAILS: Record<string, object> = {
  '1': {
    id: '1', title: 'Banner Mạng xã hội Xuân 2025', type: 'Banner', team: 'Admin Nhile',
    designer: 'Lê Văn A', deadline: '2025-04-15', status: 'ASSIGNED', flag: null,
    metrics: { rounds: 0, ontime: 'Sớm 10 ngày', comms: 3, briefCheck: true },
    steps: [
      { id: 's1', name: 'Order được gửi', state: 'done', time: '01/04 09:00', desc: 'Felix gửi order từ team Admin Nhile.', checks: [{ ok: true, text: 'Brief đính kèm đầy đủ' }, { ok: true, text: 'Deadline rõ ràng: 15/04' }], actions: [] },
      { id: 's2', name: 'Designer nhận task', state: 'done', time: '01/04 10:30', desc: 'Lê Văn A nhận, hỏi làm rõ 2 điểm.', checks: [{ ok: true, text: 'Double-check brief với orderer ✓' }, { ok: true, text: 'Confirm hiểu yêu cầu màu sắc Tết' }], actions: [] },
      { id: 's3', name: 'Designer đang làm', state: 'done', time: '01/04 – 05/04', desc: 'Gửi draft sơ bộ ngày 03/04.', checks: [{ ok: true, text: 'Gửi draft confirm hướng ngày 03/04' }, { ok: true, text: 'Check-in với orderer ngày 04/04' }], actions: [] },
      { id: 's4', name: 'Giao sản phẩm lần đầu', state: 'done', time: '05/04 16:00', timeClass: 'early', desc: 'Giao bản hoàn thiện đúng format.', checks: [{ ok: true, text: 'Bản hoàn thiện — không phải draft' }, { ok: true, text: 'Đính kèm đủ file gốc (.ai, .png)' }], actions: [] },
      { id: 's5', name: 'Feedback & Chờ phản hồi', state: 'active', time: '06/04 – đang chờ', desc: 'Đã giao, chờ orderer review.', checks: [{ ok: null, text: 'Orderer xem và cho feedback' }, { ok: null, text: 'Designer double-check feedback' }], actions: ['Đã nhận feedback', 'Yêu cầu làm rõ'] },
      { id: 's6', name: 'Chỉnh sửa (nếu cần)', state: 'pending', time: '', desc: '', checks: [], actions: [] },
      { id: 's7', name: 'Hoàn thành & Bàn giao', state: 'pending', time: '', desc: '', checks: [], actions: [] },
    ],
  },
  '3': {
    id: '3', title: 'Slide bài giảng tháng 4', type: 'Thumbnail', team: 'Edit',
    designer: 'Trần Thị B', deadline: '2025-04-10', status: 'FEEDBACK', flag: 'red',
    metrics: { rounds: 3, ontime: 'Trễ 3 ngày', comms: 1, briefCheck: false },
    redFlags: ['Không double-check brief khi nhận task', 'Giao bản thảo sơ bộ thay vì bản hoàn thiện', 'Đã 3 revision rounds nhưng vẫn chưa done', 'Chỉ 1 lần giao tiếp với orderer'],
    steps: [
      { id: 's1', name: 'Order được gửi', state: 'done', time: '20/03 08:00', desc: 'Nhi Le gửi order.', checks: [{ ok: true, text: 'Brief đính kèm' }, { ok: false, text: 'Deadline quá gấp — chỉ 21 ngày' }], actions: [] },
      { id: 's2', name: 'Designer nhận task', state: 'done', time: '20/03 14:00', desc: 'Trần Thị B nhận nhưng không hỏi gì.', checks: [{ ok: false, text: 'KHÔNG double-check brief — bắt tay làm luôn' }, { ok: false, text: 'Không hỏi về style, template yêu cầu' }], actions: [] },
      { id: 's3', name: 'Designer đang làm', state: 'done', time: '20/03 – 08/04', desc: '19 ngày không check-in.', checks: [{ ok: false, text: 'Không check-in giữa chừng — 19 ngày im lặng' }, { ok: false, text: 'Không gửi draft confirm hướng' }], actions: [] },
      { id: 's4', name: 'Giao sản phẩm lần đầu', state: 'done', time: '08/04 23:59 · trễ 3 ngày', timeClass: 'late', desc: 'Giao bản thảo sơ bộ, thiếu file gốc.', checks: [{ ok: false, text: 'Giao bản thảo sơ bộ — chưa hoàn chỉnh' }, { ok: false, text: 'Thiếu file source gốc (.psd/.ai)' }], actions: [] },
      { id: 's5', name: 'Feedback Round 1', state: 'done', time: '09/04', desc: 'Orderer gửi 8 điểm feedback.', checks: [{ ok: false, text: 'Designer không double-check, chỉnh sai 3/8 điểm' }], actions: [] },
      { id: 's6', name: 'Chỉnh sửa Round 2', state: 'done', time: '10/04', desc: 'Vẫn sai các điểm từ round 1.', checks: [{ ok: false, text: '3 điểm từ round 1 vẫn sai' }], actions: [] },
      { id: 's7', name: 'Chỉnh sửa Round 3', state: 'active', time: '11/04 – đang thực hiện', desc: 'Round 3 — cần leader theo dõi sát.', checks: [{ ok: null, text: 'Confirm từng điểm với orderer' }, { ok: null, text: 'Leader review trước khi gửi' }], actions: ['Đã chỉnh xong Round 3', '🚨 Báo Leader can thiệp'] },
      { id: 's8', name: 'Hoàn thành & Bàn giao', state: 'pending', time: '', desc: '', checks: [], actions: [] },
    ],
  },
}

export const dashboardHandlers = [
  http.get(`${BASE}/api/v1/orders`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const hasFlag = url.searchParams.get('has_flag')

    let orders = MOCK_ORDERS
    if (status) {
      const statuses = status.split(',')
      orders = orders.filter(o => statuses.includes(o.status))
    }
    if (hasFlag === 'true') {
      orders = orders.filter(o => o.has_red_flag || o.has_warn_flag)
    }

    return HttpResponse.json({
      data: orders,
      meta: { total: orders.length, page: 1, per_page: 20, has_next: false, next_cursor: null },
    })
  }),

  http.get(`${BASE}/api/v1/orders/:id`, ({ params }) => {
    const detail = MOCK_ORDER_DETAILS[params.id as string]
    if (detail) return HttpResponse.json(detail)
    const order = MOCK_ORDERS.find(o => o.id === params.id)
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json({
      ...order, title: order.task_name, type: order.product_type_name,
      team: order.team_name, designer: order.designer_name, flag: order.has_red_flag ? 'red' : order.has_warn_flag ? 'warn' : null,
      metrics: { rounds: order.revision_rounds, ontime: 'Còn 5 ngày', comms: 2, briefCheck: true },
      steps: [
        { id: 's1', name: 'Order được gửi', state: 'done', time: '01/04', desc: '', checks: [{ ok: true, text: 'Brief đầy đủ' }], actions: [] },
        { id: 's2', name: 'Designer nhận task', state: 'active', time: 'Đang xử lý...', desc: '', checks: [{ ok: null, text: 'Assign designer' }], actions: ['Assign Designer ngay'] },
        { id: 's3', name: 'Hoàn thành', state: 'pending', time: '', desc: '', checks: [], actions: [] },
      ],
    })
  }),

  http.get(`${BASE}/api/v1/dashboard/stats`, () => {
    return HttpResponse.json({
      total_orders: 7,
      in_progress_count: 4,
      done_count: 1,
      urgent_count: 3,
      active_red_flag_orders: 2,
      active_warn_flag_orders: 1,
      pending_assignment: 2,
    })
  }),
]

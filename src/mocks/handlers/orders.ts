// src/mocks/handlers/orders.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockPerson, getCurrentMockUserId, unauthorized, forbidden, notFound } from '../config'
import { MOCK_ORDERS, MOCK_ORDERS_ALL } from '../data/orders'
import type { Order } from '@modules/orders/types'

// Map designer_id → display name (cho UI hiển thị tên người, không phải id)
const DESIGNER_NAMES: Record<string, string> = {
  'user-des-01': 'Lê Văn A',
  'user-des-02': 'Trần Thị B',
  'user-des-03': 'Phạm Văn C',
  'user-des-04': 'Nguyễn Thị D',
  'user-des-05': 'Hoàng E',
}
const ORDERER_NAMES: Record<string, string> = {
  'user-ord-01':  'Phạm Lan Anh',  'user-ord-02': 'Trần Minh Khoa',
  'user-ord-03':  'Nguyễn Thị Hoa','user-ord-04': 'Đỗ Phương Thảo',
  'user-ord-05':  'Lê Hoàng Nam',  'user-ord-06': 'Vũ Thanh Tùng',
  'user-ord-07':  'Hoàng Bảo Châu','user-ord-08': 'Trần Minh Khoa',
  'user-ord-09':  'Lê Hoàng Nam',  'user-ord-10': 'Trần Minh Khoa',
  'user-ord-11':  'Đỗ Phương Thảo','user-ord-12': 'Hoàng Bảo Châu',
  'user-ord-13':  'Phạm Lan Anh',  'user-ord-14': 'Hoàng Bảo Châu',
  'user-ord-15':  'Đỗ Phương Thảo','user-ord-16': 'Lê Hoàng Nam',
  'user-ord-17':  'Phạm Lan Anh',  'user-ord-18': 'Trần Minh Khoa',
  'user-ord-19':  'Vũ Thanh Tùng', 'user-ord-20': 'Nguyễn Thị Hoa',
}
const TEAM_NAMES: Record<string, string> = {
  'team-admin':   'Admin Nhile',
  'team-nedu':    'Nedu',
  'team-edit':    'Edit',
  'team-it':      'IT',
  'team-ms-nhi':  'Ms Nhi',
  'team-content': 'Content',
  'team-nlt':     'nlt',
}
const PT_NAMES: Record<string, string> = {
  'pt-quote-square': 'Social Media',
  'pt-banner-cover': 'Banner / Cover',
  'pt-poster-doc':   'Poster',
  'pt-thumbnail':    'Thumbnail',
  'pt-mailing-list': 'Email',
  'pt-custom':       'Custom',
}
const designerName = (id: string) => DESIGNER_NAMES[id] ?? id
const ordererName  = (id: string) => ORDERER_NAMES[id] ?? id
const teamName     = (id: string) => TEAM_NAMES[id] ?? id
const ptName       = (id: string) => PT_NAMES[id] ?? id

export const orderHandlers = [

  // LIST (role-filtered)
  http.get('*/api/orders', async ({ request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const url    = new URL(request.url)
    const status = url.searchParams.get('status')
    const page   = Number(url.searchParams.get('page')  ?? '1')
    const limit  = Number(url.searchParams.get('limit') ?? '20')
    let items = MOCK_ORDERS[person.id] ?? MOCK_ORDERS_ALL
    if (status) items = items.filter(o => o.status === status)
    const paged = items.slice((page - 1) * limit, page * limit)
    return HttpResponse.json({ data: paged, meta: { page, limit, total: items.length } })
  }),

  // CREATE (orderer only)
  http.post('*/api/orders', async ({ request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('orderer')) return forbidden('orderer only')
    const body = await request.json() as Partial<{
      task_name: string; team_id: string; product_type_id: string
      product_size_label: string; brief: string; deadline: string
      is_urgent: boolean; color_palette: string[]; reference_image_urls: string[]
    }>
    const errors: string[] = []
    if (!body.task_name || body.task_name.length < 3 || body.task_name.length > 200)
      errors.push('task_name must be 3–200 characters')
    if (!body.product_type_id)    errors.push('product_type_id should not be empty')
    if (!body.product_size_label) errors.push('product_size_label should not be empty')
    if (!body.brief || body.brief.length < 30)  errors.push('brief must be at least 30 characters')
    if (body.brief && body.brief.length > 2000) errors.push('brief must not exceed 2000 characters')
    if (!body.deadline) errors.push('deadline should not be empty')
    if (errors.length)  return HttpResponse.json({ statusCode: 400, message: errors, error: 'Bad Request' }, { status: 400 })
    const now     = new Date().toISOString()
    const dateStr = now.slice(0, 10).replace(/-/g, '')
    const created: Order = {
      id: crypto.randomUUID(),
      order_number: `ND-${dateStr}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      task_name: body.task_name!,
      orderer_id: 'user-ord-mock',
      orderer_person_id: person.id,
      team_id: body.team_id ?? 'team-unknown',
      designer_id: undefined,
      product_type_id: body.product_type_id!,
      product_size_label: body.product_size_label!,
      brief: body.brief!,
      style_description: '',
      color_palette: body.color_palette ?? [],
      reference_image_urls: body.reference_image_urls ?? [],
      status: 'pending',
      priority: body.is_urgent ? 'urgent' : 'normal',
      is_urgent: body.is_urgent ?? false,
      is_overdue: false,
      has_red_flag: false,
      has_warn_flag: false,
      revision_count: 0,
      milestone_progress: 0,
      deadline: body.deadline!,
      last_checkin_at: undefined,
      created_at: now,
      updated_at: now,
    }
    ;(MOCK_ORDERS[person.id] ??= []).push(created)
    MOCK_ORDERS_ALL.push(created)
    return HttpResponse.json({ data: created }, { status: 201 })
  }),

  // GET ONE
  http.get('*/api/orders/:id', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    if (person.roles.includes('orderer') && order.orderer_person_id !== person.id)
      return forbidden('Team access only')
    return HttpResponse.json({ data: order })
  }),

  // START (assigned → active, designer)
  http.post('*/api/orders/:id/start', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('designer')) return forbidden('designer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    if (order.status !== 'assigned')
      return HttpResponse.json(
        { statusCode: 422, message: 'Order must be in assigned status', error: 'Unprocessable Entity', code: 'INVALID_STATUS_TRANSITION' },
        { status: 422 }
      )
    order.status = 'active'
    order.updated_at = new Date().toISOString()
    return HttpResponse.json({ data: order })
  }),

  // SELF-ASSIGN (designer)
  http.post('*/api/orders/:id/self-assign', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('designer')) return forbidden('designer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    if (order.status !== 'pending')
      return HttpResponse.json(
        { statusCode: 422, message: 'Order đã được nhận', error: 'Unprocessable Entity', code: 'ALREADY_ASSIGNED' },
        { status: 422 }
      )
    const activeCount = (MOCK_ORDERS[person.id] ?? []).filter(o =>
      ['assigned', 'active', 'delivered', 'feedback'].includes(o.status)
    ).length
    if (activeCount >= 7)
      return HttpResponse.json(
        { statusCode: 422, message: 'Đang có 7 task active', error: 'Unprocessable Entity', code: 'CAPACITY_FULL' },
        { status: 422 }
      )
    order.status = 'assigned'
    order.updated_at = new Date().toISOString()
    ;(MOCK_ORDERS[person.id] ??= []).push(order)
    return HttpResponse.json({ data: order })
  }),

  // ASSIGN (leader)
  http.post('*/api/orders/:id/assignments', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.some(r => ['design_leader', 'co_leader'].includes(r)))
      return forbidden('leader only')
    const body = await request.json() as { designer_person_id?: string }
    if (!body.designer_person_id)
      return HttpResponse.json(
        { statusCode: 400, message: ['designer_person_id should not be empty'], error: 'Bad Request' },
        { status: 400 }
      )
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    order.designer_id  = 'user-des-assigned'
    order.status       = 'assigned'
    order.updated_at   = new Date().toISOString()
    return HttpResponse.json({ data: order })
  }),

  // CONFIRM DONE (orderer)
  http.post('*/api/orders/:id/confirm-done', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.includes('orderer')) return forbidden('orderer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    if (order.status !== 'delivered')
      return HttpResponse.json(
        { statusCode: 422, message: 'Order chưa delivered', error: 'Unprocessable Entity', code: 'ORDER_NOT_DELIVERED' },
        { status: 422 }
      )
    const now = new Date().toISOString()
    order.status     = 'done'
    order.updated_at = now
    return HttpResponse.json({ data: { status: 'done', updated_at: now } })
  }),

  // ESCALATE (orderer or designer)
  http.post('*/api/orders/:id/escalate', async ({ params, request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    if (!person.roles.some(r => ['orderer', 'designer'].includes(r)))
      return forbidden('orderer or designer only')
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()
    const body = await request.json() as { reason?: string }
    const now = new Date().toISOString()
    order.has_red_flag = true
    order.updated_at   = now
    return HttpResponse.json({
      data: { order_id: params.id, escalated_by: person.id, reason: body.reason, created_at: now }
    })
  }),

  // Legacy v1 aliases — giữ backward compat với component hooks cũ
  // useOrders hook expects { data: OrderCard[], meta: {...} } sau khi apiClient
  // unwrap. apiClient unwrap 1 lần `data` → cần wrap 2 lần.
  http.get('*/api/v1/orders', async ({ request }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const url    = new URL(request.url)
    const statusParam = url.searchParams.get('status')
    const hasFlag     = url.searchParams.get('has_flag') === 'true'
    const page   = Number(url.searchParams.get('page')  ?? '1')
    const limit  = Number(url.searchParams.get('limit') ?? '50')
    let items = MOCK_ORDERS[person.id] ?? MOCK_ORDERS_ALL

    // Filter theo status — hỗ trợ "in_progress,assigned" comma-separated
    if (statusParam) {
      const statuses = statusParam.split(',').map(s => s.trim())
      items = items.filter(o =>
        statuses.includes(o.status) ||
        (statuses.includes('in_progress') && o.status === 'active')
      )
    }
    if (hasFlag) items = items.filter(o => o.has_red_flag || o.has_warn_flag)

    const paged = items.slice((page - 1) * limit, page * limit)

    // Map Order → OrderCard shape mà dashboard expect
    const cards = paged.map(o => ({
      id: o.id,
      order_number: o.order_number,
      task_name: o.task_name,
      status: o.status === 'active' ? 'in_progress' : o.status,
      deadline: o.deadline,
      is_urgent: o.is_urgent,
      is_overdue: o.is_overdue,
      has_warn_flag: o.has_warn_flag,
      has_red_flag: o.has_red_flag,
      revision_rounds: o.revision_count,
      progress: o.milestone_progress,
      product_type_name: ptName(o.product_type_id),
      product_size_name: o.product_size_label,
      team_name: teamName(o.team_id),
      designer_name: o.designer_id ? designerName(o.designer_id) : null,
      orderer_name: ordererName(o.orderer_id),
      created_at: o.created_at,
      done_at: o.status === 'done' ? o.updated_at : null,
    }))

    return HttpResponse.json({
      data: { data: cards, meta: { page, limit, total: items.length, has_next: items.length > page * limit, next_cursor: null } },
    })
  }),
  http.get('*/api/v1/orders/:id', async ({ params }) => {
    const person = await getCurrentMockPerson()
    if (!person) return unauthorized()
    const order = MOCK_ORDERS_ALL.find(o => o.id === params.id)
    if (!order) return notFound()

    // Map raw Order → OrderDetail shape mà TrackingPanel expect
    const NOW_MS = new Date('2026-05-08T09:00:00Z').getTime()
    const dlMs = new Date(order.deadline + 'T23:59:59Z').getTime()
    const diffDays = Math.round((dlMs - NOW_MS) / 86400000)
    const ontime =
      order.status === 'done'  ? 'Đúng hạn' :
      order.is_overdue         ? `Trễ ${Math.abs(diffDays)} ngày` :
      diffDays < 0             ? `Trễ ${Math.abs(diffDays)} ngày` :
      diffDays <= 1            ? `Còn ${Math.max(diffDays, 0)} ngày` :
                                 `Sớm ${diffDays} ngày`

    // ─── Performance metrics maps (used by both steps + insights) ──────────
    const DESIGNER_METRICS: Record<string, {grade:'A'|'B'|'C', resp:number, checkin:number, rev:number, ontime:number, done:number}> = {
      'user-des-01': { grade: 'A', resp: 1.5, checkin: 95, rev: 0.8, ontime: 92, done: 7 },
      'user-des-02': { grade: 'C', resp: 6.2, checkin: 65, rev: 2.3, ontime: 70, done: 5 },
      'user-des-03': { grade: 'B', resp: 3.0, checkin: 85, rev: 1.0, ontime: 88, done: 4 },
      'user-des-04': { grade: 'A', resp: 1.0, checkin: 100, rev: 0.5, ontime: 100, done: 2 },
      'user-des-05': { grade: 'B', resp: 4.5, checkin: 80, rev: 1.5, ontime: 75, done: 1 },
    }
    const ORDERER_METRICS: Record<string, {brief:number, resp:number, rev:number, returned:number}> = {
      'user-ord-01': { brief: 88, resp: 2.0, rev: 1.2, returned: 0 },
      'user-ord-02': { brief: 72, resp: 5.5, rev: 1.6, returned: 1 },
      'user-ord-03': { brief: 55, resp: 8.0, rev: 2.8, returned: 3 },
      'user-ord-04': { brief: 95, resp: 1.5, rev: 0.5, returned: 0 },
      'user-ord-05': { brief: 80, resp: 3.0, rev: 1.0, returned: 0 },
      'user-ord-06': { brief: 70, resp: 4.0, rev: 1.5, returned: 1 },
      'user-ord-07': { brief: 75, resp: 2.5, rev: 1.0, returned: 0 },
    }
    const designerName_ = order.designer_id ? designerName(order.designer_id) : null
    const ordererName_  = ordererName(order.orderer_id)

    // ─── Rich step builder — desc, checks, time, actions ────────────────────
    type StepState = 'done' | 'active' | 'flagged' | 'pending'
    type Check = { ok: boolean | null; text: string }
    interface StepData {
      id: string; name: string; state: StepState; time: string
      timeClass?: 'late' | 'early'; desc: string; checks: Check[]; actions?: string[]
    }

    const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
    const created = new Date(order.created_at)
    const dl = new Date(order.deadline + 'T23:59:59Z')
    const isHealthy = !order.has_red_flag && !order.has_warn_flag && order.revision_count <= 1
    const designerLabel = designerName_ ?? '?'

    const steps: StepData[] = []

    // 1. Order được gửi — luôn done
    steps.push({
      id: 's1', name: 'Order được gửi', state: 'done',
      time: fmtDate(created),
      desc: `${ordererName_} gửi order.`,
      checks: [
        { ok: order.brief && order.brief.length >= 30, text: 'Brief đầy đủ' },
        { ok: !order.is_urgent ? true : (dl.getTime() - created.getTime()) > 3 * 86400000, text: order.is_urgent ? 'Deadline gấp — cần ưu tiên' : `Deadline rõ: ${fmtDate(dl)}` },
        { ok: true, text: 'Loại sản phẩm xác định' },
      ],
    })

    // 2. Designer nhận task
    if (order.designer_id) {
      const assignAt = new Date(created.getTime() + 6 * 3600000)
      const dm = DESIGNER_METRICS[order.designer_id]
      const isCarefulDesigner = dm?.grade === 'A'
      steps.push({
        id: 's2', name: 'Designer nhận task',
        state: order.milestone_progress >= 2 ? 'done' : 'active',
        time: `${fmtDate(assignAt)} · ${order.milestone_progress >= 2 ? 'sau 6h' : 'mới nhận'}`,
        desc: `${designerLabel} ${isCarefulDesigner ? 'nhận và kiểm tra brief kỹ.' : 'nhận task.'}`,
        checks: [
          { ok: isCarefulDesigner, text: isCarefulDesigner ? 'Double-check brief ✓' : 'KHÔNG double-check brief — bắt tay làm luôn' },
          { ok: isCarefulDesigner, text: isCarefulDesigner ? 'Hỏi 1 câu về màu brand' : 'Không hỏi về style, template yêu cầu' },
          { ok: true, text: 'Xác nhận nhận task' },
        ],
      })
    } else {
      steps.push({
        id: 's2', name: 'Designer nhận task', state: 'active',
        time: 'chưa assign',
        desc: 'Đang chờ Design Leader phân công.',
        checks: [],
        actions: ['👤 Assign Designer ngay'],
      })
    }

    // 3. Designer đang làm
    if (order.milestone_progress >= 3 && order.designer_id) {
      const startAt = new Date(created.getTime() + 24 * 3600000)
      const isHealthy3 = order.last_checkin_at && order.revision_count === 0
      const noCheckinDays = Math.round((NOW_MS - new Date(order.last_checkin_at ?? created).getTime()) / 86400000)
      steps.push({
        id: 's3', name: 'Designer đang làm',
        state: order.milestone_progress >= 4 ? 'done' : (order.has_red_flag && order.milestone_progress === 3 ? 'flagged' : 'active'),
        time: `${fmtDate(startAt)} – ${order.milestone_progress >= 4 ? fmtDate(new Date(created.getTime() + 86400000 * 6)) : 'đang làm'}`,
        desc: isHealthy3
          ? 'Tiến độ ổn định, có check-in.'
          : (noCheckinDays > 5 ? `${noCheckinDays} ngày không check-in.` : 'Đang thực hiện.'),
        checks: [
          { ok: isHealthy3 ? true : noCheckinDays <= 5, text: noCheckinDays > 5 ? `Không check-in giữa chừng — ${noCheckinDays} ngày im lặng` : 'Check-in đúng hạn ✓' },
          { ok: isHealthy3, text: isHealthy3 ? 'Gửi draft sơ bộ xác nhận hướng' : 'Không gửi draft confirm hướng' },
          { ok: !order.is_overdue, text: order.is_overdue ? 'Không liên lạc dù gần deadline' : 'Liên lạc thường xuyên' },
        ],
      })
    } else if (order.milestone_progress < 3) {
      steps.push({
        id: 's3', name: 'Designer đang làm', state: 'pending',
        time: '', desc: '', checks: [],
      })
    }

    // 4. Giao sản phẩm lần đầu
    if (order.milestone_progress >= 4) {
      const deliverAt = new Date(created.getTime() + (dl.getTime() - created.getTime()) * 0.5)
      const isLate = deliverAt.getTime() > dl.getTime()
      const daysDiff = Math.round((dl.getTime() - deliverAt.getTime()) / 86400000)
      steps.push({
        id: 's4', name: 'Giao sản phẩm lần đầu',
        state: order.milestone_progress >= 5 ? 'done' : 'active',
        time: `${fmtDate(deliverAt)} ${isLate ? `· trễ ${Math.abs(daysDiff)} ngày` : daysDiff > 0 ? `· sớm ${daysDiff} ngày` : ''}`,
        timeClass: isLate ? 'late' : daysDiff > 2 ? 'early' : undefined,
        desc: isHealthy
          ? 'Giao bản hoàn thiện, đầy đủ file.'
          : (order.has_red_flag ? 'Giao bản thảo sơ bộ, chưa hoàn thiện, thiếu file gốc.' : 'Đã giao đúng tiêu chuẩn QA.'),
        checks: [
          { ok: isHealthy, text: isHealthy ? 'Bản hoàn thiện' : 'Giao bản thảo sơ bộ — nhiều element chưa hoàn chỉnh' },
          { ok: isHealthy, text: isHealthy ? 'Đủ file gốc' : 'Thiếu file source gốc (.psd/.ai)' },
          { ok: true, text: 'Đúng kích thước yêu cầu' },
        ],
      })
    } else {
      steps.push({
        id: 's4', name: 'Giao sản phẩm lần đầu', state: 'pending',
        time: '', desc: '', checks: [],
      })
    }

    // 5. Feedback & Chỉnh sửa — split thành các round nếu có
    if (order.revision_count === 0 && order.milestone_progress >= 4) {
      // No revision needed
      steps.push({
        id: 's5', name: 'Feedback & Chỉnh sửa', state: 'done',
        time: 'Bỏ qua · 0 round',
        desc: 'Orderer hài lòng ngay từ bản đầu.',
        checks: [{ ok: true, text: 'Không cần revise' }],
      })
    } else if (order.revision_count >= 1) {
      // Round 1
      const r1Date = new Date(created.getTime() + (dl.getTime() - created.getTime()) * 0.6)
      const isQuickFix = isHealthy && order.revision_count === 1
      steps.push({
        id: 's5a', name: isQuickFix ? 'Feedback & Chỉnh sửa' : 'Feedback Round 1',
        state: 'done',
        time: `${fmtDate(r1Date)}${isQuickFix ? ' · 1 round' : ''}`,
        desc: isQuickFix ? 'Chỉnh đúng tất cả điểm ngay lần đầu.' : `${ordererName_} gửi feedback chi tiết.`,
        checks: isQuickFix
          ? [{ ok: true, text: 'Chỉnh đúng tất cả điểm ngay lần đầu' }]
          : [
              { ok: false, text: 'Designer không double-check, chỉnh sai 3/8 điểm' },
              { ok: false, text: 'Không confirm với orderer trước khi chỉnh' },
            ],
      })

      if (order.revision_count >= 2) {
        const r2Date = new Date(r1Date.getTime() + 1.5 * 86400000)
        steps.push({
          id: 's5b', name: 'Chỉnh sửa Round 2',
          state: order.revision_count >= 3 ? 'done' : 'active',
          time: fmtDate(r2Date),
          desc: 'Vẫn sai các điểm từ round 1.',
          checks: [
            { ok: false, text: '3 điểm từ round 1 vẫn sai' },
            { ok: false, text: 'Thêm 2 lỗi mới do không kiểm tra kỹ' },
          ],
        })
      }

      if (order.revision_count >= 3) {
        const r3Date = new Date(NOW_MS - 86400000)
        steps.push({
          id: 's5c', name: 'Chỉnh sửa Round 3',
          state: order.status === 'done' ? 'done' : 'active',
          time: order.status === 'done' ? fmtDate(r3Date) : `${fmtDate(r3Date)} · đang thực hiện`,
          desc: 'Round 3 — cần leader theo dõi sát.',
          checks: [
            { ok: null, text: 'Confirm từng điểm với orderer trước khi giao' },
            { ok: null, text: 'Leader review trước khi gửi' },
          ],
          actions: order.status === 'done' ? undefined : ['Đã chỉnh xong Round 3', '🚨 Báo Leader can thiệp'],
        })
      }
    } else {
      steps.push({
        id: 's5', name: 'Feedback & Chỉnh sửa', state: 'pending',
        time: '', desc: '', checks: [],
      })
    }

    // 6. Hoàn thành & Bàn giao
    if (order.status === 'done') {
      const doneDate = new Date(order.updated_at)
      const earlyDays = Math.round((dl.getTime() - doneDate.getTime()) / 86400000)
      steps.push({
        id: 's6', name: 'Hoàn thành & Bàn giao', state: 'done',
        time: `${fmtDate(doneDate)} ✓`,
        timeClass: earlyDays > 0 ? 'early' : undefined,
        desc: earlyDays > 0 ? `Done trước deadline ${earlyDays} ngày.` : 'Done đúng deadline.',
        checks: [
          { ok: true, text: 'Orderer xác nhận hài lòng' },
          { ok: true, text: 'Đủ tất cả file bàn giao' },
        ],
      })
    } else {
      steps.push({
        id: 's6', name: 'Hoàn thành & Bàn giao', state: 'pending',
        time: '', desc: '', checks: [],
      })
    }

    // ─── Performance insights — dùng lại DESIGNER_METRICS / ORDERER_METRICS đã declare ────
    const dm = DESIGNER_METRICS[order.designer_id ?? ''] ?? { grade: 'B' as const, resp: 3, checkin: 80, rev: 1.2, ontime: 85, done: 3 }
    const om = ORDERER_METRICS[order.orderer_id] ?? { brief: 75, resp: 3, rev: 1.2, returned: 0 }

    // Timing per milestone — ước lượng theo milestone_progress
    const createdMs = new Date(order.created_at).getTime()
    const totalDays = Math.max(1, Math.round((NOW_MS - createdMs) / 86400000))
    const timing = [
      { label: 'Order → Assign',       duration_hours: order.designer_id ? Math.min(20, totalDays * 4) : 26, sla_hours: 24 },
      { label: 'Assign → Bắt đầu',     duration_hours: order.milestone_progress >= 3 ? 6                   : 12, sla_hours: 8  },
      { label: 'Làm → Giao bản đầu',   duration_hours: order.milestone_progress >= 4 ? totalDays * 12      : 0,  sla_hours: 48 },
      { label: 'Feedback → Revise',    duration_hours: order.revision_count > 0      ? order.revision_count * 16 : 0, sla_hours: 24 },
      { label: 'Revise → Hoàn tất',    duration_hours: order.status === 'done'       ? totalDays * 4         : 0,  sla_hours: 24 },
    ].map(t => ({
      ...t,
      status: (t.duration_hours === 0 ? 'on_track' : t.duration_hours > t.sla_hours * 1.2 ? 'over' : t.duration_hours < t.sla_hours * 0.8 ? 'under' : 'on_track') as 'over' | 'under' | 'on_track',
    }))

    // Activity log — nhiều event chi tiết để demo
    const events: { timestamp: string; actor: string; actor_role: 'designer' | 'orderer' | 'leader' | 'system'; action: string; note?: string }[] = []
    events.push({ timestamp: order.created_at, actor: ordererName_, actor_role: 'orderer', action: 'tạo order', note: order.brief?.slice(0, 100) })
    if (order.designer_id) {
      const assignAt = new Date(createdMs + 18 * 3600000).toISOString()
      events.push({ timestamp: assignAt, actor: 'Design Leader', actor_role: 'leader', action: `assign cho ${designerName_}` })
      events.push({ timestamp: new Date(createdMs + 24 * 3600000).toISOString(), actor: designerName_!, actor_role: 'designer', action: 'nhận task & bắt đầu làm' })
      if (order.last_checkin_at) {
        events.push({ timestamp: order.last_checkin_at, actor: designerName_!, actor_role: 'designer', action: 'check-in tiến độ' })
      }
    }
    if (order.milestone_progress >= 4) {
      const deliverAt = new Date(createdMs + totalDays * 86400000 * 0.6).toISOString()
      events.push({ timestamp: deliverAt, actor: designerName_ ?? '?', actor_role: 'designer', action: 'giao bản đầu', note: 'File Canva + 3 size export' })
    }
    for (let i = 1; i <= order.revision_count; i++) {
      const fbAt = new Date(createdMs + (totalDays * 0.6 + i) * 86400000).toISOString()
      events.push({ timestamp: fbAt, actor: ordererName_, actor_role: 'orderer', action: `gửi feedback vòng ${i}`, note: i === order.revision_count ? 'Logo chưa đúng vị trí, font chữ quote cần tăng lên 1pt' : 'Cần điều chỉnh tone màu nhạt hơn' })
      const revAt = new Date(new Date(fbAt).getTime() + 12 * 3600000).toISOString()
      events.push({ timestamp: revAt, actor: designerName_ ?? '?', actor_role: 'designer', action: `revise vòng ${i}` })
    }
    if (order.has_red_flag) {
      events.push({ timestamp: new Date(NOW_MS - 6 * 3600000).toISOString(), actor: 'System', actor_role: 'system', action: 'gắn cờ đỏ', note: `Vòng revise ${order.revision_count} ≥ 3 + trễ ${Math.abs(diffDays)} ngày` })
    }
    if (order.status === 'done') {
      events.push({ timestamp: order.updated_at, actor: ordererName_, actor_role: 'orderer', action: 'xác nhận hoàn thành ✓' })
    }

    const insights = {
      designer: {
        name: designerName_,
        initial: designerName_?.[0] ?? '?',
        grade: order.designer_id ? dm.grade : null,
        response_avg_hours: dm.resp,
        checkin_compliance: dm.checkin,
        revision_avg: dm.rev,
        ontime_rate: dm.ontime,
        tasks_done_30d: dm.done,
      },
      orderer: {
        name: ordererName_,
        team: teamName(order.team_id),
        brief_quality_score: om.brief,
        response_avg_hours: om.resp,
        revision_avg: om.rev,
        brief_returned: om.returned,
      },
      timing,
      activity: events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8),
    }

    const detail = {
      id: order.id,
      title: order.task_name,
      type: ptName(order.product_type_id),
      team: teamName(order.team_id),
      designer: designerName_,
      deadline: order.deadline,
      status: order.status === 'active' ? 'in_progress' : order.status,
      flag: (order.has_red_flag ? 'red' : order.has_warn_flag ? 'warn' : null) as 'red' | 'warn' | null,
      metrics: {
        rounds: order.revision_count,
        ontime,
        comms: events.length,
        briefCheck: (order.brief?.length ?? 0) >= 30,
      },
      redFlags: order.has_red_flag
        ? [`Vòng revise ${order.revision_count} (≥ 3)`, order.is_overdue ? `Trễ ${Math.abs(diffDays)} ngày so với deadline` : '', om.brief < 60 ? `Brief từ ${ordererName_} chất lượng thấp (${om.brief}/100)` : '']
            .filter(Boolean)
        : [],
      steps,
      deliveries: [],
      insights,
    }
    return HttpResponse.json({ data: detail })
  }),
  http.post('*/api/v1/orders',     async ({ request }) => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json({ data: { id: crypto.randomUUID(), status: 'pending' } }, { status: 201 })
  }),
]

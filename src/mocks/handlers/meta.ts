// src/mocks/handlers/meta.ts
import { http, HttpResponse } from 'msw'
import { getCurrentMockUserId, unauthorized } from '../config'

// Schema khớp với src/modules/order-form/types/order-form.types.ts:
//   ProductType { id, name, slug, standard_sizes: ProductSize[] }
//   ProductSize { name, width, height, unit, platform?, platform_color? }
const MOCK_PRODUCT_TYPES = [
  {
    id: 'pt-quote-square', name: 'Ảnh Quote / Hình vuông', slug: 'quote-square',
    standard_sizes: [
      { name: 'Instagram Feed',           width: 1200, height: 1200, unit: 'px', platform: 'Instagram',           platform_color: '#E1306C' },
      { name: 'LinkedIn / Facebook Post', width: 1200, height: 1200, unit: 'px', platform: 'LinkedIn / Facebook', platform_color: '#0A66C2' },
      { name: 'Pinterest Pin',            width: 1000, height: 1500, unit: 'px', platform: 'Pinterest',           platform_color: '#E60023' },
    ],
  },
  {
    id: 'pt-banner-cover', name: 'Banner / Cover', slug: 'banner-cover',
    standard_sizes: [
      { name: 'Facebook Cover',  width: 1640, height: 924,  unit: 'px', platform: 'Facebook', platform_color: '#1877F2' },
      { name: 'LinkedIn Cover',  width: 1584, height: 396,  unit: 'px', platform: 'LinkedIn', platform_color: '#0A66C2' },
      { name: 'YouTube Banner',  width: 2560, height: 1440, unit: 'px', platform: 'YouTube',  platform_color: '#FF0000' },
    ],
  },
  {
    id: 'pt-poster-doc', name: 'Poster / Dọc', slug: 'poster-doc',
    standard_sizes: [
      { name: 'Poster Dọc A3',   width: 297,  height: 420,  unit: 'mm', platform: 'Print',     platform_color: '#6B7280' },
      { name: 'Instagram Story', width: 1080, height: 1920, unit: 'px', platform: 'Instagram', platform_color: '#E1306C' },
      { name: 'TikTok Cover',    width: 1080, height: 1920, unit: 'px', platform: 'TikTok',    platform_color: '#010101' },
      { name: 'YouTube Shorts',  width: 1080, height: 1920, unit: 'px', platform: 'YouTube',   platform_color: '#FF0000' },
    ],
  },
  {
    id: 'pt-thumbnail', name: 'Thumbnail', slug: 'thumbnail',
    standard_sizes: [
      { name: 'YouTube Thumbnail',     width: 1280, height: 720,  unit: 'px', platform: 'YouTube', platform_color: '#FF0000' },
      { name: 'Reels / TikTok Cover',  width: 1080, height: 1920, unit: 'px', platform: 'TikTok',  platform_color: '#010101' },
    ],
  },
  {
    id: 'pt-mailing-list', name: 'Mailing List', slug: 'mailing-list',
    standard_sizes: [
      { name: 'Header Banner', width: 600, height: 200, unit: 'px', platform: 'Email', platform_color: '#2563EB' },
      { name: 'Full Template', width: 600, height: 800, unit: 'px', platform: 'Email', platform_color: '#2563EB' },
      { name: 'Section Block', width: 600, height: 300, unit: 'px', platform: 'Email', platform_color: '#2563EB' },
      { name: 'Footer Block',  width: 600, height: 250, unit: 'px', platform: 'Email', platform_color: '#2563EB' },
    ],
  },
  {
    id: 'pt-custom', name: 'Custom / Tuỳ chỉnh', slug: 'custom',
    standard_sizes: [
      { name: 'Custom / Khác', width: null, height: null, unit: null },
    ],
  },
]

export const metaHandlers = [
  http.get('*/api/meta/product-types', async () => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json({ data: MOCK_PRODUCT_TYPES })
  }),

  // Legacy v1
  http.get('*/api/v1/meta/product-types', async () => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json({ data: MOCK_PRODUCT_TYPES })
  }),
  http.get('*/api/v1/meta/teams', () => {
    return HttpResponse.json([
      { id: 'team-academy', name: 'Academy',       slug: 'academy' },
      { id: 'team-admin',   name: 'Admin',          slug: 'admin' },
      { id: 'team-design',  name: 'Design',         slug: 'design' },
      { id: 'team-edit',    name: 'Edit',           slug: 'edit' },
      { id: 'team-hr',      name: 'HR',             slug: 'hr' },
      { id: 'team-it',      name: 'IT',             slug: 'it' },
      { id: 'team-ndata',   name: 'N-Data',         slug: 'n-data' },
      { id: 'team-social',  name: 'Social Content', slug: 'social-content' },
      { id: 'team-nedu',    name: 'N-Education',    slug: 'n-education' },
    ])
  }),
  http.get('*/api/v1/me', async ({ request }) => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    const url  = new URL(request.url)
    const role = url.searchParams.get('role') ?? 'design_leader'
    const users: Record<string, object> = {
      design_leader: { id, email: 'design-leader-01@ndesign.nquoc.vn', display_name: 'Design Leader 01', role: 'design_leader', team: { id: 'team-design', name: 'Design', slug: 'design' }, is_active: true },
      co_leader:     { id, email: 'co-leader-01@ndesign.nquoc.vn',     display_name: 'Co-Leader 01',     role: 'co_leader',     team: { id: 'team-design', name: 'Design', slug: 'design' }, is_active: true },
      designer:      { id, email: 'designer-01@ndesign.nquoc.vn',      display_name: 'Designer 01',      role: 'designer',      team: { id: 'team-design', name: 'Design', slug: 'design' }, is_active: true },
      orderer:       { id, email: 'orderer-01@ndesign.nquoc.vn',       display_name: 'Orderer 01',       role: 'orderer',       team: { id: 'team-it',     name: 'IT',     slug: 'it'     }, is_active: true },
    }
    return HttpResponse.json(users[role] ?? users['design_leader'])
  }),
  http.get('*/api/v1/users/designers', async () => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json([
      { id: 'u-de-1', display_name: 'Lê Văn A',   role: 'designer', team_id: 'team-design' },
      { id: 'u-de-2', display_name: 'Trần Thị B', role: 'designer', team_id: 'team-design' },
      { id: 'u-de-3', display_name: 'Nguyễn C',   role: 'designer', team_id: 'team-design' },
    ])
  }),
  http.get('*/api/v1/users/orderers', async () => {
    const id = await getCurrentMockUserId()
    if (!id) return unauthorized()
    return HttpResponse.json([])
  }),
  http.get('*/health', () => HttpResponse.json({ status: 'ok' })),
]

// src/shared/constants/feature-flags.ts
export const FLAGS = {
  ENABLE_AI_MOODBOARD:  true,   // POST /api/orders/:id/moodboard
  ENABLE_ANALYTICS:     true,   // GET  /api/analytics
  ENABLE_NOTIFICATIONS: true,   // GET  /api/notifications
  ENABLE_MEDIA_UPLOAD:  true,   // POST /api/media/upload-url
} as const

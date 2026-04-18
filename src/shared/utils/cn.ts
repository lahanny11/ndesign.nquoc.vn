// src/shared/utils/cn.ts
// Utility kết hợp class names (tương tự clsx/cx)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

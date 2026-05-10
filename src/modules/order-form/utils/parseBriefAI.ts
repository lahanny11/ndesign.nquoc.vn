// src/modules/order-form/utils/parseBriefAI.ts
// AI brief parser — production sẽ thay bằng Claude API call.
// Hiện tại dùng heuristic regex để demo flow.
//
// Backend production sẽ gọi:
//   const result = await claude.messages.create({
//     model: 'claude-sonnet-4',
//     max_tokens: 1500,
//     messages: [{ role: 'user', content: BRIEF_PARSE_PROMPT + raw_text }]
//   })
//
// Ngày backend ready: thay parseBriefAIMock() bằng API call.

export interface ParsedBriefSlide {
  n: number
  title: string
  quote?: string
  caption?: string
  timing?: string
  note?: string
}

export interface ParsedBrief {
  purpose?: string
  audience?: string
  style?: string
  slides?: ParsedBriefSlide[]
  extras?: { label: string; value: string }[]
  raw_text?: string
}

// ─── Mock heuristic parser ───────────────────────────────────────────────────
const SECTION_PATTERNS: Array<{ key: keyof ParsedBrief; regex: RegExp }> = [
  { key: 'purpose',  regex: /(?:^|\n)\s*(?:\d+\.\s*)?(?:MỤC\s*ĐÍCH|Mục\s*đích|PURPOSE|Goal)\s*[:\-]?\s*([\s\S]*?)(?=\n\s*(?:\d+\.\s*)?(?:ĐỐI\s*TƯỢNG|Đối\s*tượng|AUDIENCE|PHONG\s*CÁCH|Phong\s*cách|STYLE|NỘI\s*DUNG|Nội\s*dung|CONTENT|$))/i },
  { key: 'audience', regex: /(?:^|\n)\s*(?:\d+\.\s*)?(?:ĐỐI\s*TƯỢNG|Đối\s*tượng|AUDIENCE|Target)\s*[:\-]?\s*([\s\S]*?)(?=\n\s*(?:\d+\.\s*)?(?:PHONG\s*CÁCH|Phong\s*cách|STYLE|NỘI\s*DUNG|Nội\s*dung|CONTENT|$))/i },
  { key: 'style',    regex: /(?:^|\n)\s*(?:\d+\.\s*)?(?:PHONG\s*CÁCH|Phong\s*cách|STYLE|Tone)\s*[:\-]?\s*([\s\S]*?)(?=\n\s*(?:\d+\.\s*)?(?:NỘI\s*DUNG|Nội\s*dung|CONTENT|$))/i },
]

const SLIDE_REGEX = /SLIDE\s*(\d+)\s*[—\-:]?\s*([^\n]*)\n([\s\S]*?)(?=\nSLIDE\s*\d+|$)/gi
const TIMING_REGEX = /\[(\d{1,2}:\d{2})\]\s*[—\-]\s*\[(\d{1,2}:\d{2})\]/
const QUOTE_REGEX  = /(?:Quote|"([^"]+)")\s*[:\-]?\s*"?([^"\n]+)"?/i

function extractSection(text: string, regex: RegExp): string | undefined {
  const m = text.match(regex)
  return m?.[1]?.trim().replace(/^[\.\-:]\s*/, '') || undefined
}

function extractSlides(text: string): ParsedBriefSlide[] {
  const slides: ParsedBriefSlide[] = []
  let m: RegExpExecArray | null
  // Reset regex state
  SLIDE_REGEX.lastIndex = 0
  while ((m = SLIDE_REGEX.exec(text)) !== null) {
    const n = parseInt(m[1], 10)
    const titleLine = m[2].trim().replace(/^[—\-:]\s*/, '')
    const body = m[3].trim()

    const timingMatch = body.match(TIMING_REGEX)
    const timing = timingMatch ? `${timingMatch[1]} - ${timingMatch[2]}` : undefined

    const quoteMatch = body.match(/Quote\s*[:\-]?\s*["""]?([\s\S]+?)["""]?(?:\s*[;.]\s*(?:Caption|Đoạn|$)|\n|$)/i)
    const quote = quoteMatch?.[1]?.trim()

    const captionMatch = body.match(/Caption\s*[:\-—]?\s*([^\n]+)/i)
    const caption = captionMatch?.[1]?.trim()

    slides.push({
      n,
      title: titleLine || `Slide ${n}`,
      quote,
      caption,
      timing,
      note: !quote && !caption ? body.slice(0, 200) : undefined,
    })
  }
  return slides
}

/**
 * Mock AI brief parser — heuristic regex extraction.
 * Production sẽ thay bằng Claude API call với prompt đã thiết kế.
 *
 * @param rawText — toàn bộ brief text từ orderer
 * @returns ParsedBrief — structured fields hoặc raw_text fallback
 */
export function parseBriefAIMock(rawText: string): ParsedBrief {
  if (!rawText || rawText.length < 30) {
    return { raw_text: rawText }
  }

  const result: ParsedBrief = {}

  // Extract main sections
  for (const { key, regex } of SECTION_PATTERNS) {
    const value = extractSection(rawText, regex)
    if (value && value.length > 5) {
      // @ts-expect-error — dynamic key assignment
      result[key] = value.length > 500 ? value.slice(0, 500) + '…' : value
    }
  }

  // Extract slides if present
  const slides = extractSlides(rawText)
  if (slides.length > 0) {
    result.slides = slides
  }

  // If nothing parsed → fallback raw_text
  const hasAny = result.purpose || result.audience || result.style || (result.slides?.length ?? 0) > 0
  if (!hasAny) {
    return { raw_text: rawText }
  }

  return result
}

/**
 * Simulated network delay — để UI có thời gian show "AI đang phân tích...".
 * Production: replace với actual Claude API call (~2-5s).
 */
export async function parseBriefAI(rawText: string): Promise<ParsedBrief> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1200))
  return parseBriefAIMock(rawText)
}

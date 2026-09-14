'use client'

import { useI18n } from './I18nProvider'

/**
 * Artistic name display for the hero section.
 *
 * Design principles:
 *  - Break alignment: characters stagger vertically with mixed sizes & rotation
 *  - Texture overlay: ink-bleed text-shadow + paper grain via SVG filter
 *  - Whitespace: generous padding so the name can breathe
 *
 * Chinese: 白鸽手书 / LXGW WenKai fallback — each char is an independent span.
 * English: Cormorant Garamond italic serif.
 */

const FONT_ZH = '"BaigeShoushu", "LXGW WenKai", "STKaiti", "KaiTi", "楷体", cursive'

interface CharStyle {
  size: string
  offset: number
  rotate: number
}

const ZH_CHARS: CharStyle[] = [
  { size: '1.12em', offset: -0.06, rotate: -3 },
  { size: '0.92em', offset: 0.08, rotate: 2 }
]

export default function ArtisticName (): JSX.Element {
  const { lang, t } = useI18n()
  const name = t('hero_name')

  if (lang === 'zh') {
    const chars = Array.from(name)
    return (
      <div className="artistic-name-wrap" aria-label={name}>
        <h1
          className="artistic-name text-warm-900 dark:text-warm-50"
          style={{ fontFamily: FONT_ZH }}
        >
          {chars.map((ch, i) => {
            const st = ZH_CHARS[i % ZH_CHARS.length]
            return (
              <span
                key={i}
                className="artistic-char"
                style={{
                  fontSize: st.size,
                  transform: `translateY(${st.offset}em) rotate(${st.rotate}deg)`
                }}
              >
                {ch}
              </span>
            )
          })}
        </h1>
      </div>
    )
  }

  return (
    <div className="artistic-name-wrap" aria-label={name}>
      <h1
        className="artistic-name artistic-name-en text-warm-900 dark:text-warm-50"
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 600
        }}
      >
        {name}
      </h1>
    </div>
  )
}

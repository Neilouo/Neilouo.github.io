'use client'

import { useI18n } from './I18nProvider'

/**
 * Artistic name display for the hero section.
 * Chinese: 马善政 brush calligraphy font, wide letter-spacing.
 * English: Cormorant Garamond italic serif, elegant tracking.
 */
export default function ArtisticName (): JSX.Element {
  const { lang, t } = useI18n()
  const name = t('hero_name')

  if (lang === 'zh') {
    return (
      <h1
        className="text-warm-900 dark:text-warm-50"
        style={{
          fontFamily: '"Ma Shan Zheng", "STKaiti", "KaiTi", cursive',
          fontSize: 'clamp(3.5rem, 9vw, 6.5rem)',
          letterSpacing: '0.3em',
          fontWeight: 400,
          lineHeight: 1.2,
          marginRight: '-0.3em'
        }}
      >
        {name}
      </h1>
    )
  }

  return (
    <h1
      className="text-warm-900 dark:text-warm-50"
      style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: 'clamp(2.5rem, 7vw, 5rem)',
        letterSpacing: '0.04em',
        fontWeight: 600,
        fontStyle: 'italic',
        lineHeight: 1.2
      }}
    >
      {name}
    </h1>
  )
}

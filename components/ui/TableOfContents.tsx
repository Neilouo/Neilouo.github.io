import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../I18nProvider'

interface TocItem {
  id: string
  labelKey: string
}

const sections: TocItem[] = [
  { id: 'work-experience', labelKey: 'work_experience' },
  { id: 'research', labelKey: 'research' },
  { id: 'developer-profile', labelKey: 'developer_profile' },
  { id: 'tech-stack', labelKey: 'tech_stack' },
  { id: 'resume', labelKey: 'resume' },
  { id: 'contact', labelKey: 'contact' }
]

export default function TableOfContents (): JSX.Element {
  const { t } = useI18n()
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const visibleMap = new Map<string, number>()

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el == null) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleMap.set(s.id, entry.intersectionRatio)
            } else {
              visibleMap.delete(s.id)
            }
          })
          let best: string | null = null
          let bestRatio = 0
          visibleMap.forEach((ratio, id) => {
            if (ratio > bestRatio) {
              bestRatio = ratio
              best = id
            }
          })
          if (best != null) {
            setActiveId(best)
          }
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav className="hidden lg:block" aria-label={t('toc_title')}>
      <p className="text-xs font-medium text-warm-400 dark:text-warm-500 uppercase tracking-[0.15em] mb-4">
        {t('toc_title')}
      </p>
      <ul className="space-y-1 border-l border-warm-100 dark:border-warm-800">
        {sections.map((s) => {
          const isActive = activeId === s.id
          return (
            <li key={s.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-active-indicator"
                  className="absolute -left-px top-0 bottom-0 w-[2px] rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <a
                href={`#${s.id}`}
                className={`block pl-4 py-1.5 text-sm transition-colors duration-200 ${
                  isActive
                    ? 'text-accent font-medium'
                    : 'text-warm-500 dark:text-warm-400 hover:text-warm-800 dark:hover:text-warm-200'
                }`}
              >
                {t(s.labelKey)}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

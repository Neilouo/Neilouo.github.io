import React, { useEffect, useRef, useState } from 'react'
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

/** Scroll margin must match the scroll-mt-* class on each section. */
const SCROLL_MARGIN = 96

export default function TableOfContents (): JSX.Element {
  const { t } = useI18n()
  const [activeId, setActiveId] = useState<string>('')
  const lockRef = useRef<number>(0)

  useEffect(() => {
    // If the page loaded with a hash (e.g. /about#resume), lock that section
    const hash = window.location.hash.replace('#', '')
    if (hash !== '' && sections.some((s) => s.id === hash)) {
      setActiveId(hash)
      lockRef.current = Date.now() + 1500
    }

    const updateActive = (): void => {
      if (Date.now() < lockRef.current) return
      const scrollBottom = window.scrollY + window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      if (docHeight - scrollBottom < 120) {
        setActiveId(sections[sections.length - 1].id)
        return
      }
      let current = ''
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el == null) continue
        if (el.getBoundingClientRect().top <= SCROLL_MARGIN + 4) {
          current = s.id
        }
      }
      // Last section is too short to cross the reading line;
      // if its top is past the viewport midpoint, prefer it over the previous section.
      if (current === sections[sections.length - 2]?.id) {
        const lastEl = document.getElementById(sections[sections.length - 1].id)
        if (lastEl != null && lastEl.getBoundingClientRect().top < window.innerHeight / 2) {
          current = sections[sections.length - 1].id
        }
      }
      setActiveId(current)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [])

  const handleClick = (id: string): void => {
    setActiveId(id)
    lockRef.current = Date.now() + 1200
  }

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
                onClick={() => handleClick(s.id)}
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

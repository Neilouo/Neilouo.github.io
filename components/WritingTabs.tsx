'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { T } from './I18nProvider'

const TABS = [
  { href: '/ai-radar', key: 'ai_radar' },
  { href: '/note', key: 'notes' },
  { href: '/blog', key: 'blog' },
]

export default function WritingTabs (): JSX.Element {
  const router = useRouter()
  const current = router.pathname

  return (
    <div className="mb-8 border-b border-warm-200 dark:border-warm-800">
      <nav className="-mb-px flex flex-wrap gap-4">
        {TABS.map((tab) => {
          const active = current === tab.href || current.startsWith(`${tab.href}/`)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 pb-2 text-sm border-b-2 transition-colors ${
                active
                  ? 'border-accent text-accent'
                  : 'border-transparent text-warm-500 dark:text-warm-400 hover:text-warm-900 dark:hover:text-warm-100 hover:border-warm-300 dark:hover:border-warm-600'
              }`}
            >
              <T k={tab.key} />
            </Link>
          )
        })}
      </nav>
    </div>
  )
}


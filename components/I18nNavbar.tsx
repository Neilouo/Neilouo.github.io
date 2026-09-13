'use client'

import React from 'react'
import { Navbar as DefaultNavbar } from 'nextra-theme-docs'
import { useI18n } from './I18nProvider'

/**
 * Wraps Nextra's default Navbar so that top-level nav item titles
 * respond to the custom i18n language toggle.
 *
 * Nextra renders `page.title` from `pages/_meta.ts` as plain strings.
 * We intercept the `items` prop and replace each title with a translated
 * version based on the current language from our i18n context.
 */

const TITLE_MAP: Record<string, { zh: string, en: string }> = {
  index: { zh: '首页', en: 'Home' },
  'ai-radar': { zh: 'AI 动态', en: 'AI Radar' },
  blog: { zh: '博客', en: 'Writing' },
  note: { zh: '笔记', en: 'Notes' },
  projects: { zh: '项目', en: 'Projects' },
  about: { zh: '关于', en: 'About' }
}

export default function I18nNavbar ({ items, ...props }: any): JSX.Element {
  const { lang } = useI18n()

  const translatedItems = items.map((item: any) => {
    const key = item.route?.replace(/^\//, '') || item.name || ''
    const translations = TITLE_MAP[key]
    if (translations != null) {
      return { ...item, title: translations[lang] }
    }
    return item
  })

  return <DefaultNavbar {...props} items={translatedItems} />
}

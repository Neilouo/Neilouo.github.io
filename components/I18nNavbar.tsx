'use client'

import React from 'react'
import { Navbar as DefaultNavbar } from 'nextra-theme-docs'
import { useI18n } from './I18nProvider'

interface NavItem {
  route?: string
  name?: string
  title?: string
  [key: string]: unknown
}

interface NavbarProps {
  items: NavItem[]
  [key: string]: unknown
}

const ROUTE_TO_KEY: Record<string, string> = {
  '': 'nav_index',
  'ai-radar': 'nav_ai_radar',
  blog: 'nav_blog',
  note: 'nav_note',
  projects: 'nav_projects',
  about: 'nav_about'
}

export default function I18nNavbar ({ items, ...props }: NavbarProps): JSX.Element {
  const { t } = useI18n()

  const translatedItems = items.map((item: NavItem) => {
    const key = item.route?.replace(/^\//, '') || ''
    const dictKey = ROUTE_TO_KEY[key]
    if (dictKey != null) {
      return { ...item, title: t(dictKey) }
    }
    return item
  })

  return <DefaultNavbar {...props} items={translatedItems as never} />
}

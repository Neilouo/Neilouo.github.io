'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { dictionaries, type Language } from '../lib/i18n'

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export const I18nProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [lang, setLangState] = useState<Language>('zh')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('lang') as Language | null
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved)
      document.documentElement.lang = saved
    } else {
      const browserLang = navigator.language?.toLowerCase()
      const detected: Language = browserLang.startsWith('zh') ? 'zh' : 'en'
      setLangState(detected)
      document.documentElement.lang = detected
    }
  }, [])

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', nextLang)
      document.documentElement.lang = nextLang
    }
  }, [])

  const t = useCallback((key: string) => {
    return dictionaries[lang][key] || key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export const T = ({ k }: { k: string }): JSX.Element => {
  const { t } = useI18n()
  return <>{t(k)}</>
}

export const LangToggle = (): JSX.Element => {
  const { lang, setLang } = useI18n()
  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className={'px-3 py-1 rounded-full text-xs md:text-sm bg-warm-100 dark:bg-warm-800 hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors'}
      aria-label={lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      {lang === 'zh' ? '中文/English' : 'English/中文'}
    </button>
  )
}

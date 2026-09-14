'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useI18n } from './I18nProvider'
import { Github } from 'lucide-react'
import { fetchGitHubLanguages, LanguageData } from '../utils/githubLanguages'
import { useCountUp } from '../hooks/useCountUp'

const LANG_META: Record<string, { icon?: string, color: string, bgColor: string, gradient: string }> = {
  TypeScript: { icon: '/stack/typescript.svg', color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', gradient: 'from-blue-500 to-cyan-400' },
  JavaScript: { icon: '/stack/JavaScript.svg', color: 'bg-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20', gradient: 'from-amber-500 to-yellow-400' },
  Python: { icon: '/stack/python.svg', color: 'bg-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', gradient: 'from-emerald-500 to-teal-400' },
  Java: { icon: '/stack/java.svg', color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', gradient: 'from-orange-500 to-red-400' },
  Go: { color: 'bg-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20', gradient: 'from-cyan-500 to-sky-400' },
  HTML: { icon: '/stack/html.svg', color: 'bg-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', gradient: 'from-red-500 to-orange-400' },
  CSS: { icon: '/stack/css.svg', color: 'bg-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', gradient: 'from-blue-400 to-indigo-400' },
  SCSS: { icon: '/stack/scss.svg', color: 'bg-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20', gradient: 'from-pink-500 to-rose-400' },
  Vue: { icon: '/stack/Vue.svg', color: 'bg-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', gradient: 'from-emerald-400 to-green-400' },
  Shell: { color: 'bg-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20', gradient: 'from-gray-500 to-slate-400' },
  Rust: { color: 'bg-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-900/20', gradient: 'from-orange-400 to-amber-400' },
  'C++': { color: 'bg-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20', gradient: 'from-blue-600 to-indigo-500' },
  C: { color: 'bg-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20', gradient: 'from-gray-600 to-slate-500' },
  PHP: { color: 'bg-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', gradient: 'from-indigo-500 to-purple-400' },
  Ruby: { color: 'bg-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20', gradient: 'from-red-600 to-pink-400' },
  Swift: { color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', gradient: 'from-orange-500 to-amber-400' },
  Kotlin: { color: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', gradient: 'from-purple-500 to-violet-400' },
  Dart: { color: 'bg-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20', gradient: 'from-cyan-400 to-teal-400' },
  Jupyter: { color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', gradient: 'from-orange-500 to-amber-400' }
}

const DEFAULT_META = { color: 'bg-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20', gradient: 'from-gray-500 to-slate-400' }

function getLangMeta (name: string) {
  return LANG_META[name] || DEFAULT_META
}

function LanguageIcon ({ name, size = 20 }: { name: string, size?: number }) {
  const meta = getLangMeta(name)
  if (meta.icon) {
    return <img src={meta.icon} alt={name} className="w-5 h-5 object-contain" style={{ width: size, height: size }} />
  }
  if (name === 'Go') {
    return (
      <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30">
        Go
      </span>
    )
  }
  if (name === 'Shell') {
    return (
      <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30">
        $_
      </span>
    )
  }
  return (
    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${meta.color}`}>
      {name[0]}
    </span>
  )
}

function SkillBar ({ lang, index, active }: { lang: LanguageData, index: number, active: boolean }) {
  const meta = getLangMeta(lang.name)
  const count = useCountUp(lang.percentage, 1000 + index * 100, active)

  return (
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bgColor}`}>
        <LanguageIcon name={lang.name} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-warm-800 dark:text-warm-100">{lang.name}</span>
          <span className="text-sm font-bold tabular-nums bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent">
            {count}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-warm-100 dark:bg-warm-800 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-1000 ease-out`}
            style={{ width: active ? `${lang.percentage}%` : '0%', transitionDelay: `${index * 80}ms` }}
          />
        </div>
      </div>
    </div>
  )
}

function Skeleton () {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-warm-100 dark:bg-warm-800 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-16 rounded bg-warm-100 dark:bg-warm-800 animate-pulse" />
            <div className="h-2 rounded-full bg-warm-100 dark:bg-warm-800 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LanguageSkills () {
  const { t } = useI18n()
  const [data, setData] = useState<LanguageData[] | null>(null)
  const [source, setSource] = useState<'github' | 'fallback'>('fallback')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    let cancelled = false
    const load = async (): Promise<void> => {
      const { languages, source: src } = await fetchGitHubLanguages()
      if (cancelled) return
      setData(languages)
      setSource(src)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  return (
    <div ref={ref} className="rounded-card border border-warm-100 dark:border-warm-800 bg-white/80 dark:bg-warm-950/80 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-accent uppercase tracking-wider">
          {t('language_skills')}
        </span>
        {data != null && source === 'github' && (
          <span className="inline-flex items-center gap-1 text-[10px] text-warm-400 dark:text-warm-500">
            <Github className="w-3 h-3" />
            GitHub
          </span>
        )}
      </div>

      {data == null
        ? <Skeleton />
        : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {data.map((lang, i) => (
            <SkillBar key={lang.name} lang={lang} index={i} active={inView} />
          ))}
        </div>
      )}
    </div>
  )
}

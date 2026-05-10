'use client'

import React, { useEffect, useState } from 'react'
import { useI18n } from './I18nProvider'
import { Github } from 'lucide-react'

interface LanguageData {
  name: string
  bytes: number
  percentage: number
}

interface ApiResponse {
  languages: LanguageData[]
  source: 'github' | 'fallback'
}

const LANG_META: Record<string, { icon?: string, color: string, bgColor: string }> = {
  TypeScript: { icon: '/stack/typescript.svg', color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  JavaScript: { icon: '/stack/JavaScript.svg', color: 'bg-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  Python: { icon: '/stack/python.svg', color: 'bg-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  Java: { icon: '/stack/java.svg', color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  Go: { color: 'bg-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20' },
  HTML: { icon: '/stack/html.svg', color: 'bg-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  CSS: { icon: '/stack/css.svg', color: 'bg-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  SCSS: { icon: '/stack/scss.svg', color: 'bg-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  Vue: { icon: '/stack/Vue.svg', color: 'bg-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  Shell: { color: 'bg-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20' },
  Rust: { color: 'bg-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  'C++': { color: 'bg-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  C: { color: 'bg-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20' },
  PHP: { color: 'bg-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
  Ruby: { color: 'bg-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  Swift: { color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  Kotlin: { color: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  Dart: { color: 'bg-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20' },
  Jupyter: { color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
}

const DEFAULT_META = { color: 'bg-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20' }

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
  // First letter fallback
  return (
    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${meta.color}`}>
      {name[0]}
    </span>
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
            <div className="h-1.5 rounded-full bg-warm-100 dark:bg-warm-800 animate-pulse" />
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

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const res = await fetch('/api/github-languages')
        const json: ApiResponse = await res.json()
        setData(json.languages)
        setSource(json.source)
      } catch {
        // Silently fail — skeleton stays
      }
    }
    void load()
  }, [])

  return (
    <div className="rounded-card border border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-950 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-accent uppercase tracking-wider">
          {t('language_skills')}
        </span>
        {data && source === 'github' && (
          <span className="inline-flex items-center gap-1 text-[10px] text-warm-400 dark:text-warm-500">
            <Github className="w-3 h-3" />
            GitHub
          </span>
        )}
      </div>

      {!data
        ? <Skeleton />
        : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {data.map((lang) => {
            const meta = getLangMeta(lang.name)
            return (
              <div key={lang.name} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bgColor}`}>
                  <LanguageIcon name={lang.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-warm-800 dark:text-warm-100">{lang.name}</span>
                    <span className="text-[10px] text-warm-400 dark:text-warm-500 tabular-nums">{lang.percentage}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-warm-100 dark:bg-warm-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${meta.color}`}
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

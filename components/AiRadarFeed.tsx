'use client'

import React, { useEffect, useState } from 'react'
import { FiExternalLink, FiFileText, FiRadio } from 'react-icons/fi'
import { useI18n } from './I18nProvider'

export interface AiRadarItem {
  type: 'paper' | 'news'
  title: string
  summary: string
  authors: string[]
  affiliations: string[]
  primaryArea: string
  tags: string[]
  url: string
  source: string
  publishedAt: string
}

export interface AiRadarDay {
  date: string
  items: AiRadarItem[]
}

const TYPE_FILTER = ['all', 'paper', 'news'] as const

function getYesterdayISO (): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

/** 生成最近 N 天的日期列表（含昨天），用于依次尝试拉取 */
function getRecentDates (days = 5): string[] {
  const out: string[] = []
  const d = new Date()
  for (let i = 0; i < days; i++) {
    d.setDate(d.getDate() - 1)
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

export default function AiRadarFeed () {
  const { t } = useI18n()
  const [data, setData] = useState<AiRadarDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateLabel, setDateLabel] = useState('')
  const [isSampleData, setIsSampleData] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'paper' | 'news'>('all')

  useEffect(() => {
    const load = async () => {
      try {
        const datesToTry = getRecentDates(5)
        let res: Response | null = null
        let usedDate = ''
        for (const date of datesToTry) {
          res = await fetch(`/ai-daily/${date}.json`)
          if (res.ok) {
            usedDate = date
            break
          }
        }
        if (!res?.ok) {
          res = await fetch('/ai-daily/sample.json')
          if (res.ok) setIsSampleData(true)
        }
        if (!res?.ok) throw new Error('No data')
        const json: AiRadarDay = await res.json()
        setData(json)
        setDateLabel(usedDate || json.date)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'ai_radar_load_failed')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-warm-200 dark:bg-warm-700" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-card border border-warm-200 dark:border-warm-700 bg-warm-50 dark:bg-warm-900" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-card border border-warm-200 dark:border-warm-700 bg-warm-50 dark:bg-warm-900 p-6 text-center text-warm-600 dark:text-warm-400">
        {error === 'ai_radar_load_failed' ? t('ai_radar_load_failed') : error || t('ai_radar_no_data')}
      </div>
    )
  }

  const filtered = data.items.filter((item) => {
    if (typeFilter === 'all') return true
    return item.type === typeFilter
  })

  const byArea = filtered.reduce<Record<string, AiRadarItem[]>>((acc, item) => {
    const area = item.primaryArea || t('other_area')
    if (!acc[area]) acc[area] = []
    acc[area].push(item)
    return acc
  }, {})

  const areas = Object.keys(byArea).sort()

  return (
    <div className="space-y-8">
      {isSampleData && (
        <div className="rounded-card border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-200">
          {t('ai_radar_sample_notice')}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-warm-500 dark:text-warm-400">
          {dateLabel} · {t('ai_radar_count').replace('%s', String(filtered.length))}
        </span>
        <div className="flex gap-2">
          {TYPE_FILTER.map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                typeFilter === f
                  ? 'bg-accent text-white'
                  : 'bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700'
              }`}
            >
              {f === 'all' ? t('ai_radar_all') : f === 'paper' ? t('ai_radar_paper') : t('ai_radar_news')}
            </button>
          ))}
        </div>
      </div>

      {areas.length === 0
        ? (
            <div className="rounded-card border border-warm-200 dark:border-warm-700 bg-warm-50 dark:bg-warm-900 p-6 text-center text-warm-500 dark:text-warm-400">
              {t('ai_radar_no_content')}
            </div>
          )
        : (
            <div className="space-y-10">
              {areas.map((area) => (
            <section key={area}>
              <h2 className="mb-4 text-lg font-semibold text-warm-800 dark:text-warm-200">
                {area}
              </h2>
              <ul className="space-y-4">
                {byArea[area].map((item, i) => (
                  <li key={`${area}-${i}`}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group block rounded-card border border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-950 p-4 transition-colors hover:border-accent/30 dark:hover:border-accent/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${
                                item.type === 'paper'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              }`}
                            >
                              {item.type === 'paper'
                                ? (
                                    <><FiFileText className="w-3.5 h-3.5" /> {t('ai_radar_type_paper')}</>
                                  )
                                : (
                                    <><FiRadio className="w-3.5 h-3.5" /> {t('ai_radar_type_news')}</>
                                  )}
                            </span>
                            <span className="text-xs text-warm-400 dark:text-warm-500">
                              {item.source}
                            </span>
                          </div>
                          <h3 className="mt-2 font-medium text-warm-900 dark:text-warm-50 group-hover:text-accent line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-sm text-warm-600 dark:text-warm-400">
                            {item.summary}
                          </p>
                          {(item.authors?.length > 0 || item.affiliations?.length > 0) && (
                            <p className="mt-2 text-xs text-warm-500 dark:text-warm-500">
                              {item.authors?.length ? item.authors.slice(0, 3).join(' · ') : ''}
                              {item.affiliations?.length ? ` · ${item.affiliations.slice(0, 2).join(', ')}` : ''}
                            </p>
                          )}
                        </div>
                        <FiExternalLink className="w-4 h-4 flex-shrink-0 text-warm-400 group-hover:text-accent transition-colors mt-1" />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
              ))}
            </div>
          )}
    </div>
  )
}

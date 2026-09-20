'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiArrowUpRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useI18n } from './I18nProvider'
import { stagger, item } from '../lib/motion'
import {
  externalArticles as sampleArticles,
  sourceMeta,
  type ExternalArticle
} from '../data/externalArticles'

interface LatestWritingProps {
  limit?: number
}

/**
 * Home-page "Latest Writing" — editorial index style.
 * Serif display titles, airy rows, no card boxes: the magazine counterpart
 * to the sans/mono project grid above it.
 */
export default function LatestWriting ({ limit = 3 }: LatestWritingProps): JSX.Element {
  const { t, lang } = useI18n()
  const [articles, setArticles] = useState<ExternalArticle[]>(sampleArticles)

  useEffect(() => {
    const controller = new AbortController()
    const load = async (): Promise<void> => {
      try {
        const response = await fetch('/external-posts.json', { signal: controller.signal })
        if (!response.ok) return
        const data = await response.json()
        if (!controller.signal.aborted && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles)
        }
      } catch {
        /* keep sample fallback */
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  const latest = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)

  if (latest.length === 0) {
    return <p className="text-sm text-warm-500 dark:text-warm-400 py-6">{t('writing_empty')}</p>
  }

  return (
    <motion.div {...stagger} className="border-t border-warm-100 dark:border-warm-800">
      {latest.map((article) => {
        const meta = sourceMeta[article.source]
        const date = new Date(article.publishedAt).toLocaleDateString(
          lang === 'zh' ? 'zh-CN' : 'en-US',
          { year: 'numeric', month: 'short', day: 'numeric' }
        )
        return (
          <motion.div key={article.id} {...item}>
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-6 py-6 border-b border-warm-100 dark:border-warm-800"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.text}`}>
                    {meta.name}
                  </span>
                  <span className="text-xs text-warm-400 dark:text-warm-500 tabular-nums tracking-wide">
                    {date}
                  </span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-warm-900 dark:text-warm-50 group-hover:text-accent dark:group-hover:text-accent transition-colors leading-snug tracking-tight">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-warm-500 dark:text-warm-400 leading-relaxed line-clamp-2 md:line-clamp-1 max-w-2xl">
                  {article.summary}
                </p>
              </div>
              <span className="mt-2 flex-shrink-0 w-9 h-9 rounded-full border border-warm-200 dark:border-warm-700 flex items-center justify-center text-warm-400 dark:text-warm-500 group-hover:border-accent group-hover:text-accent group-hover:bg-accent/5 transition-all">
                <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

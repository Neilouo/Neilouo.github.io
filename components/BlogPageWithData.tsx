import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Filter, Clock, Flame } from 'lucide-react'
import { useI18n } from './I18nProvider'
import {
  externalArticles as sampleArticles,
  sourceMeta,
  type ExternalArticle,
  type ExternalSource
} from '../data/externalArticles'

type SortMode = 'latest' | 'popular'

const parseViewCount = (views?: string): number => {
  if (!views) return 0
  const cleaned = views.replace(/,/g, '').trim().toLowerCase()
  if (cleaned.endsWith('k')) return parseFloat(cleaned) * 1000
  if (cleaned.endsWith('w') || cleaned.endsWith('万')) return parseFloat(cleaned) * 10000
  return parseFloat(cleaned) || 0
}

const BlogPageWithData: React.FC = () => {
  const { t, lang } = useI18n()
  const [activeSource, setActiveSource] = useState<ExternalSource | 'all'>('all')
  const [sortMode, setSortMode] = useState<SortMode>('latest')
  const [articles, setArticles] = useState<ExternalArticle[]>(sampleArticles)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const load = async (): Promise<void> => {
      try {
        const response = await fetch('/external-posts.json', { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Unexpected status ${response.status}`)
        }
        const data = await response.json()
        if (!controller.signal.aborted && Array.isArray(data.articles)) {
          setArticles(data.articles)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(t('external_unavailable'))
          setArticles(sampleArticles)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [t])

  const availableSources = useMemo(() => {
    return articles.reduce<Record<ExternalSource, number>>((acc, item) => {
      acc[item.source] = (acc[item.source] ?? 0) + 1
      return acc
    }, { csdn: 0, juejin: 0, cnblogs: 0, stackoverflow: 0, notion: 0 })
  }, [articles])

  const filteredArticles = useMemo(() => {
    const filtered = activeSource === 'all'
      ? [...articles]
      : articles.filter((article) => article.source === activeSource)

    if (sortMode === 'popular') {
      return filtered.sort((a, b) => {
        const scoreA = parseViewCount(a.stats?.views) + parseViewCount(a.stats?.likes) * 10
        const scoreB = parseViewCount(b.stats?.views) + parseViewCount(b.stats?.likes) * 10
        return scoreB - scoreA
      })
    }
    return filtered.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  }, [activeSource, articles, sortMode])

  const pillBase = 'rounded-full px-3 py-1 text-xs font-medium transition-colors'
  const pillActive = 'bg-warm-900 text-white dark:bg-warm-100 dark:text-warm-900'
  const pillIdle = 'bg-white/60 text-warm-500 hover:bg-warm-100 dark:bg-warm-800/60 dark:text-warm-300 dark:hover:bg-warm-800'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-warm-400 dark:text-warm-500">
            {t('external_feed')}
          </p>
          <h3 className="text-left font-display text-2xl font-semibold text-warm-900 dark:text-warm-50 tracking-tight">
            {t('external_articles')}
          </h3>
          {error && <p className="mt-2 text-xs text-amber-500">{error}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center rounded-full border border-warm-200 px-3 py-1 text-warm-500 dark:border-warm-700 dark:text-warm-400">
              <Filter className="mr-1 h-3.5 w-3.5" />{t('filter_source')}
            </span>
            <button
              onClick={() => setActiveSource('all')}
              className={`${pillBase} ${activeSource === 'all' ? pillActive : pillIdle}`}
            >
              {t('all')}
            </button>
            {(Object.keys(sourceMeta) as ExternalSource[]).map((source) => (
              <button
                key={source}
                onClick={() => setActiveSource(source)}
                disabled={!availableSources[source]}
                className={`${pillBase} ${
                  activeSource === source
                    ? `${sourceMeta[source].accent}`
                    : `${sourceMeta[source].text} opacity-70 hover:opacity-100`
                } ${!availableSources[source] ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {sourceMeta[source].name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSortMode('latest')}
              className={`inline-flex items-center gap-1 ${pillBase} ${sortMode === 'latest' ? pillActive : pillIdle}`}
            >
              <Clock className="h-3 w-3" />{t('latest')}
            </button>
            <button
              onClick={() => setSortMode('popular')}
              className={`inline-flex items-center gap-1 ${pillBase} ${sortMode === 'popular' ? pillActive : pillIdle}`}
            >
              <Flame className="h-3 w-3" />{t('popular')}
            </button>
          </div>
        </div>
      </div>

      {loading
        ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-card border border-warm-100 bg-white/80 text-sm text-warm-500 dark:border-warm-800 dark:bg-warm-950/80 dark:text-warm-400">
          {t('loading_articles')}
        </div>
          )
        : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => {
            const meta = sourceMeta[article.source]
            return (
              <Link key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className="group">
                <article className="relative flex h-full flex-col rounded-card border border-warm-100 bg-white/80 p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-card-hover dark:border-warm-800 dark:bg-warm-950/80">
                  <div className="flex items-start justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${meta.text}`}>
                      {meta.name}
                    </span>
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/80 p-1 border border-warm-100 dark:border-warm-800 dark:bg-warm-900/60">
                      <img src={meta.logo} alt={meta.name} className="h-full w-full object-contain" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    <h3 className="text-lg font-semibold leading-snug text-warm-900 transition-colors group-hover:text-accent dark:text-warm-50 dark:group-hover:text-accent">
                      {article.title}
                    </h3>
                    <p className="text-sm text-warm-600 line-clamp-3 dark:text-warm-300">{article.summary}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.topics.map((topic) => (
                      <span key={topic} className="rounded-full bg-warm-100 px-2 py-1 text-xs text-warm-500 dark:bg-warm-800/80 dark:text-warm-300">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-5 text-sm text-warm-500 dark:text-warm-400">
                    <div>
                      <p className="tabular-nums">{new Date(article.publishedAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}</p>
                      <p className="text-xs text-warm-400 dark:text-warm-500">
                        {article.stats?.views
                          ? `${article.stats.views} ${t('views')}`
                          : ''}
                        {article.stats?.likes
                          ? ` · ${article.stats.likes}`
                          : ''}
                        {article.stats?.comments
                          ? ` · ${article.stats.comments}`
                          : ''}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-warm-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent dark:text-warm-600" />
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BlogPageWithData

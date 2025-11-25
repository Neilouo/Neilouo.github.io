import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Filter } from 'lucide-react'
import { externalArticles, sourceMeta, type ExternalSource } from '../data/externalArticles'

const BlogPageWithData: React.FC = () => {
  const [activeSource, setActiveSource] = useState<ExternalSource | 'all'>('all')

  const articles = useMemo(() => {
    const sorted = [...externalArticles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    return activeSource === 'all'
      ? sorted
      : sorted.filter((article) => article.source === activeSource)
  }, [activeSource])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
            External Feed
          </p>
          <h3 className="text-left text-2xl font-semibold text-slate-900 dark:text-white">
            来自 CSDN / 掘金 / 博客园 / Stack Overflow 的最新写作
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center rounded-full border border-slate-200/70 px-3 py-1 text-slate-500 dark:border-white/10 dark:text-slate-300">
            <Filter className="mr-1 h-3.5 w-3.5" />筛选来源
          </span>
          <button
            onClick={() => setActiveSource('all')}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${
              activeSource === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white/60 text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300'
            }`}
          >
            全部
          </button>
          {(Object.keys(sourceMeta) as ExternalSource[]).map((source) => (
            <button
              key={source}
              onClick={() => setActiveSource(source)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                activeSource === source
                  ? `${sourceMeta[source].accent} shadow`
                  : `${sourceMeta[source].text} opacity-70 hover:opacity-100`
              }`}
            >
              {sourceMeta[source].name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => {
          const meta = sourceMeta[article.source]
          return (
            <Link key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className="group">
              <article className="relative flex h-full flex-col rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_25px_80px_-50px_rgba(15,23,42,0.7)] transition hover:-translate-y-1 hover:shadow-[0_35px_120px_-60px_rgba(15,23,42,0.8)] dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex items-start justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${meta.text}`}>
                    {meta.name}
                  </span>
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/80 p-1 shadow-inner dark:bg-white/10">
                    <img src={meta.logo} alt={meta.name} className="h-full w-full object-contain" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="text-xl font-semibold leading-snug text-slate-900 transition group-hover:text-slate-600 dark:text-white dark:group-hover:text-slate-200">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 dark:text-slate-300">{article.summary}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {article.topics.map((topic) => (
                    <span key={topic} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-200">
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 text-sm text-slate-500 dark:text-slate-300">
                  <div>
                    <p>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</p>
                    <p className="text-xs text-slate-400">
                      {article.stats?.views ? `${article.stats.views} 次阅读` : ''}
                      {article.stats?.likes ? ` · ${article.stats.likes} 赞` : ''}
                      {article.stats?.comments ? ` · ${article.stats.comments} 评论` : ''}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-900 dark:group-hover:text-white" />
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BlogPageWithData

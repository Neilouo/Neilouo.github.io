'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { NoteHighlightsPayload } from '../../data/noteContent'

interface HighlightsProps {
  data: NoteHighlightsPayload
}

export default function Highlights ({ data }: HighlightsProps): JSX.Element {
  return (
    <section className="space-y-8" id="note-highlights">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Highlights</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">专题与热门</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">精选专题 + 实时热门，组合出最适合当前阶段的阅读路径。</p>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">CURATED</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          {data.featured.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <Link
                href={item.link}
                className={`group flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-r ${item.accent} p-6 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl`}
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                  {item.tag}
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/85">{item.summary}</p>
                </div>
                <span className="text-sm font-semibold text-white/80">深入阅读 →</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100/60 bg-white/90 p-6 shadow-lg dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Trending</p>
          <ul className="mt-4 space-y-4">
            {data.trending.map((item) => (
              <li key={item.title} className="rounded-2xl border border-gray-100/80 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
                <Link href={item.link} className="block">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400">
                    <span>{item.updated}</span>
                    <span>{item.minutes} min</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-50">{item.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.topics.map((topic) => (
                      <span key={topic} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

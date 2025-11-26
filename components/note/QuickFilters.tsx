'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { NoteFilterItem } from '../../data/noteContent'

interface QuickFiltersProps {
  items: NoteFilterItem[]
}

export default function QuickFilters ({ items }: QuickFiltersProps): JSX.Element {
  return (
    <section className="space-y-6" id="note-quick-filters">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Explore</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">精选知识入口</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">选择一个关注领域，立即跳转到对应笔记集合。</p>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{items.length} TRACKS</span>
      </div>

      <div className="flex snap-x gap-4 overflow-x-auto pb-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true, amount: 0.4 }}
            className="snap-start"
          >
            <Link
              href={item.href}
              className={`group flex min-w-[220px] flex-col gap-3 rounded-3xl border border-gray-100/40 bg-gradient-to-br ${item.accent} p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/5`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">{item.count} Notes</p>
                  <p className="text-lg font-semibold">{item.label}</p>
                </div>
              </div>
              <p className="text-sm text-white/80">{item.description}</p>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                Jump in
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

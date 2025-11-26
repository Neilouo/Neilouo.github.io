'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { NoteUtilityCard } from '../../data/noteContent'

interface UtilityDeckProps {
  items: NoteUtilityCard[]
}

export default function UtilityDeck ({ items }: UtilityDeckProps): JSX.Element {
  return (
    <section className="space-y-6" id="note-utility">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Connect</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">联系与支援</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">通过不同渠道保持交流，获取一对一支持或同步更新。</p>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{items.length} OPTIONS</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Link
              href={item.href}
              className="flex h-full flex-col gap-4 rounded-3xl border border-gray-100/80 bg-white/90 p-6 shadow-lg transition hover:-translate-y-1 hover:border-gray-200 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/70"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                {item.hint != null && <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{item.hint}</span>}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{item.actionLabel} →</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

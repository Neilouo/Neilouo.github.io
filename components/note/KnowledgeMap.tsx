'use client'

import { motion } from 'framer-motion'
import Context from '../Context'

interface StatChip {
  label: string
  value: string
  hint: string
}

interface KnowledgeMapProps {
  json: string
  stats: StatChip[]
}

export default function KnowledgeMap ({ json, stats }: KnowledgeMapProps): JSX.Element {
  return (
    <section className="relative" id="note-map">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-gray-100/40 bg-white/90 p-8 shadow-xl dark:border-white/5 dark:bg-slate-900/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Knowledge Map</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">知识雷达</h2>
            <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              根据主题动态生成的导航，提供「由宏观到微观」的探索路径。点击任意卡片即可进入对应笔记。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-gray-200/60 bg-white/70 px-4 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">{stat.label}</div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{stat.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <Context json={json} title={'Note'} />
        </motion.div>
      </div>
    </section>
  )
}

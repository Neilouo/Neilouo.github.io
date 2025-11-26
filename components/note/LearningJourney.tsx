'use client'

import { motion } from 'framer-motion'
import type { NoteJourneyStage } from '../../data/noteContent'

interface LearningJourneyProps {
  stages: NoteJourneyStage[]
}

const statusStyles: Record<NoteJourneyStage['status'], string> = {
  'in-progress': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/40',
  completed: 'text-sky-500 bg-sky-500/10 border-sky-500/40',
  'up-next': 'text-amber-500 bg-amber-500/10 border-amber-500/40'
}

export default function LearningJourney ({ stages }: LearningJourneyProps): JSX.Element {
  return (
    <section className="space-y-6" id="note-journey">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Learning Journey</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">学习轨迹</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">记录每一阶段的主题聚焦与关键成果。</p>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{stages.length} CHAPTERS</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.title}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.4 }}
            className="min-w-[320px]"            
          >
            <div className="flex h-full flex-col rounded-3xl border border-gray-100/60 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${statusStyles[stage.status]}`}>
                {stage.phase}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-50">{stage.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stage.timeframe}</p>
              <p className="mt-3 flex-1 text-sm text-gray-600 dark:text-gray-300">{stage.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                {stage.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

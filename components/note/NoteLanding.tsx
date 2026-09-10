'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { getNoteFilters, getNoteHighlights } from '../../data/noteContent'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '../I18nProvider'
import { reveal, stagger, item } from '../../lib/motion'

interface NoteLandingProps {
  contextJson: Record<string, unknown>
}

export default function NoteLanding ({ contextJson }: NoteLandingProps): JSX.Element {
  const { t } = useI18n()
  const noteFilters = getNoteFilters(t)
  const noteHighlights = getNoteHighlights(t)
  const totalNotes = noteFilters.reduce((acc, item) => acc + item.count, 0)
  return (
    <div className="max-w-5xl mx-auto px-4 pt-12 pb-24">
      <motion.header {...reveal} className="mb-12">
        <h1 className="text-3xl font-semibold text-warm-900 dark:text-warm-50 tracking-tight">
          {t('notes')}
        </h1>
        <p className="mt-2 text-warm-600 dark:text-warm-300">
          {t('note_subtitle_prefix')}{totalNotes}{t('note_subtitle_suffix')}
        </p>
      </motion.header>

      {/* Quick filters */}
      <motion.section {...reveal} className="mb-16">
        <h2 className="text-lg font-semibold text-warm-800 dark:text-warm-100 mb-6">
          {t('note_categories')}
        </h2>
        <motion.div {...stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {noteFilters.map((filterItem) => (
            <motion.div key={filterItem.id} {...item}>
              <Link
                href={filterItem.href}
                className="group flex items-start gap-4 p-5 rounded-card border border-warm-100 dark:border-warm-800 hover:border-accent/30 dark:hover:border-accent/30 bg-white dark:bg-warm-950 transition-colors h-full"
              >
                <span className="text-2xl flex-shrink-0">{filterItem.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-warm-900 dark:text-warm-50 group-hover:text-accent transition-colors">
                      {filterItem.label}
                    </h3>
                    <span className="text-xs text-warm-400 dark:text-warm-500">{filterItem.count}</span>
                  </div>
                  <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">{filterItem.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Featured notes */}
      <motion.section {...reveal} className="mb-16">
        <h2 className="text-lg font-semibold text-warm-800 dark:text-warm-100 mb-6">
          {t('note_featured')}
        </h2>
        <motion.div {...stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {noteHighlights.featured.map((featuredItem) => (
            <motion.div key={featuredItem.title} {...item}>
              <Link
                href={featuredItem.link}
                className="group p-6 rounded-card border border-warm-100 dark:border-warm-800 hover:border-accent/30 dark:hover:border-accent/30 bg-white dark:bg-warm-950 transition-colors h-full"
              >
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent mb-3">
                  {featuredItem.tag}
                </span>
                <h3 className="font-medium text-warm-900 dark:text-warm-50 group-hover:text-accent transition-colors">
                  {featuredItem.title}
                </h3>
                <p className="text-sm text-warm-500 dark:text-warm-400 mt-2">{featuredItem.summary}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Trending */}
      <motion.section {...reveal}>
        <h2 className="text-lg font-semibold text-warm-800 dark:text-warm-100 mb-6">
          {t('note_recent')}
        </h2>
        <motion.div {...stagger} className="space-y-1">
          {noteHighlights.trending.map((trendingItem) => (
            <motion.div key={trendingItem.title} {...item}>
              <Link
                href={trendingItem.link}
                className="group flex items-center justify-between py-4 border-b border-warm-100 dark:border-warm-800"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-warm-900 dark:text-warm-50 group-hover:text-accent transition-colors">
                    {trendingItem.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-warm-400 dark:text-warm-500">
                    <span>{trendingItem.updated}</span>
                    <span>{trendingItem.minutes} min</span>
                    {trendingItem.topics.map(topic => (
                      <span key={topic} className="px-1.5 py-0.5 rounded bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-warm-300 group-hover:text-accent transition-colors flex-shrink-0 ml-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { BiGitRepoForked } from 'react-icons/bi'
import { FiBox, FiEye } from 'react-icons/fi'
import { useI18n } from './I18nProvider'
import type { GitHubStats } from '../pages/api/github-stats'

const CHART_URL = 'https://ghchart.rshah.org/FF5733/Neilouo'

const GitHubStatsCard: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const { t } = useI18n()

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const r = await fetch('/api/github-stats')
        const d = await r.json() as GitHubStats
        setStats(d)
      } catch {
        // Stats unavailable — component shows skeleton until data loads
      }
    }
    void load()
  }, [])

  if (!stats) {
    return (
      <div className="h-48 rounded-card bg-warm-100 dark:bg-warm-900 animate-pulse" />
    )
  }

  const items = [
    { icon: <AiFillStar className="w-3.5 h-3.5 text-amber-400" />, label: 'Stars', value: stats.stars },
    { icon: <BiGitRepoForked className="w-3.5 h-3.5 text-accent" />, label: 'Forks', value: stats.forks },
    { icon: <FiBox className="w-3.5 h-3.5 text-emerald-500" />, label: 'Repos', value: stats.repos },
    { icon: <FiEye className="w-3.5 h-3.5 text-violet-500" />, label: 'Followers', value: stats.followers }
  ]

  return (
    <div className="rounded-card border border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-950 overflow-hidden">
      {/* Top bar: avatar + name + stats in one row */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-warm-50 dark:border-warm-900">
        <img
          src={stats.avatar}
          alt={stats.username}
          className="w-9 h-9 rounded-full border border-warm-100 dark:border-warm-800 flex-shrink-0"
        />
        <div className="min-w-0 mr-auto">
          <span className="text-sm font-semibold text-warm-900 dark:text-warm-50">
            {stats.username}
          </span>
          <span className="text-xs text-accent ml-2">{stats.name}</span>
        </div>
        <div className="flex items-center gap-5 flex-shrink-0">
          {items.map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              {item.icon}
              <span className="text-sm font-semibold text-warm-900 dark:text-warm-50">{item.value}</span>
              <span className="text-xs text-warm-400 dark:text-warm-500 hidden sm:inline">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="px-5 pt-4 pb-3">
        <div className="overflow-x-auto">
          <img
            src={CHART_URL}
            alt={t('github_heatmap')}
            className="w-full min-w-[660px] h-auto dark:invert dark:hue-rotate-180 dark:brightness-90 dark:contrast-90"
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-warm-400 dark:text-warm-500">
            {t('github_daily')}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-warm-400 dark:text-warm-500 mr-1">
              {t('less')}
            </span>
            {['#EEEEEE', '#ffa480', '#ff8a66', '#FF5733', '#cc4629'].map((color) => (
              <span
                key={color}
                className="inline-block w-[10px] h-[10px] rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            <span className="text-xs text-warm-400 dark:text-warm-500 ml-1">
              {t('more')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitHubStatsCard

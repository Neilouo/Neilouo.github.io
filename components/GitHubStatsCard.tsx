'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { AiFillStar } from 'react-icons/ai'
import { BiGitRepoForked } from 'react-icons/bi'
import { FiBox, FiEye } from 'react-icons/fi'
import { useI18n } from './I18nProvider'
import { fetchGitHubStats, type GitHubStats } from '../utils/githubStats'
import { useCountUp } from '../hooks/useCountUp'

const CHART_URL = 'https://ghchart.rshah.org/FF5733/Neilouo'

function StatItem ({ icon, label, value, active }: { icon: React.ReactNode, label: string, value: number, active: boolean }) {
  const count = useCountUp(value, 1200, active)
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-lg font-bold tabular-nums bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent">{count}</span>
      <span className="text-xs text-warm-400 dark:text-warm-500 hidden sm:inline">{label}</span>
    </div>
  )
}

const GitHubStatsCard: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    let cancelled = false
    const load = async (): Promise<void> => {
      const data = await fetchGitHubStats()
      if (cancelled) return
      setStats(data)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  if (stats == null) {
    return (
      <div className="h-48 rounded-card bg-warm-100 dark:bg-warm-900 animate-pulse" />
    )
  }

  const items = [
    { icon: <AiFillStar className="w-4 h-4 text-amber-400" />, label: 'Stars', value: stats.stars },
    { icon: <BiGitRepoForked className="w-4 h-4 text-accent" />, label: 'Forks', value: stats.forks },
    { icon: <FiBox className="w-4 h-4 text-emerald-500" />, label: 'Repos', value: stats.repos },
    { icon: <FiEye className="w-4 h-4 text-violet-500" />, label: 'Followers', value: stats.followers }
  ]

  return (
    <div ref={ref} className="rounded-card border border-warm-100 dark:border-warm-800 bg-white/80 dark:bg-warm-950/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4 border-b border-warm-50 dark:border-warm-900">
        <img
          src={stats.avatar}
          alt={stats.username}
          className="w-10 h-10 rounded-full border border-warm-100 dark:border-warm-800 flex-shrink-0"
        />
        <div className="min-w-0 mr-auto">
          <span className="text-sm font-semibold text-warm-900 dark:text-warm-50">
            {stats.username}
          </span>
          <span className="text-xs text-accent ml-2">{stats.name}</span>
        </div>
        <div className="flex items-center gap-5 flex-shrink-0">
          {items.map(it => (
            <StatItem key={it.label} icon={it.icon} label={it.label} value={it.value} active={inView} />
          ))}
        </div>
      </div>

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

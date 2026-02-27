import React, { useEffect, useState } from 'react'
import { useI18n } from './I18nProvider'
import { certifications, kaggleProfile } from '../data/developerProfile'
import { Award, ExternalLink, Trophy, Medal, Code2, Star, Hash } from 'lucide-react'

/* ── LeetCode types ────────────────────────────────────── */

interface LeetCodeSolved {
  total: number
  easy: number
  medium: number
  hard: number
}

interface LeetCodeContest {
  rating: number
  attended: number
}

interface LeetCodeStats {
  username: string
  solved: LeetCodeSolved
  submissions: { total: number }
  contest: LeetCodeContest | null
}

/* ── Ring progress (SVG) ───────────────────────────────── */

const TOTAL_PROBLEMS = 3448
const RING_SIZE = 100
const STROKE = 8
const RADIUS = (RING_SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * RADIUS

function SolvedRing({ solved }: { solved: LeetCodeStats['solved'] }) {
  const pct = Math.min(solved.total / TOTAL_PROBLEMS, 1)
  return (
    <div className="relative flex items-center justify-center" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
        <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
          fill="none" stroke="currentColor" strokeWidth={STROKE}
          className="text-warm-100 dark:text-warm-800" />
        <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
          fill="none" strokeWidth={STROKE} strokeLinecap="round"
          strokeDasharray={`${pct * CIRC} ${CIRC}`}
          className="text-amber-500 transition-all duration-700" />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-xl font-bold text-warm-900 dark:text-warm-50">{solved.total}</span>
        <span className="text-[10px] text-warm-400 dark:text-warm-500">solved</span>
      </div>
    </div>
  )
}

/* ── Difficulty bar ────────────────────────────────────── */

interface DifficultyBarProps {
  label: string
  count: number
  total: number
  color: string
}

function DifficultyBar({ label, count, total, color }: DifficultyBarProps) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-medium w-14 ${color}`}>{label}</span>
      <div className="flex-1 h-2 rounded-full bg-warm-100 dark:bg-warm-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
      <span className="text-xs text-warm-500 dark:text-warm-400 w-8 text-right">{count}</span>
    </div>
  )
}

/* ── LeetCode Card ─────────────────────────────────────── */

function LeetCodeCard() {
  const [stats, setStats] = useState<LeetCodeStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const r = await fetch('/api/leetcode-stats')
        const d = await r.json() as LeetCodeStats
        setStats(d)
      } catch {
        setStats({
          username: 'NanSang2000',
          solved: { total: 303, easy: 201, medium: 68, hard: 34 },
          submissions: { total: 1431 },
          contest: null
        })
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading || !stats) {
    return <div className="h-48 rounded-card bg-warm-100 dark:bg-warm-900 animate-pulse" />
  }

  const difficultyTotals = { easy: 839, medium: 1762, hard: 847 }

  return (
    <a href={`https://leetcode.com/u/${stats.username}`} target="_blank" rel="noopener noreferrer"
      className="group block rounded-card border border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-950 p-5 hover:border-amber-300/50 dark:hover:border-amber-500/30 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center">
          <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        </div>
        <span className="text-sm font-medium text-warm-900 dark:text-warm-50">LeetCode</span>
        <span className="text-xs text-warm-400 dark:text-warm-500">@{stats.username}</span>
        <ExternalLink className="w-3 h-3 ml-auto text-warm-300 dark:text-warm-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center gap-5">
        <SolvedRing solved={stats.solved} />
        <div className="flex-1 space-y-2">
          <DifficultyBar label="Easy" count={stats.solved.easy} total={difficultyTotals.easy} color="text-emerald-500" />
          <DifficultyBar label="Medium" count={stats.solved.medium} total={difficultyTotals.medium} color="text-amber-500" />
          <DifficultyBar label="Hard" count={stats.solved.hard} total={difficultyTotals.hard} color="text-red-500" />
        </div>
      </div>

      {stats.contest && (
        <div className="mt-3 pt-3 border-t border-warm-50 dark:border-warm-900 flex items-center gap-4 text-xs text-warm-500 dark:text-warm-400">
          <span>Rating: <strong className="text-warm-700 dark:text-warm-200">{stats.contest.rating}</strong></span>
          <span>Contests: <strong className="text-warm-700 dark:text-warm-200">{stats.contest.attended}</strong></span>
        </div>
      )}
    </a>
  )
}

/* ── Kaggle Card ───────────────────────────────────────── */

function KaggleCard() {
  const { lang } = useI18n()
  const kg = kaggleProfile

  if (!kg.username) {
    return (
      <div className="rounded-card border border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-950 p-5 opacity-60">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-sky-500/10 flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          </div>
          <span className="text-sm font-medium text-warm-900 dark:text-warm-50">Kaggle</span>
        </div>
        <p className="text-xs text-warm-400 dark:text-warm-500">
          {lang === 'zh' ? '即将接入…' : 'Coming soon…'}
        </p>
      </div>
    )
  }

  const tierColors: Record<string, string> = {
    Grandmaster: 'text-yellow-500',
    Master: 'text-orange-500',
    Expert: 'text-purple-500',
    Contributor: 'text-sky-500',
    Novice: 'text-warm-400'
  }

  return (
    <a href={`https://www.kaggle.com/${kg.username}`} target="_blank" rel="noopener noreferrer"
      className="group block rounded-card border border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-950 p-5 hover:border-sky-300/50 dark:hover:border-sky-500/30 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded bg-sky-500/10 flex items-center justify-center">
          <Trophy className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        </div>
        <span className="text-sm font-medium text-warm-900 dark:text-warm-50">Kaggle</span>
        <span className="text-xs text-warm-400 dark:text-warm-500">@{kg.username}</span>
        <ExternalLink className="w-3 h-3 ml-auto text-warm-300 dark:text-warm-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className={`text-sm font-semibold ${tierColors[kg.tier] || 'text-warm-500'}`}>{kg.tier}</span>
        <span className="flex items-center gap-1 text-xs text-warm-400 dark:text-warm-500">
          <Star className="w-3 h-3" />{kg.badges.length} {lang === 'zh' ? '枚徽章' : 'badges'}
        </span>
      </div>

      {kg.competitions.length > 0 && (
        <div className="space-y-1.5">
          {kg.competitions.map((comp) => (
            <div key={comp.name} className="flex items-start gap-2 text-xs">
              <Hash className="w-3 h-3 mt-0.5 text-sky-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-warm-700 dark:text-warm-200 leading-snug line-clamp-1">{comp.name}</p>
                <p className="text-warm-400 dark:text-warm-500">
                  {lang === 'zh' ? '排名' : 'Rank'} {comp.rank}/{comp.total}
                  <span className="ml-1 text-warm-300 dark:text-warm-600">
                    (top {Math.round(comp.rank / comp.total * 100)}%)
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-warm-50 dark:border-warm-900 flex flex-wrap gap-1.5">
        {kg.badges.slice(0, 5).map((badge) => (
          <span key={badge.name} className="px-1.5 py-0.5 rounded text-[10px] bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 whitespace-nowrap">
            {badge.name}
          </span>
        ))}
        {kg.badges.length > 5 && (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-warm-50 dark:bg-warm-900 text-warm-400 dark:text-warm-500">
            +{kg.badges.length - 5}
          </span>
        )}
      </div>
    </a>
  )
}

/* ── Certifications ────────────────────────────────────── */

function CertificationsGrid() {
  const { lang } = useI18n()

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Award className="w-4 h-4 text-warm-400 dark:text-warm-500" />
        <h4 className="text-sm font-medium text-warm-700 dark:text-warm-200">
          {lang === 'zh' ? '专业认证' : 'Certifications'}
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {certifications.map((cert) => (
          <div key={cert.name}
            className="rounded-card border border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-950 p-4 flex gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cert.accent}`}>
              {cert.logo
                ? <img src={cert.logo} alt={cert.issuer} className="w-4 h-4 rounded-sm object-contain" />
                : <Medal className="w-4 h-4" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-warm-900 dark:text-warm-50 leading-snug line-clamp-2">
                {cert.name}
              </p>
              <p className="text-xs text-warm-500 dark:text-warm-400 mt-0.5">
                {cert.issuer}
                <span className="mx-1.5 text-warm-300 dark:text-warm-600">·</span>
                {cert.issued}
                {cert.expires && (
                  <span className="text-warm-400 dark:text-warm-500"> → {cert.expires}</span>
                )}
              </p>
              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {cert.skills.map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-warm-50 dark:bg-warm-900 text-warm-500 dark:text-warm-400">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main export ───────────────────────────────────────── */

export default function DeveloperProfile() {
  const { lang } = useI18n()

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-50">
        {lang === 'zh' ? '开发者档案' : 'Developer Profile'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LeetCodeCard />
        <KaggleCard />
      </div>

      <CertificationsGrid />
    </section>
  )
}

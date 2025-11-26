'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface HeroStat {
  label: string
  value: string
  description?: string
}

interface NoteHeroProps {
  title: string
  subtitle: string
  description: string
  badges: string[]
  stats: HeroStat[]
  primaryAction: { label: string; href: string }
  secondaryAction: { label: string; href: string }
  tertiaryAction?: { label: string; href: string }
}

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
}

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1 + 0.4,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
}

export default function NoteHero ({
  title,
  subtitle,
  description,
  badges,
  stats,
  primaryAction,
  secondaryAction,
  tertiaryAction
}: NoteHeroProps): JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-8 shadow-2xl">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-20 -right-10 h-64 w-64 bg-purple-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-56 w-56 bg-cyan-500/30 blur-3xl" />
        <div className="absolute top-1/3 right-1/3 h-40 w-40 bg-orange-400/30 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid gap-12 lg:grid-cols-[2fr,1fr]"
      >
        <div className="space-y-6">
          <div className="inline-flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
              >
                {badge}
              </span>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/60">{subtitle}</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80 lg:text-xl">{description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryAction.href}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/30 transition hover:-translate-y-0.5"
            >
              {primaryAction.label}
            </Link>
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60"
            >
              {secondaryAction.label}
            </Link>
            {tertiaryAction != null && (
              <Link
                href={tertiaryAction.href}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white/70 transition hover:text-white"
              >
                {tertiaryAction.label}
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Live Metrics</p>
          <div className="grid gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index}
                variants={statVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-sm font-semibold uppercase tracking-wide text-white/70">{stat.label}</div>
                {stat.description != null && (
                  <p className="text-xs text-white/60">{stat.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

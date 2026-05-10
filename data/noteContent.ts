export interface NoteFilterItem {
  id: string
  label: string
  description: string
  icon: string
  accent: string
  href: string
  count: number
}

export interface NoteJourneyStage {
  phase: string
  title: string
  timeframe: string
  description: string
  highlights: string[]
  status: 'in-progress' | 'completed' | 'up-next'
}

export interface NoteHighlightCard {
  title: string
  summary: string
  tag: string
  link: string
  accent: string
}

export interface NoteTrendingItem {
  title: string
  link: string
  updated: string
  minutes: number
  topics: string[]
}

export interface NoteHighlightsPayload {
  featured: NoteHighlightCard[]
  trending: NoteTrendingItem[]
}

export interface NoteUtilityCard {
  title: string
  description: string
  actionLabel: string
  href: string
  icon: string
  hint?: string
}

type Lang = 'zh' | 'en'
type TFn = (key: string) => string

export function getNoteFilters (t: TFn): NoteFilterItem[] {
  return [
    {
      id: 'frontend',
      label: t('note_filter_frontend'),
      description: t('note_filter_frontend_desc'),
      icon: '⚛️',
      accent: 'from-indigo-500 to-cyan-500',
      href: '/note/learnreact',
      count: 42
    },
    {
      id: 'language',
      label: t('note_filter_language'),
      description: t('note_filter_language_desc'),
      icon: '🧠',
      accent: 'from-purple-500 to-pink-500',
      href: '/note/typescript',
      count: 58
    },
    {
      id: 'server',
      label: t('note_filter_server'),
      description: t('note_filter_server_desc'),
      icon: '🌐',
      accent: 'from-emerald-500 to-lime-500',
      href: '/note/nodejs',
      count: 33
    },
    {
      id: 'miniapp',
      label: t('note_filter_miniapp'),
      description: t('note_filter_miniapp_desc'),
      icon: '📱',
      accent: 'from-orange-500 to-rose-500',
      href: '/note/minpro',
      count: 24
    },
    {
      id: 'github',
      label: t('note_filter_github'),
      description: t('note_filter_github_desc'),
      icon: '🧰',
      accent: 'from-slate-600 to-gray-900',
      href: '/note/github',
      count: 18
    }
  ]
}

export function getNoteJourney (t: TFn): NoteJourneyStage[] {
  return [
    {
      phase: 'Now',
      title: t('note_journey_now_title'),
      timeframe: '2025 Q4',
      description: t('note_journey_now_desc'),
      highlights: ['打造 Note Lab 体验', 'Web Vitals 监控仪表盘', '设计系统 token 化'],
      status: 'in-progress'
    },
    {
      phase: 'Next',
      title: t('note_journey_next_title'),
      timeframe: '2026 Q1',
      description: t('note_journey_next_desc'),
      highlights: ['Go 并发专题', 'Node.js Observability', '部署流水线最佳实践'],
      status: 'up-next'
    },
    {
      phase: 'Last',
      title: t('note_journey_last_title'),
      timeframe: '2025 Q2-Q3',
      description: t('note_journey_last_desc'),
      highlights: ['泛型模式图谱', '守卫与推断技巧', 'TS + React 模板'],
      status: 'completed'
    }
  ]
}

export function getNoteHighlights (t: TFn): NoteHighlightsPayload {
  return {
    featured: [
      {
        title: t('note_featured_1_title'),
        summary: t('note_featured_1_summary'),
        tag: t('note_featured_1_tag'),
        link: '/note/learnreact/advance',
        accent: 'from-purple-600 to-indigo-500'
      },
      {
        title: t('note_featured_2_title'),
        summary: t('note_featured_2_summary'),
        tag: t('note_featured_2_tag'),
        link: '/note/golang/channel',
        accent: 'from-emerald-500 to-teal-500'
      }
    ],
    trending: [
      {
        title: t('note_trending_1_title'),
        link: '/note/typescript/07.generics',
        updated: t('note_trending_1_updated'),
        minutes: 12,
        topics: ['类型系统', '模式']
      },
      {
        title: t('note_trending_2_title'),
        link: '/note/nodejs/06.NodeHttp',
        updated: t('note_trending_2_updated'),
        minutes: 15,
        topics: ['后端', '性能']
      },
      {
        title: t('note_trending_3_title'),
        link: '/note/minpro/3.jiagou',
        updated: t('note_trending_3_updated'),
        minutes: 10,
        topics: ['小程序', '工程']
      }
    ]
  }
}

export function getNoteUtilities (t: TFn): NoteUtilityCard[] {
  return [
    {
      title: t('note_utility_subscribe_title'),
      description: t('note_utility_subscribe_desc'),
      actionLabel: t('note_utility_subscribe_action'),
      href: 'mailto:nansang2000@gmail.com?subject=Subscribe%20Note%20Lab',
      icon: '✉️',
      hint: t('note_utility_subscribe_hint')
    },
    {
      title: t('note_utility_github_title'),
      description: t('note_utility_github_desc'),
      actionLabel: t('note_utility_github_action'),
      href: 'https://github.com/nansang2000',
      icon: '⭐',
      hint: t('note_utility_github_hint')
    },
    {
      title: t('note_utility_rss_title'),
      description: t('note_utility_rss_desc'),
      actionLabel: t('note_utility_rss_action'),
      href: '/docs/rss',
      icon: '🛰️',
      hint: 'Beta'
    },
    {
      title: t('note_utility_chat_title'),
      description: t('note_utility_chat_desc'),
      actionLabel: t('note_utility_chat_action'),
      href: 'mailto:nansang2000@gmail.com?subject=Note%20Consult',
      icon: '🤝'
    }
  ]
}

// Legacy exports for backwards compatibility (default to Chinese)
export const noteFilters: NoteFilterItem[] = getNoteFilters((key) => key)
export const noteJourney: NoteJourneyStage[] = getNoteJourney((key) => key)
export const noteHighlights: NoteHighlightsPayload = getNoteHighlights((key) => key)
export const noteUtilities: NoteUtilityCard[] = getNoteUtilities((key) => key)

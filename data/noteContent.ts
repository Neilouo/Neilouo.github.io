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

export const noteFilters: NoteFilterItem[] = [
  {
    id: 'frontend',
    label: '前端工程',
    description: 'React · Next.js · 交互体验',
    icon: '⚛️',
    accent: 'from-indigo-500 to-cyan-500',
    href: '/note/learnreact',
    count: 42
  },
  {
    id: 'language',
    label: '编程语言',
    description: 'Go · TypeScript · Python',
    icon: '🧠',
    accent: 'from-purple-500 to-pink-500',
    href: '/note/typescript',
    count: 58
  },
  {
    id: 'server',
    label: '服务端与网络',
    description: 'Node.js · REST · 网络协议',
    icon: '🌐',
    accent: 'from-emerald-500 to-lime-500',
    href: '/note/nodejs',
    count: 33
  },
  {
    id: 'miniapp',
    label: '小程序实战',
    description: '架构 · 工程化 · 数据链路',
    icon: '📱',
    accent: 'from-orange-500 to-rose-500',
    href: '/note/minpro',
    count: 24
  },
  {
    id: 'github',
    label: '效率与协作',
    description: 'Git · 工作流 · 自动化',
    icon: '🧰',
    accent: 'from-slate-600 to-gray-900',
    href: '/note/github',
    count: 18
  }
]

export const noteJourney: NoteJourneyStage[] = [
  {
    phase: 'Now',
    title: '现代前端体验与可视化',
    timeframe: '2025 Q4',
    description: '打磨交互体验、微交互动效与可观测性指标，构建统一的设计语言。',
    highlights: ['打造 Note Lab 体验', 'Web Vitals 监控仪表盘', '设计系统 token 化'],
    status: 'in-progress'
  },
  {
    phase: 'Next',
    title: '服务端知识体系升级',
    timeframe: '2026 Q1',
    description: '完善 Go / Node.js 的架构篇章，引入更多性能优化与部署案例。',
    highlights: ['Go 并发专题', 'Node.js Observability', '部署流水线最佳实践'],
    status: 'up-next'
  },
  {
    phase: 'Last',
    title: 'TypeScript 深度笔记',
    timeframe: '2025 Q2-Q3',
    description: '系统整理 TS 9 大章节与实践案例，奠定严格类型基线。',
    highlights: ['泛型模式图谱', '守卫与推断技巧', 'TS + React 模板'],
    status: 'completed'
  }
]

export const noteHighlights: NoteHighlightsPayload = {
  featured: [
    {
      title: 'React 学习路径：从心智模型到工程落地',
      summary: '拆解组件心智、状态策略与性能工具链，用一条路径贯穿 React 体系。',
      tag: '专题更新',
      link: '/note/learnreact/advance',
      accent: 'from-purple-600 to-indigo-500'
    },
    {
      title: 'Go 并发模式实战手册',
      summary: '总结 channel、context、调度器等常见并发模式以及排坑策略。',
      tag: '精选推荐',
      link: '/note/golang/channel',
      accent: 'from-emerald-500 to-teal-500'
    }
  ],
  trending: [
    {
      title: 'TypeScript 泛型最佳实践',
      link: '/note/typescript/07.generics',
      updated: '3 天前',
      minutes: 12,
      topics: ['类型系统', '模式']
    },
    {
      title: 'Node.js HTTP 与性能优化',
      link: '/note/nodejs/06.NodeHttp',
      updated: '1 周前',
      minutes: 15,
      topics: ['后端', '性能']
    },
    {
      title: '微信小程序工程架构',
      link: '/note/minpro/3.jiagou',
      updated: '2 周前',
      minutes: 10,
      topics: ['小程序', '工程']
    }
  ]
}

export const noteUtilities: NoteUtilityCard[] = [
  {
    title: '订阅笔记更新',
    description: '获取最新学习日志与专题推送，第一时间掌握更新节奏。',
    actionLabel: '订阅邮件',
    href: 'mailto:nansang2000@gmail.com?subject=Subscribe%20Note%20Lab',
    icon: '✉️',
    hint: '72 小时内回复'
  },
  {
    title: 'GitHub 支持',
    description: '在仓库中提出 Issue 或 Star，以便跟踪路线图与任务。',
    actionLabel: '访问仓库',
    href: 'https://github.com/nansang2000',
    icon: '⭐',
    hint: '欢迎提交 PR'
  },
  {
    title: 'RSS / API',
    description: '通过 RSS 或 API 拉取最新的学习记录，集成到你的信息流。',
    actionLabel: '查看文档',
    href: '/docs/rss',
    icon: '🛰️',
    hint: 'Beta'
  },
  {
    title: '一对一交流',
    description: '针对学习路径与项目落地提供定制化建议。',
    actionLabel: '预约沟通',
    href: 'mailto:nansang2000@gmail.com?subject=Note%20Consult',
    icon: '🤝'
  }
]

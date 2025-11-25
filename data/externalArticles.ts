export type ExternalSource = 'csdn' | 'juejin' | 'cnblogs' | 'stackoverflow'

export interface ExternalArticle {
  id: string
  title: string
  summary: string
  url: string
  source: ExternalSource
  publishedAt: string
  topics: string[]
  stats?: {
    views?: string
    likes?: string
    comments?: string
  }
}

export const sourceMeta: Record<ExternalSource, { name: string; logo: string; accent: string; text: string }> = {
  csdn: {
    name: 'CSDN',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/csdn.svg',
    accent: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-200',
    text: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100'
  },
  juejin: {
    name: '掘金 Juejin',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/juejin.svg',
    accent: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-200',
    text: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-100'
  },
  cnblogs: {
    name: '博客园',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/cnblogs.svg',
    accent: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-200',
    text: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100'
  },
  stackoverflow: {
    name: 'Stack Overflow',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stackoverflow.svg',
    accent: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-200',
    text: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100'
  }
}

export const externalArticles: ExternalArticle[] = [
  {
    id: 'csdn-trpc-ai-coordinator',
    title: 'tRPC + LLM：构建一个自解释的产品联调中台',
    summary: '记录了我在 CSDN 上分享的联调平台案例：如何在 Go tRPC 服务里托管 prompt 工作流，并让产品与工程同时调试。',
    url: 'https://blog.csdn.net/Neilouo/article/details/143923801',
    source: 'csdn',
    publishedAt: '2024-11-18',
    topics: ['tRPC', 'LLM Orchestration', 'Go'],
    stats: { views: '3.2k', likes: '128' }
  },
  {
    id: 'juejin-deck-gl',
    title: '用 deck.gl 做交互地图：设计系统与前端工程的平衡',
    summary: '这篇掘金文章拆解了我在可视化项目中如何拆分设计 token、React 组件与工程脚手架。',
    url: 'https://juejin.cn/post/742134987654321',
    source: 'juejin',
    publishedAt: '2024-10-08',
    topics: ['前端可视化', 'Design System', 'React'],
    stats: { views: '5.1k', likes: '236' }
  },
  {
    id: 'cnblogs-blue-green',
    title: '蓝绿发布与数据库变更：真实项目中的 checklist',
    summary: '记录了我在博客园的复盘：如何在蓝绿发布时处理数据库变更与回滚脚本，以及团队配合要点。',
    url: 'https://www.cnblogs.com/neilouo/p/blue-green-checklist.html',
    source: 'cnblogs',
    publishedAt: '2024-08-22',
    topics: ['DevOps', '数据库', '发布策略'],
    stats: { views: '1.8k', likes: '64', comments: '12' }
  },
  {
    id: 'stackoverflow-answer-observable',
    title: '回答：如何在 Next.js 中封装可观察的数据服务',
    summary: '我在 Stack Overflow 上的一个长答案，示例展示了如何把可观察对象封进自定义 hook 并消除内存泄漏。',
    url: 'https://stackoverflow.com/a/789654321/15012345',
    source: 'stackoverflow',
    publishedAt: '2024-07-11',
    topics: ['Next.js', 'RxJS', 'Hook 设计'],
    stats: { likes: '62 票', comments: '5' }
  },
  {
    id: 'juejin-workflow-ai',
    title: 'Workflow AI：把产品需求拆成可执行的 Prompt Module',
    summary: '分享我在掘金的 AI 产品实验：如何用 Prompt Module + Supabase 记录需求演进。',
    url: 'https://juejin.cn/post/741223445566778',
    source: 'juejin',
    publishedAt: '2024-05-30',
    topics: ['Prompt Engineering', 'Supabase', '产品方法'],
    stats: { views: '4.4k', likes: '189' }
  },
  {
    id: 'csdn-front-guard',
    title: '前端守护进程：用 Bun 写一个资源巡检 Worker',
    summary: '结合 Bun + Cloudflare Workers 做资源巡检的实践，帮助团队第一时间感知静态资源异常。',
    url: 'https://blog.csdn.net/Neilouo/article/details/142555210',
    source: 'csdn',
    publishedAt: '2024-03-18',
    topics: ['Bun', 'Cloudflare', '监控'],
    stats: { views: '2.7k', likes: '94' }
  }
]

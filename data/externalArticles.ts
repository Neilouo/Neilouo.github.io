export type ExternalSource = 'csdn' | 'juejin' | 'cnblogs' | 'stackoverflow' | 'notion'

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
  },
  notion: {
    name: 'Notion',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/notion.svg',
    accent: 'bg-neutral-50 text-neutral-700 dark:bg-neutral-500/10 dark:text-neutral-200',
    text: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-100'
  }
}

export const externalArticles: ExternalArticle[] = [
  {
    id: 'csdn-nvidia-rag',
    title: 'NVIDIA AI-AGENT夏季训练营 — 墨尔本大学RAG智能对话机器人',
    summary: '基于RAG技术，利用墨尔本大学数据资源构建智能对话机器人，提供学术咨询、课程推荐及校园信息查询服务。',
    url: 'https://blog.csdn.net/Breatsam/article/details/141304078',
    source: 'csdn',
    publishedAt: '2024-08-18',
    topics: ['RAG', 'NVIDIA', 'AI Agent'],
    stats: { views: '500', likes: '4' }
  },
  {
    id: 'csdn-deepfake-detection',
    title: 'The Global Multimedia Deepfake Detection',
    summary: '全球多媒体深度伪造检测竞赛参赛心得与技术分析。',
    url: 'https://blog.csdn.net/Breatsam/article/details/140484480',
    source: 'csdn',
    publishedAt: '2024-07-17',
    topics: ['Deepfake', 'Computer Vision', 'AI'],
    stats: { views: '190', likes: '3' }
  },
  {
    id: 'csdn-nvidia-hackathon',
    title: '第十届NVIDIA Sky Hackathon比赛心得',
    summary: '深入了解RAG技术和NVIDIA SDK，掌握搭建对话机器人核心技能，包括Triton、TensorRT等工具链的应用。',
    url: 'https://blog.csdn.net/Breatsam/article/details/140450660',
    source: 'csdn',
    publishedAt: '2024-07-15',
    topics: ['NVIDIA', 'RAG', 'Hackathon'],
    stats: { views: '1.1k', likes: '21' }
  },
  {
    id: 'csdn-internlm-02',
    title: '书生·浦语大模型全链路开源体系 大模型实战营02',
    summary: '浦语·灵笔视觉-语言大模型实战，结合Lagent智能体框架，实现图文理解与创作。',
    url: 'https://blog.csdn.net/Breatsam/article/details/136199159',
    source: 'csdn',
    publishedAt: '2024-02-20',
    topics: ['LLM', 'InternLM', 'AI Agent'],
    stats: { views: '270', likes: '2' }
  },
  {
    id: 'csdn-internlm-01',
    title: '书生·浦语大模型全链路开源体系 大模型实战营01',
    summary: '大语言模型基础入门与书生·浦语开源体系概览。',
    url: 'https://blog.csdn.net/Breatsam/article/details/136190101',
    source: 'csdn',
    publishedAt: '2024-02-20',
    topics: ['LLM', 'InternLM', '开源'],
    stats: { views: '318', likes: '1' }
  },
  {
    id: 'csdn-vmware-mirror',
    title: 'VMware 国内镜像站',
    summary: '国内VMware镜像下载站点分享，方便国内用户快速获取VMware安装包。',
    url: 'https://blog.csdn.net/Breatsam/article/details/121315601',
    source: 'csdn',
    publishedAt: '2021-11-13',
    topics: ['VMware', '工具', '镜像'],
    stats: { views: '12.7k', likes: '15' }
  }
]

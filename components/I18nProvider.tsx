'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Language = 'zh' | 'en'

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const DICT: Record<string, { zh: string, en: string }> = {
  running: { zh: '运行中', en: 'Running' },
  get_started: { zh: '开始使用', en: 'Get Started' },
  hero_iam: { zh: '我是', en: "I'm" },
  hero_name: { zh: '桑楠', en: 'Nan Sang' },
  hero_sub: { zh: '一个不断学习并且探索世界边界的人', en: 'An energetic learner who is exploring the boundaries of the world' },
  about: { zh: '关于我', en: 'About me' },
  blog: { zh: '博客', en: 'Blog' },
  ai_radar: { zh: 'AI 动态', en: 'AI Radar' },
  ai_radar_desc: { zh: '昨日 AI 论文与新闻，按方向分类', en: 'Yesterday\'s AI papers & news, by area' },
  ai_radar_all: { zh: '全部', en: 'All' },
  ai_radar_paper: { zh: '论文', en: 'Papers' },
  ai_radar_news: { zh: '新闻', en: 'News' },
  ai_radar_count: { zh: '共 %s 条', en: '%s items' },
  ai_radar_load_failed: { zh: '加载失败', en: 'Failed to load' },
  ai_radar_no_data: { zh: '暂无数据', en: 'No data' },
  ai_radar_no_content: { zh: '该日暂无内容', en: 'No content for this day' },
  ai_radar_sample_notice: { zh: '当前为示例数据，每日 7:30 更新真实数据', en: 'Showing sample data; real data updates daily at 7:30' },
  ai_radar_type_paper: { zh: '论文', en: 'Paper' },
  ai_radar_type_news: { zh: '新闻', en: 'News' },
  notes: { zh: '笔记', en: 'Notes' },
  cv: { zh: '简历', en: 'Curriculum Vitae' },
  tech_stack: { zh: '技术栈', en: 'Tech Stack' },
  contact: { zh: '联系我', en: 'Contact' },
  projects: { zh: '项目', en: 'Projects' },
  dream: { zh: '追逐云端的梦', en: 'Dream in the sky' },
  github_username: { zh: '桑楠', en: 'Nan Sang' },
  project_more: { zh: '更多项目', en: 'More projects' },

  // Homepage section texts
  about_role: { zh: '全栈开发者 & AI产品经理 & 数据科学家', en: 'Full-stack Developer & AI Product Manager & Data Scientist' },
  about_school: { zh: '毕业于墨尔本大学', en: 'Graduated from University of Melbourne' },
  about_major: { zh: '数据科学专业', en: 'Major in Data Science' },
  about_location: { zh: '现居北京', en: 'Now in Beijing, China' },
  read_all_posts: { zh: '查看所有文章', en: 'Read all posts' },
  notes_desc: { zh: '计算机科学、数据科学、前后端系统化学习知识', en: 'Systematized learning knowledge in Computer Science, Data Science, Frontend & Backend' },
  blog_desc: { zh: '编程经验、产品思考和生活', en: 'Coding experience, product thinking and life' },
  cv_desc: { zh: '工作经历、技能和简历下载', en: 'Work experience, skills and resume download' },
  visitors_count: { zh: '位访客到此一游', en: 'visitors have been here' },

  // Blog page
  blog_subtitle: { zh: '记录产品决策、交互灵感与工程思考。', en: 'Documenting product decisions, interaction insights and engineering trade-offs.' },

  // Projects page
  projects_subtitle: { zh: '一些开源实践与练手项目，欢迎使用与贡献。', en: 'Open-source explorations and side projects — feel free to use and contribute.' },

  // Note page
  note_subtitle_prefix: { zh: '以设计化视角梳理编程、架构与效率笔记 — 共 ', en: 'Design-driven notes on programming, architecture & productivity — ' },
  note_subtitle_suffix: { zh: '+ 篇', en: '+ entries' },
  note_categories: { zh: '专题分类', en: 'Categories' },
  note_featured: { zh: '精选推荐', en: 'Featured' },
  note_recent: { zh: '最近更新', en: 'Recently Updated' },

  // About page
  about_title: { zh: '关于', en: 'About' },
  about_intro: { zh: '我是桑楠，一名全栈开发者和产品经理，目前就读于墨尔本大学数据科学专业。我热衷于构建连接工程与用户体验的产品，曾在腾讯、顺丰、滴滴、金山云、航旅纵横等公司工作。', en: "I'm Nan Sang — a full-stack developer and product manager currently studying Data Science at the University of Melbourne. I enjoy building products that bridge engineering and user experience, and I've worked across companies like Tencent、SF、DiDi, Kingsoft Cloud, and Umetrip." },
  work_experience: { zh: '工作经历', en: 'Work Experience' },
  research: { zh: '研究经历', en: 'Research' },
  latest_role: { zh: '最近工作', en: 'Latest Role' },
  latest_research: { zh: '最近研究', en: 'Latest Research' },
  view_full_profile: { zh: '查看完整履历', en: 'View full profile' },
  resume: { zh: '简历', en: 'Resume' },
  download_pdf: { zh: '下载简历 PDF', en: 'Download PDF' },
  preview_online: { zh: '在线预览', en: 'Preview Online' },
  resume_lang_zh: { zh: '中文简历', en: 'Chinese Resume' },
  resume_lang_en: { zh: '英文简历', en: 'English Resume' },
  frontend: { zh: '前端', en: 'Frontend' },
  backend_tools: { zh: '后端 & 工具', en: 'Backend & Tools' },

  // Blog slug page
  back_to_blog: { zh: '返回博客列表', en: 'Back to blog' },
  share: { zh: '分享', en: 'Share' },
  link_copied: { zh: '链接已复制到剪贴板', en: 'Link copied to clipboard' },
  view_more_posts: { zh: '查看更多文章', en: 'View more articles' },
  min_read: { zh: '分钟阅读', en: 'min read' },
  default_tag: { zh: '技术', en: 'Tech' },

  // CV page
  cv_title: { zh: '简历', en: 'Curriculum Vitae' },
  cv_subtitle: { zh: '专业简历 & 个人履历', en: 'Professional Resume & CV' },
  cv_download: { zh: '下载简历 PDF', en: 'Download Resume PDF' },
  cv_preview: { zh: '在线预览', en: 'Preview Online' },
  cv_badge_dev: { zh: '全栈开发者', en: 'Full Stack Developer' },
  cv_badge_cs: { zh: '计算机科学', en: 'Computer Science' },
  cv_badge_innovation: { zh: '技术创新', en: 'Tech Innovation' },
  cv_preview_title: { zh: '简历预览', en: 'Resume Preview' },
  cv_more_info: { zh: '更多详细信息', en: 'More Details' },
  cv_more_desc: { zh: '探索更多关于我的教育背景、项目经验和专业技能', en: 'Explore more about my education, projects, and skills' },

  // Research page
  research_label: { zh: '研究', en: 'Research' },
  research_title: { zh: '学术与应用研究', en: 'Academic & Applied Research' },
  research_subtitle: { zh: '融合科学严谨性与实践交付，涵盖地球科学、计算机视觉与自动化实验室。', en: 'Blending scientific rigor with practical delivery across geoscience, computer vision, and automation labs.' },
  r1_title: { zh: '基于深度学习的地球化学岩石分类', en: 'Geochemical rock classification powered by deep learning' },
  r1_institution: { zh: '墨尔本大学', en: 'University of Melbourne' },
  r1_location: { zh: '墨尔本', en: 'Melbourne' },
  r1_period: { zh: '2023.02 - 至今', en: 'Feb 2023 - Present' },
  r1_focus: { zh: '地球化学 × AI', en: 'Geochemistry × AI' },
  r1_tagline: { zh: '融合岩石学专业知识与基于 Transformer 的表示学习，解锁更丰富的矿物洞察。', en: 'Fusing petrology expertise with transformer-based representation learning to unlock richer mineral insights.' },
  r1_h1: { zh: '构建多分支 Transformer 模型，融合 ICP-MS、XRF 和地层数据，准确率超越传统基线 14%', en: 'Built a multi-branch Transformer that blends ICP-MS, XRF, and contextual stratigraphy for 14% accuracy gain over classical baselines' },
  r1_h2: { zh: '实现不确定性感知标注和主动学习循环，优化昂贵实验分析的优先级', en: 'Implemented uncertainty-aware labeling and active learning loops to prioritize expensive lab assays' },
  r1_h3: { zh: '发布覆盖 40+ 真实矿床的可复现评估套件，确保部署报告的可信度', en: 'Released reproducible evaluation suite covering 40+ real-world deposits, ensuring trustworthy deployment reports' },
  r2_title: { zh: '基于消费级无人机的道路裂缝检测', en: 'Road crack detection via consumer-grade drones' },
  r2_institution: { zh: '北京建筑大学', en: 'Beijing University of Civil Engineering and Architecture' },
  r2_location: { zh: '北京', en: 'Beijing' },
  r2_period: { zh: '2018.09 - 2022.10', en: 'Sep 2018 - Oct 2022' },
  r2_focus: { zh: '基础设施视觉检测', en: 'Infra-vision ops' },
  r2_tagline: { zh: '设计易于使用的无人机+AI 工具包，使市政部门无需百万级设备即可审计路面。', en: 'Designed an accessible drone+AI toolkit so municipalities can audit pavements without million-dollar rigs.' },
  r2_h1: { zh: '设计基于 DJI Mini 的自适应航线成像系统，巡检人力减少 60%', en: 'Engineered a DJI Mini-based imaging rig with adaptive flight plans, cutting survey labor by 60%' },
  r2_h2: { zh: '训练轻量 MobileNetV3 裂缝检测器，配合时序滤波，端侧推理 < 40ms', en: 'Trained a lightweight MobileNetV3 crack detector with temporal filtering to keep on-device inference under 40 ms' },
  r2_h3: { zh: '策划并标注 12k 帧无人机图像，引入像素级严重程度评分供下游维护团队使用', en: 'Curated and annotated 12k UAV frames, introducing pixel-level severity scoring for downstream maintenance teams' },

  // WorkExperience page
  journey_label: { zh: '旅程', en: 'Journey' },
  work_title: { zh: '实习与工作经历', en: 'Intern & Work Experience' },
  work_subtitle: { zh: '精心整理的团队、产品与使命时间线，塑造了我的专业技能。', en: 'A curated timeline of the teams, products, and missions that shaped my craft.' },

  // Blog page (BlogPageWithData)
  external_feed: { zh: '外部动态', en: 'External Feed' },
  external_articles: { zh: '各平台的最新文章', en: 'Latest articles from various platforms' },
  filter_source: { zh: '筛选来源', en: 'Filter sources' },
  all: { zh: '全部', en: 'All' },
  latest: { zh: '最新', en: 'Latest' },
  popular: { zh: '热度', en: 'Popular' },
  loading_articles: { zh: '加载文章中...', en: 'Loading Blog Articles...' },
  views: { zh: '次阅读', en: 'views' },
  external_unavailable: { zh: '外部文章暂时不可用。', en: 'External articles temporarily unavailable.' },

  // GitHubProjects
  load_failed: { zh: '加载失败', en: 'Failed to load' },
  no_projects: { zh: '暂无公开项目', en: 'No public projects' },

  // DeveloperProfile
  coming_soon: { zh: '即将接入…', en: 'Coming soon…' },
  badges: { zh: '枚徽章', en: 'badges' },
  rank: { zh: '排名', en: 'Rank' },
  certifications_title: { zh: '专业认证', en: 'Certifications' },
  developer_profile: { zh: '开发者档案', en: 'Developer Profile' },

  // GitHubStatsCard
  github_heatmap: { zh: 'GitHub 贡献热力图', en: 'GitHub contribution chart' },
  github_daily: { zh: 'GitHub 每日活跃记录', en: 'GitHub daily activity' },
  less: { zh: '少', en: 'Less' },
  more: { zh: '多', en: 'More' },

  // CodeSnippets
  code_snippets_desc: { zh: '一些实用的代码片段和速查手册', en: 'Practical code snippets and quick-reference manuals' },

  // Nav page
  nav_desc: { zh: '站点收藏及常用导航', en: 'Bookmarks and frequently used navigation' },

  // Index page
  more_certifications: { zh: '更多认证', en: 'more' },

  // AiRadarFeed
  other_area: { zh: '其他', en: 'Other' },

  // Note content
  note_filter_frontend: { zh: '前端工程', en: 'Frontend Engineering' },
  note_filter_frontend_desc: { zh: 'React · Next.js · 交互体验', en: 'React · Next.js · UX' },
  note_filter_language: { zh: '编程语言', en: 'Programming Languages' },
  note_filter_language_desc: { zh: 'Go · TypeScript · Python', en: 'Go · TypeScript · Python' },
  note_filter_server: { zh: '服务端与网络', en: 'Server & Networking' },
  note_filter_server_desc: { zh: 'Node.js · REST · 网络协议', en: 'Node.js · REST · Protocols' },
  note_filter_miniapp: { zh: '小程序实战', en: 'Mini App Dev' },
  note_filter_miniapp_desc: { zh: '架构 · 工程化 · 数据链路', en: 'Architecture · Engineering · Data' },
  note_filter_github: { zh: '效率与协作', en: 'Productivity & Collab' },
  note_filter_github_desc: { zh: 'Git · 工作流 · 自动化', en: 'Git · Workflow · Automation' },
  note_journey_now_title: { zh: '现代前端体验与可视化', en: 'Modern Frontend UX & Visualization' },
  note_journey_now_desc: { zh: '打磨交互体验、微交互动效与可观测性指标，构建统一的设计语言。', en: 'Refining interaction UX, micro-animations and observability metrics, building a unified design language.' },
  note_journey_next_title: { zh: '服务端知识体系升级', en: 'Server-side Knowledge Upgrade' },
  note_journey_next_desc: { zh: '完善 Go / Node.js 的架构篇章，引入更多性能优化与部署案例。', en: 'Improving Go / Node.js architecture chapters with more performance and deployment cases.' },
  note_journey_last_title: { zh: 'TypeScript 深度笔记', en: 'TypeScript Deep Notes' },
  note_journey_last_desc: { zh: '系统整理 TS 9 大章节与实践案例，奠定严格类型基线。', en: 'Systematized TS 9 chapters and practice cases, establishing a strict type baseline.' },
  note_featured_1_title: { zh: 'React 学习路径：从心智模型到工程落地', en: 'React Learning Path: From Mental Models to Engineering' },
  note_featured_1_summary: { zh: '拆解组件心智、状态策略与性能工具链，用一条路径贯穿 React 体系。', en: 'Breaking down component mental models, state strategies and performance toolchain through one path.' },
  note_featured_1_tag: { zh: '专题更新', en: 'Topic Update' },
  note_featured_2_title: { zh: 'Go 并发模式实战手册', en: 'Go Concurrency Patterns Handbook' },
  note_featured_2_summary: { zh: '总结 channel、context、调度器等常见并发模式以及排坑策略。', en: 'Summarizing channel, context, scheduler concurrency patterns and troubleshooting strategies.' },
  note_featured_2_tag: { zh: '精选推荐', en: 'Featured' },
  note_trending_1_title: { zh: 'TypeScript 泛型最佳实践', en: 'TypeScript Generics Best Practices' },
  note_trending_1_updated: { zh: '3 天前', en: '3 days ago' },
  note_trending_2_title: { zh: 'Node.js HTTP 与性能优化', en: 'Node.js HTTP & Performance' },
  note_trending_2_updated: { zh: '1 周前', en: '1 week ago' },
  note_trending_3_title: { zh: '微信小程序工程架构', en: 'WeChat Mini App Architecture' },
  note_trending_3_updated: { zh: '2 周前', en: '2 weeks ago' },
  note_utility_subscribe_title: { zh: '订阅笔记更新', en: 'Subscribe to Notes' },
  note_utility_subscribe_desc: { zh: '获取最新学习日志与专题推送，第一时间掌握更新节奏。', en: 'Get the latest learning logs and topic updates.' },
  note_utility_subscribe_action: { zh: '订阅邮件', en: 'Subscribe' },
  note_utility_subscribe_hint: { zh: '72 小时内回复', en: 'Replied within 72h' },
  note_utility_github_title: { zh: 'GitHub 支持', en: 'GitHub Support' },
  note_utility_github_desc: { zh: '在仓库中提出 Issue 或 Star，以便跟踪路线图与任务。', en: 'Open an Issue or Star the repo to track the roadmap.' },
  note_utility_github_action: { zh: '访问仓库', en: 'Visit Repo' },
  note_utility_github_hint: { zh: '欢迎提交 PR', en: 'PRs welcome' },
  note_utility_rss_title: { zh: 'RSS / API', en: 'RSS / API' },
  note_utility_rss_desc: { zh: '通过 RSS 或 API 拉取最新的学习记录，集成到你的信息流。', en: 'Fetch latest notes via RSS or API into your feed.' },
  note_utility_rss_action: { zh: '查看文档', en: 'View Docs' },
  note_utility_chat_title: { zh: '一对一交流', en: '1-on-1 Chat' },
  note_utility_chat_desc: { zh: '针对学习路径与项目落地提供定制化建议。', en: 'Custom advice on learning paths and project delivery.' },
  note_utility_chat_action: { zh: '预约沟通', en: 'Book a Chat' }
}

export const I18nProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [lang, setLangState] = useState<Language>('zh')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('lang') as Language | null
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved)
      document.documentElement.lang = saved
    } else {
      const browserLang = navigator.language?.toLowerCase()
      const detected = browserLang.startsWith('zh') ? 'zh' : 'en'
      setLangState(detected)
      document.documentElement.lang = detected
    }
  }, [])

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', nextLang)
      document.documentElement.lang = nextLang
    }
  }, [])

  const t = useCallback((key: string) => {
    const item = DICT[key]
    if (!item) return key
    return item[lang] || key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  
  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export const T = ({ k }: { k: string }): JSX.Element => {
  const { t } = useI18n()
  return <>{t(k)}</>
}

export const LangToggle = (): JSX.Element => {
  const { lang, setLang } = useI18n()
  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className={'px-3 py-1 rounded-full text-xs md:text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors'}
      aria-label={lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      {lang === 'zh' ? '中文/English' : 'English/中文'}
    </button>
  )
}

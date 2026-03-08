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
  about_location: { zh: '现居深圳', en: 'Now in Shenzhen, China' },
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
  backend_tools: { zh: '后端 & 工具', en: 'Backend & Tools' }
}

export const I18nProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [lang, setLangState] = useState<Language>('zh')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('lang') as Language | null
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved)
    } else {
      // 简单的首选语言推断
      const browserLang = navigator.language?.toLowerCase()
      if (browserLang.startsWith('zh')) setLangState('zh')
      else setLangState('en')
    }
  }, [])

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang)
    if (typeof window !== 'undefined') window.localStorage.setItem('lang', nextLang)
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

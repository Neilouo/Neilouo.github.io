import React from 'react'
import { LangToggle } from './components/I18nProvider'

const config = {
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Nan's Blog" />
      <meta name="description" content="南桑｜个人网站：项目、博客、笔记与简历。Nan Sang | Personal site: projects, blog, notes and CV." />
      <meta property="og:title" content="Nan Sang · Portfolio & Blog" />
      <meta property="og:description" content="个人项目与技术文章，数据科学与全栈工程。" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="alternate icon" href="/favicon.png" type="image/png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
    </>
  ),
  project: {
    link: 'https://github.com/NanSang2000/NanSang2000.github.io'
  },
  docsRepositoryBase: 'https://github.com/NanSang2000/NanSang2000.github.io',
  banner: {
    key: 'closed',
    text: null
  },
  feedback: {
    content: null
  },
  sidebar: {
    titleComponent ({ title, type }: { title: string, type: string }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  editLink: {
    text: '帮我在 GitHub 改进文章'
  },
  primaryHue: { dark: 35, light: 35 },
  logo: (
    <span className="text-xl font-semibold text-warm-900 dark:text-warm-50 tracking-tight">
      Nan's
    </span>
  ),
  navbar: {
    extraContent: <LangToggle />
  },
  useNextSeoProps () {
    return {
      titleTemplate: '%s | Nan Sang'
    }
  },
  footer: {
    text: (
      <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4 text-sm text-warm-500 dark:text-warm-400">
        <span suppressHydrationWarning>
          &copy; {new Date().getFullYear()} Nan Sang
        </span>
        <div className="flex items-center gap-4">
          <a href="https://github.com/Neilouo" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/nan-sang/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            LinkedIn
          </a>
          <a href="mailto:Neilouuo@gmail.com" className="hover:text-accent transition-colors">
            Email
          </a>
        </div>
      </div>
    )
  }
}

export default config

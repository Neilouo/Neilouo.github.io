import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import Head from 'next/head'
import { useI18n } from '../../components/I18nProvider'

interface BlogPostProps {
  post: {
    slug: string
    title: string
    content: string
    date: string
    readTime: number
    tags: string[]
    excerpt: string
  }
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const { t } = useI18n()
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl
        })
      } catch {
        void navigator.clipboard.writeText(shareUrl)
        alert(t('link_copied'))
      }
    } else {
      void navigator.clipboard.writeText(shareUrl)
      alert(t('link_copied'))
    }
  }

  return (
    <>
      <Head>
        <title>{post.title} | Nan&apos;s Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-accent hover:text-accent-dark transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              {t('back_to_blog')}
            </Link>
          </motion.div>

          {/* 文章头部 */}
          <motion.header
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-warm-900 dark:text-warm-50 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-warm-600 dark:text-warm-400 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime} {t('min_read')}
              </div>
              <button
                onClick={() => {
                  void handleShare()
                }}
                className="flex items-center hover:text-accent transition-colors duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('share')}
              </button>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 justify-center">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                >
                  <Tag className="inline w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.header>

          {/* 文章内容 */}
          <motion.article
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-warm-900 rounded-card shadow-card p-8 md:p-12 border border-warm-100 dark:border-warm-800"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-warm-900 dark:prose-headings:text-warm-50
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-warm-200 dark:prose-h2:border-warm-800 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
              prose-p:text-warm-700 dark:prose-p:text-warm-300 prose-p:leading-relaxed
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-warm-900 dark:prose-strong:text-warm-50
              prose-code:bg-warm-100 dark:prose-code:bg-warm-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-warm-900 prose-pre:rounded-lg prose-pre:p-0
              prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 dark:prose-blockquote:bg-accent/10 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
              prose-ul:space-y-2 prose-ol:space-y-2
              prose-li:text-warm-700 dark:prose-li:text-warm-300
              prose-table:w-full prose-table:border-collapse
              prose-th:bg-warm-50 dark:prose-th:bg-warm-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:p-3 prose-td:border prose-td:border-warm-200 dark:prose-td:border-warm-800"
            >
              <ReactMarkdown
                components={{
                  code ({ node: _node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match
                      ? (
                        <div className="relative">
                          <div className="absolute top-2 right-2 text-xs text-warm-400 bg-warm-800 px-2 py-1 rounded">
                            {match[1]}
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg !mt-0 !mb-6"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                        )
                      : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                        )
                  },
                  table ({ children }) {
                    return (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border border-warm-200 dark:border-warm-800 rounded-lg">
                          {children}
                        </table>
                      </div>
                    )
                  },
                  th ({ children }) {
                    return (
                      <th className="bg-warm-50 dark:bg-warm-800 px-4 py-3 text-left font-semibold text-warm-900 dark:text-warm-50 border-b border-warm-200 dark:border-warm-800">
                        {children}
                      </th>
                    )
                  },
                  td ({ children }) {
                    return (
                      <td className="px-4 py-3 text-warm-700 dark:text-warm-300 border-b border-warm-200 dark:border-warm-800">
                        {children}
                      </td>
                    )
                  },
                  blockquote ({ children }) {
                    return (
                      <blockquote className="border-l-4 border-accent bg-accent/5 dark:bg-accent/10 p-4 rounded-r-lg my-6 italic">
                        {children}
                      </blockquote>
                    )
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </motion.article>

          {/* 底部导航 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('view_more_posts')}
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const docsDirectory = path.join(process.cwd(), 'docs')

  let paths: Array<{ params: { slug: string } }> = []

  try {
    const filenames = fs.readdirSync(docsDirectory)
    const markdownFiles = filenames.filter(name => name.endsWith('.md'))

    paths = markdownFiles.map(filename => ({
      params: {
        slug: filename.replace(/\.md$/, '')
      }
    }))
  } catch {
    return { paths, fallback: false }
  }

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const docsDirectory = path.join(process.cwd(), 'docs')
  const filePath = path.join(docsDirectory, `${slug}.md`)

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const excerpt = content
      .replace(/^#.*$/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[#*`[\]]/g, '')
      .trim()
      .substring(0, 150) + '...'

    const readTime = Math.max(1, Math.ceil(content.length / 200 / 5))

    const tags: string[] = data.tags || []

    const post = {
      slug,
      title: data.title || content.match(/^# (.+)$/m)?.[1] || slug,
      content,
      date: data.date || new Date().toISOString().slice(0, 10),
      readTime,
      tags,
      excerpt
    }

    return {
      props: {
        post
      }
    }
  } catch {
    return {
      notFound: true
    }
  }
}

export default BlogPost

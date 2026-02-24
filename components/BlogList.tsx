import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Tag, Calendar, Clock, ArrowRight } from 'lucide-react'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

interface BlogListProps {
  posts: BlogPost[]
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="w-full">
      <div className="mb-10 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-card border border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-900 text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedTag === null
                ? 'bg-accent text-white'
                : 'bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700'
            }`}
          >
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-accent text-white'
                  : 'bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-warm-500 dark:text-warm-400 mb-6">
        找到 <span className="font-medium text-accent">{filteredPosts.length}</span> 篇文章
      </p>

      <div className="space-y-1">
        {filteredPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <article className="flex items-start justify-between gap-4 py-5 border-b border-warm-100 dark:border-warm-800">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-warm-900 dark:text-warm-50 group-hover:text-accent transition-colors truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-warm-500 dark:text-warm-400 mt-1 line-clamp-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-warm-400 dark:text-warm-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-warm-300 group-hover:text-accent transition-colors flex-shrink-0 mt-1.5" />
            </article>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-warm-500 dark:text-warm-400">暂无匹配文章，尝试调整搜索条件</p>
        </div>
      )}
    </div>
  )
}

export default BlogList

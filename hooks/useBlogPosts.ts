import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

export const getBlogPosts = (): BlogPost[] => {
  try {
    const docsDirectory = path.join(process.cwd(), 'docs')
    const filenames = fs.readdirSync(docsDirectory)
    const markdownFiles = filenames.filter(name => name.endsWith('.md'))

    const posts = markdownFiles.map(filename => {
      const filePath = path.join(docsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      const slug = filename.replace(/\.md$/, '')

      const excerpt = content
        .replace(/^#.*$/gm, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[#*`[\]]/g, '')
        .trim()
        .substring(0, 150) + '...'

      const readTime = `${Math.max(1, Math.ceil(content.length / 200 / 5))} 分钟阅读`

      const tags: string[] = data.tags || [
        filename.includes('cloud') ? '云计算' : '',
        filename.includes('optimization') ? '性能优化' : '',
        filename.includes('fix') ? '问题修复' : '',
        '技术'
      ].filter(Boolean)

      return {
        slug,
        title: data.title || content.match(/^# (.+)$/m)?.[1] || slug,
        excerpt,
        date: data.date || new Date().toLocaleDateString('zh-CN'),
        readTime,
        tags,
        content
      }
    })

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch {
    return []
  }
}

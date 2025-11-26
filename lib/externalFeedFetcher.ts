import type { ExternalArticle, ExternalSource } from '../data/externalArticles'
import { externalArticles as sampleArticles } from '../data/externalArticles'

const DEFAULT_CACHE_MS = 1000 * 60 * 5
const MAX_ITEMS_PER_SOURCE = 8

interface FeedConfig {
  id: ExternalSource
  label: string
  envKey: string
  defaultUrl: string
  topics: string[]
}

const feedConfigs: FeedConfig[] = [
  {
    id: 'csdn',
    label: 'CSDN',
    envKey: 'EXTERNAL_FEED_CSDN_URL',
    defaultUrl: 'https://blog.csdn.net/Neilouo/rss/list',
    topics: ['CSDN']
  },
  {
    id: 'juejin',
    label: '掘金',
    envKey: 'EXTERNAL_FEED_JUEJIN_URL',
    defaultUrl: 'https://rsshub.app/juejin/user/869062301713515/posts',
    topics: ['掘金']
  },
  {
    id: 'cnblogs',
    label: '博客园',
    envKey: 'EXTERNAL_FEED_CNBLOGS_URL',
    defaultUrl: 'https://www.cnblogs.com/3734723/rss/',
    topics: ['博客园']
  },
  {
    id: 'stackoverflow',
    label: 'Stack Overflow',
    envKey: 'EXTERNAL_FEED_STACKOVERFLOW_URL',
    defaultUrl: 'https://stackoverflow.com/feeds/user/25348988',
    topics: ['Stack Overflow']
  }
]

interface CacheRecord {
  data: ExternalArticle[]
  expires: number
}

let cache: CacheRecord | null = null

const isCacheFresh = (record: CacheRecord | null, timestamp: number): record is CacheRecord => {
  return (record?.expires ?? 0) > timestamp
}

const rssItemRegex = /<item[\s\S]*?<\/item>/gi

const decodeHtml = (input: string): string =>
  input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")

const stripHtml = (input: string): string =>
  decodeHtml(input)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const extractTag = (block: string, tag: string): string => {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const match = block.match(regex)
  return match ? decodeHtml(match[1]).trim() : ''
}

const parseRss = (xml: string, config: FeedConfig): ExternalArticle[] => {
  const items = xml.match(rssItemRegex) ?? []
  return items.slice(0, MAX_ITEMS_PER_SOURCE).map((itemBlock) => {
    const link = extractTag(itemBlock, 'link')
    const title = stripHtml(extractTag(itemBlock, 'title'))
    const description = stripHtml(extractTag(itemBlock, 'description'))
    const publishedAt = extractTag(itemBlock, 'pubDate') || new Date().toISOString()

    const idSource = link || `${config.id}-${title}`
    const id = Buffer.from(idSource).toString('base64').replace(/=+$/, '')

    return {
      id,
      title: title || config.label,
      summary: description || '点击查看原文',
      url: link || config.defaultUrl,
      source: config.id,
      publishedAt,
      topics: config.topics
    }
  })
}

const resolveUrl = (config: FeedConfig): string | null => {
  const envUrl = process.env[config.envKey]
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl
  }
  if (!config.defaultUrl.includes('<your-id>')) {
    return config.defaultUrl
  }
  return null
}

const fetchSource = async (config: FeedConfig): Promise<ExternalArticle[]> => {
  const url = resolveUrl(config)
  if (!url) return []

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Neilouo-Blog-Fetcher/1.0' } })
    if (!response.ok) {
      throw new Error(`${config.id} feed error: ${response.status}`)
    }
    const xml = await response.text()
    return parseRss(xml, config)
  } catch (error) {
    console.warn(`[external-feed] ${config.id} 获取失败`, error)
    return []
  }
}

export const fetchExternalArticlesWithCache = async (
  options: { maxAgeMs?: number } = {}
): Promise<ExternalArticle[]> => {
  const maxAge = options.maxAgeMs ?? DEFAULT_CACHE_MS
  const now = Date.now()

  if (isCacheFresh(cache, now)) {
    return cache.data
  }

  const results = await Promise.all(feedConfigs.map(fetchSource))
  const merged = results.flat()

  const dedupedMap = new Map<string, ExternalArticle>()
  merged.forEach((article) => {
    if (article.url && !dedupedMap.has(article.url)) {
      dedupedMap.set(article.url, article)
    }
  })

  const normalized = (dedupedMap.size > 0 ? Array.from(dedupedMap.values()) : sampleArticles).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  cache = { data: normalized, expires: now + maxAge }
  return normalized
}

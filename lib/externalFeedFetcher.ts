import type { ExternalArticle, ExternalSource } from '../data/externalArticles'
import { externalArticles as sampleArticles } from '../data/externalArticles'
import { Client } from '@notionhq/client'

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
    defaultUrl: 'https://blog.csdn.net/Breatsam/rss/list',
    topics: ['CSDN']
  },
  {
    id: 'cnblogs',
    label: '博客园',
    envKey: 'EXTERNAL_FEED_CNBLOGS_URL',
    defaultUrl: 'https://www.cnblogs.com/ne1l/rss/',
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

/* ── Juejin API fetcher ────────────────────────────────── */

const JUEJIN_USER_ID = process.env.JUEJIN_USER_ID || '869062301713515'
const JUEJIN_API = 'https://api.juejin.cn/content_api/v1/article/query_list'

interface JuejinArticleInfo {
  article_id: string
  title: string
  brief_content: string
  view_count: number
  digg_count: number
  comment_count: number
  ctime: string
}

const fetchJuejinArticles = async (): Promise<ExternalArticle[]> => {
  try {
    const response = await fetch(JUEJIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: JUEJIN_USER_ID,
        cursor: '0',
        sort_type: 2,
        count: MAX_ITEMS_PER_SOURCE
      })
    })
    if (!response.ok) throw new Error(`Juejin API error: ${response.status}`)

    const json = await response.json() as { err_no: number; data: Array<{ article_info: JuejinArticleInfo; tags?: Array<{ tag_name: string }> }> }
    if (json.err_no !== 0 || !json.data) return []

    return json.data.map((item) => {
      const a = item.article_info
      const tags = item.tags?.map((t: { tag_name: string }) => t.tag_name).slice(0, 3) ?? []
      return {
        id: `juejin-${a.article_id}`,
        title: a.title,
        summary: a.brief_content?.slice(0, 120) || '点击查看原文',
        url: `https://juejin.cn/post/${a.article_id}`,
        source: 'juejin' as ExternalSource,
        publishedAt: new Date(Number(a.ctime) * 1000).toISOString(),
        topics: tags.length > 0 ? tags : ['掘金'],
        stats: {
          views: String(a.view_count || 0),
          likes: String(a.digg_count || 0),
          comments: String(a.comment_count || 0)
        }
      }
    })
  } catch (error) {
    console.warn('[external-feed] 掘金获取失败', error)
    return []
  }
}

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
  if (envUrl?.startsWith('http')) {
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

/* ── Notion fetcher ─────────────────────────────────────── */

const getNotionTextProp = (page: any, names: string[]): string => {
  for (const name of names) {
    const prop = page.properties?.[name]
    if (!prop) continue
    if (prop.type === 'title') return prop.title?.map((t: any) => t.plain_text).join('') ?? ''
    if (prop.type === 'rich_text') return prop.rich_text?.map((t: any) => t.plain_text).join('') ?? ''
  }
  return ''
}

const getNotionDateProp = (page: any, names: string[]): string => {
  for (const name of names) {
    const prop = page.properties?.[name]
    if (prop?.type === 'date' && prop.date?.start) return prop.date.start
    if (prop?.type === 'created_time') return prop.created_time
    if (prop?.type === 'last_edited_time') return prop.last_edited_time
  }
  return page.created_time ?? new Date().toISOString()
}

const getNotionUrlProp = (page: any, names: string[]): string => {
  for (const name of names) {
    const prop = page.properties?.[name]
    if (prop?.type === 'url' && prop.url) return prop.url
  }
  return page.url ?? ''
}

const getNotionMultiSelectProp = (page: any, names: string[]): string[] => {
  for (const name of names) {
    const prop = page.properties?.[name]
    if (prop?.type === 'multi_select') return prop.multi_select?.map((s: any) => s.name) ?? []
    if (prop?.type === 'select' && prop.select?.name) return [prop.select.name]
  }
  return []
}

const getNotionCheckboxProp = (page: any, names: string[]): boolean | null => {
  for (const name of names) {
    const prop = page.properties?.[name]
    if (prop?.type === 'checkbox') return prop.checkbox
  }
  return null
}

const fetchNotionArticles = async (): Promise<ExternalArticle[]> => {
  const token = process.env.NOTION_TOKEN
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!token || !databaseId) return []

  try {
    const notion = new Client({ auth: token })
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: MAX_ITEMS_PER_SOURCE,
      sorts: [{ timestamp: 'created_time', direction: 'descending' }]
    })

    return response.results
      .filter((page: any) => {
        const published = getNotionCheckboxProp(page, ['Published', 'published', '已发布', 'public', 'Public'])
        return published === null || published === true
      })
      .map((page: any) => {
        const title = getNotionTextProp(page, ['Name', 'name', 'Title', 'title', '标题', '名称'])
        const summary = getNotionTextProp(page, ['Summary', 'summary', 'Description', 'description', '摘要', '描述'])
        const url = getNotionUrlProp(page, ['URL', 'url', 'Link', 'link', '链接'])
        const publishedAt = getNotionDateProp(page, ['Date', 'date', 'Published', 'published', '日期', '发布日期', 'Created'])
        const topics = getNotionMultiSelectProp(page, ['Tags', 'tags', 'Topics', 'topics', '标签', '分类'])

        return {
          id: `notion-${page.id}`,
          title: title || 'Notion Page',
          summary: summary || '来自 Notion 的文章',
          url: url || page.url,
          source: 'notion' as ExternalSource,
          publishedAt,
          topics: topics.length > 0 ? topics : ['Notion']
        }
      })
  } catch (error) {
    console.warn('[external-feed] Notion 获取失败', error)
    return []
  }
}

/* ── Aggregator ─────────────────────────────────────────── */

export const fetchExternalArticlesWithCache = async (
  options: { maxAgeMs?: number } = {}
): Promise<ExternalArticle[]> => {
  const maxAge = options.maxAgeMs ?? DEFAULT_CACHE_MS
  const now = Date.now()

  if (isCacheFresh(cache, now)) {
    return cache.data
  }

  const [rssResults, juejinResults, notionResults] = await Promise.all([
    Promise.all(feedConfigs.map(fetchSource)),
    fetchJuejinArticles(),
    fetchNotionArticles()
  ])
  const merged = [...rssResults.flat(), ...juejinResults, ...notionResults]

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

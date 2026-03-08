/**
 * AI Radar 每日数据拉取：arXiv 论文 + 新闻 RSS，输出 public/ai-daily/YYYY-MM-DD.json
 * 用法: node scripts/ai-daily-fetch.mjs [YYYY-MM-DD]
 * 不传日期时使用「昨日」(UTC)；CI 建议传 TZ=Asia/Shanghai 的昨日。
 */

import got from 'got'
import Parser from 'rss-parser'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'public', 'ai-daily')

// arXiv 分类 -> 前端 primaryArea（与 AiRadarFeed 分组一致）
const ARXIV_CAT_TO_AREA = {
  'cs.CL': 'LLM / 对话模型',
  'cs.AI': 'LLM / 对话模型',
  'cs.LG': 'LLM / 对话模型',
  'stat.ML': 'LLM / 对话模型',
  'cs.MA': '智能体 & 工具调用',
  'cs.CV': '视觉 & 生成图像',
  'eess.IV': '视觉 & 生成图像',
  'eess.AS': '多模态',
  'cs.SD': '多模态',
  'cs.RO': '具身 / 机器人',
  'cs.CY': '其他',
  'cs.IR': '其他',
  'cs.NE': '其他',
}

const DEFAULT_AREA = '其他'

// 可配置的新闻 RSS（可后续在环境变量或配置文件扩展）
const RSS_FEEDS = [
  'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
]

function getTargetDate () {
  const arg = process.argv[2]
  if (arg && /^\d{4}-\d{2}-\d{2}$/.test(arg)) return arg
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

function stripHtml (s) {
  if (!s || typeof s !== 'string') return ''
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function truncate (s, max = 300) {
  if (!s || typeof s !== 'string') return ''
  const t = s.trim()
  return t.length <= max ? t : t.slice(0, max) + '…'
}

// 从 arXiv Atom XML 中解析 entry 列表（不引入 XML 库，用简单正则）
function parseArxivAtom (xml) {
  const entries = []
  const entryBlobs = xml.split(/<entry>|<\/entry>/).filter(Boolean)
  for (const blob of entryBlobs) {
    if (!blob.includes('<id>') || !blob.includes('arxiv.org')) continue
    const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(blob) || [])[1]
    const link = (/<link[^>]+href="(https:\/\/arxiv\.org\/abs\/[^"]+)"[^>]*rel="alternate"/i.exec(blob) || [])[1]
    const summary = (/<summary[^>]*>([\s\S]*?)<\/summary>/i.exec(blob) || [])[1]
    const published = (/<published>([^<]+)<\/published>/i.exec(blob) || [])[1]
    const primaryCat = (/arxiv:primary_category[^>]+term="([^"]+)"/i.exec(blob) || [])[1] ||
      (/<category[^>]+term="([^"]+)"[^>]*scheme="http:\/\/arxiv\.org\/schemas\/atom"/i.exec(blob) || [])[1]
    const authors = []
    const affiliations = []
    const authorBlocks = blob.match(/<author>[\s\S]*?<\/author>/gi) || []
    for (const ab of authorBlocks) {
      const name = (/<name>([\s\S]*?)<\/name>/i.exec(ab) || [])[1]
      if (name) authors.push(stripHtml(name))
      const aff = (/arxiv:affiliation>([\s\S]*?)<\/arxiv:affiliation>/i.exec(ab) || [])[1]
      if (aff) affiliations.push(stripHtml(aff))
    }
    const categoryTerms = (blob.match(/<category[^>]+term="([^"]+)"/gi) || []).map(m => (m.match(/term="([^"]+)"/) || [])[1]).filter(Boolean)
    if (!title || !link) continue
    entries.push({
      title: stripHtml(title),
      summary: truncate(stripHtml(summary || '')),
      link,
      published: (published || '').slice(0, 10),
      primaryCategory: primaryCat || (categoryTerms[0] || ''),
      categoryTerms,
      authors,
      affiliations: [...new Set(affiliations)],
    })
  }
  return entries
}

async function fetchArxiv (dateStr) {
  const [y, m, d] = dateStr.split('-')
  const day = y + m + d
  const query = `(cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV OR cat:cs.MA OR cat:stat.ML OR cat:eess.AS OR cat:eess.IV) AND submittedDate:[${day}0000 TO ${day}2359]`
  const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&start=0&max_results=150&sortBy=submittedDate&sortOrder=descending`
  const res = await got(url, { responseType: 'text' })
  const raw = parseArxivAtom(res.body)
  return raw.map((e) => ({
    type: 'paper',
    title: e.title,
    summary: e.summary,
    authors: e.authors.slice(0, 5),
    affiliations: e.affiliations.slice(0, 3),
    primaryArea: ARXIV_CAT_TO_AREA[e.primaryCategory] || ARXIV_CAT_TO_AREA[e.categoryTerms?.[0]] || DEFAULT_AREA,
    tags: e.categoryTerms?.slice(0, 5) || [],
    url: e.link,
    source: 'arXiv',
    publishedAt: e.published,
  }))
}

async function fetchRss (feedUrl) {
  const parser = new Parser({ timeout: 15000 })
  const feed = await parser.parseURL(feedUrl)
  const dateStr = getTargetDate()
  const items = (feed.items || []).slice(0, 20).map((item) => ({
    type: 'news',
    title: (item.title || '').trim(),
    summary: truncate(stripHtml(item.contentSnippet || item.content || item.summary || '')),
    authors: item.creator ? [item.creator] : [],
    affiliations: [],
    primaryArea: '其他',
    tags: [],
    url: item.link || '',
    source: feed.title || new URL(feedUrl).hostname,
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString().slice(0, 10) : dateStr,
  })).filter((i) => i.title && i.url)
  return items
}

async function main () {
  const dateStr = getTargetDate()
  console.log('Target date:', dateStr)

  const papers = await fetchArxiv(dateStr).catch((e) => {
    console.warn('arXiv fetch failed:', e.message)
    return []
  })

  let news = []
  for (const feedUrl of RSS_FEEDS) {
    const items = await fetchRss(feedUrl).catch((e) => {
      console.warn('RSS fetch failed', feedUrl, e.message)
      return []
    })
    news = news.concat(items)
  }

  // 新闻按日期过滤：只保留目标日或前一天的（RSS 可能没有精确日期）
  const d0 = new Date(dateStr + 'T12:00:00Z')
  d0.setUTCDate(d0.getUTCDate() - 1)
  const dayBefore = d0.toISOString().slice(0, 10)
  news = news.filter((n) => n.publishedAt === dateStr || n.publishedAt === dayBefore)
  if (news.length === 0) news = (await Promise.all(RSS_FEEDS.map((u) => fetchRss(u).catch(() => [])))).flat().slice(0, 15)

  const payload = {
    date: dateStr,
    items: [...papers, ...news],
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const outPath = join(OUT_DIR, `${dateStr}.json`)
  writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8')
  console.log('Wrote', outPath, '| papers:', papers.length, '| news:', news.length)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

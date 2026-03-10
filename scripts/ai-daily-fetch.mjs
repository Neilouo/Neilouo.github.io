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

// AI 新闻 RSS（仅保留已测试可用的源，与文档列表一致）
const RSS_FEEDS = [
  // 官方研究机构
  'https://huggingface.co/blog/feed.xml',
  // 科技媒体
  'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://www.wired.com/category/artificial-intelligence/feed/',
  'https://www.theverge.com/ai-artificial-intelligence/rss',
  // 专业 AI 新闻
  'https://www.artificialintelligence-news.com/feed/rss/',
  'https://analyticsindiamag.com/feed/',
  'https://ai-techpark.com/feed',
  'https://rsshub.app/sspai/series/379', // 三花AI快讯
  // 社区
  'https://www.reddit.com/r/MachineLearning/.rss',
  'https://www.reddit.com/r/artificial/.rss',
  'https://rsshub.app/github/trending/ai', // GitHub Trending AI
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
  const res = await withTimeout(
    got(url, { responseType: 'text', timeout: { request: FEED_TIMEOUT_MS } }),
    FEED_TIMEOUT_MS,
    'arXiv'
  )
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

const FEED_TIMEOUT_MS = 60000   // 单条链接超时 1 分钟
const SCRIPT_TIMEOUT_MS = 180000 // 整体脚本最多 3 分钟，防止卡死

/** 为 Promise 加硬超时，超时则 reject，避免库内部不生效导致一直挂起 */
function withTimeout (p, ms, label = '') {
  const t = new Promise((_, reject) => {
    const id = setTimeout(() => reject(new Error(`timeout ${ms}ms${label ? ' ' + label : ''}`)), ms)
    p.finally(() => clearTimeout(id)).catch(() => {})
  })
  return Promise.race([p, t])
}

async function fetchRss (feedUrl) {
  const parser = new Parser({
    timeout: FEED_TIMEOUT_MS,
    headers: { 'User-Agent': 'AI-Radar-Bot/1.0 (https://github.com/Neilouo/Neilouo.github.io)' },
  })
  const dateStr = getTargetDate()
  const feed = await withTimeout(parser.parseURL(feedUrl), FEED_TIMEOUT_MS, feedUrl)
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

  // 所有 RSS 并行拉取，每条带 1 分钟硬超时，总耗时约 1 分钟内
  const rssResults = await Promise.allSettled(
    RSS_FEEDS.map((feedUrl) =>
      withTimeout(fetchRss(feedUrl), FEED_TIMEOUT_MS, feedUrl).then((items) => ({ feedUrl, items }))
    )
  )
  let news = []
  for (const r of rssResults) {
    if (r.status === 'fulfilled') {
      news = news.concat(r.value.items)
    } else {
      console.warn('RSS skip:', r.reason?.message || r.reason)
    }
  }

  // 新闻按日期过滤：只保留目标日或前一天的（RSS 可能没有精确日期）
  const d0 = new Date(dateStr + 'T12:00:00Z')
  d0.setUTCDate(d0.getUTCDate() - 1)
  const dayBefore = d0.toISOString().slice(0, 10)
  news = news.filter((n) => n.publishedAt === dateStr || n.publishedAt === dayBefore)
  if (news.length === 0) {
    const fallback = rssResults
      .filter((r) => r.status === 'fulfilled' && r.value.items?.length)
      .flatMap((r) => r.value.items)
    news = fallback.slice(0, 15)
  }

  const payload = {
    date: dateStr,
    items: [...papers, ...news],
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const outPath = join(OUT_DIR, `${dateStr}.json`)
  writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8')
  console.log('Wrote', outPath, '| papers:', papers.length, '| news:', news.length)
}

// 全局“保险丝”：无论内部是否有挂起的网络请求，超过 SCRIPT_TIMEOUT_MS 直接强制退出，
// 避免在 CI / GitHub Actions 中无限挂起导致 workflow 超时。
const globalTimeoutId = setTimeout(() => {
  console.error(`Global timeout ${SCRIPT_TIMEOUT_MS}ms, force exit.`)
  process.exit(1)
}, SCRIPT_TIMEOUT_MS)

main()
  .then(() => {
    clearTimeout(globalTimeoutId)
    // 成功完成时显式退出，避免 Node 因为残留的网络连接 / 定时器而不退出
    process.exit(0)
  })
  .catch((e) => {
    clearTimeout(globalTimeoutId)
    console.error(e.message || e)
    process.exit(1)
  })


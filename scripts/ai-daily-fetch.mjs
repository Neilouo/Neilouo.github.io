/**
 * AI Radar 每日数据拉取：arXiv 论文 + 新闻 RSS，输出 public/ai-daily/YYYY-MM-DD.json
 * 用法: node scripts/ai-daily-fetch.mjs [YYYY-MM-DD]
 * 不传日期时使用「昨日」(UTC)；CI 建议传 TZ=Asia/Shanghai 的昨日。
 */

import Parser from 'rss-parser'
import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
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

// arXiv RSS feeds（按分类），比 Atom API 更轻量稳定，返回最近一期论文
const ARXIV_RSS_FEEDS = [
  { url: 'https://arxiv.org/rss/cs.AI', cat: 'cs.AI' },
  { url: 'https://arxiv.org/rss/cs.LG', cat: 'cs.LG' },
  { url: 'https://arxiv.org/rss/cs.CL', cat: 'cs.CL' },
  { url: 'https://arxiv.org/rss/cs.CV', cat: 'cs.CV' },
  { url: 'https://arxiv.org/rss/cs.MA', cat: 'cs.MA' },
  { url: 'https://arxiv.org/rss/stat.ML', cat: 'stat.ML' }
]

async function fetchArxiv (dateStr) {
  const parser = new Parser({
    timeout: FEED_TIMEOUT_MS,
    customFields: { item: [['dc:creator', 'dcCreator']] },
    headers: { 'User-Agent': 'AI-Radar-Bot/1.0 (https://github.com/Neilouo/Neilouo.github.io)' }
  })

  const results = await Promise.allSettled(
    ARXIV_RSS_FEEDS.map(({ url, cat }) =>
      withTimeout(parser.parseURL(url), FEED_TIMEOUT_MS, url)
        .then(feed => ({ cat, items: feed.items || [] }))
    )
  )

  const seen = new Set()
  const papers = []

  for (const r of results) {
    if (r.status !== 'fulfilled') {
      console.warn('arXiv RSS skip:', r.reason?.message || r.reason)
      continue
    }
    const { cat, items } = r.value
    for (const item of items) {
      const url = item.link || ''
      if (!url || seen.has(url)) continue
      seen.add(url)
      const authors = (item.dcCreator || '')
        .split(/,\s*|\s+and\s+/i)
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 5)
      papers.push({
        type: 'paper',
        title: stripHtml(item.title || '').replace(/\s*\([^)]*\)\s*$/, '').trim(),
        summary: truncate(stripHtml(item.contentSnippet || item.content || item.summary || '')),
        authors,
        affiliations: [],
        primaryArea: ARXIV_CAT_TO_AREA[cat] || DEFAULT_AREA,
        tags: [cat],
        url,
        source: 'arXiv',
        publishedAt: dateStr
      })
    }
  }

  console.log(`arXiv RSS: fetched ${papers.length} papers`)
  return papers
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

  // Clean up files older than 14 days
  try {
    const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000
    const files = readdirSync(OUT_DIR).filter(f => f.endsWith('.json') && f !== 'sample.json')
    for (const f of files) {
      const datePart = f.replace('.json', '')
      const fileDate = new Date(datePart).getTime()
      if (!isNaN(fileDate) && fileDate < cutoff) {
        unlinkSync(join(OUT_DIR, f))
        console.log('Cleaned up old file:', f)
      }
    }
  } catch {}
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


/**
 * 构建时抓取外部文章（CSDN / 掘金 / 博客园 / Stack Overflow / Notion），输出 public/external-posts.json
 * 用法: pnpm run fetch:external
 * 在 next build / next dev 前自动运行，保证静态导出站点（GitHub Pages）可用。
 * 背景：output: 'export' 不会导出 pages/api/*，故前端改为读取这份构建时生成的静态 JSON。
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { fetchExternalArticlesWithCache } from '../lib/externalFeedFetcher'
import { externalArticles as sampleArticles } from '../data/externalArticles'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'public')
const OUT_FILE = join(OUT_DIR, 'external-posts.json')
const SCRIPT_TIMEOUT_MS = 180000

async function main (): Promise<void> {
  let articles
  try {
    articles = await fetchExternalArticlesWithCache()
    console.log(`[external-posts] fetched ${articles.length} articles`)
  } catch (e) {
    console.warn('[external-posts] fetch failed, using sample data:', e instanceof Error ? e.message : e)
    articles = sampleArticles
  }

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify({ articles }, null, 2), 'utf8')
  console.log('[external-posts] wrote', OUT_FILE)
}

const globalTimeoutId = setTimeout(() => {
  console.error(`[external-posts] Global timeout ${SCRIPT_TIMEOUT_MS}ms, force exit.`)
  process.exit(1)
}, SCRIPT_TIMEOUT_MS)

main()
  .then(() => {
    clearTimeout(globalTimeoutId)
    process.exit(0)
  })
  .catch((e) => {
    clearTimeout(globalTimeoutId)
    console.error(e)
    process.exit(1)
  })

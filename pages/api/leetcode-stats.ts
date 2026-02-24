import type { NextApiRequest, NextApiResponse } from 'next'

const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME || 'NanSang2000'
const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql'

const QUERY = `query ($username: String!) {
  matchedUser(username: $username) {
    username
    profile { ranking realName userAvatar }
    submitStats {
      acSubmissionNum { difficulty count }
      totalSubmissionNum { difficulty count }
    }
  }
  userContestRanking(username: $username) {
    attendedContestsCount rating globalRanking totalParticipants
  }
}`

interface CacheRecord { data: any; expires: number }
let cache: CacheRecord | null = null
const CACHE_MS = 1000 * 60 * 30

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const now = Date.now()
  if (cache && cache.expires > now) {
    return res.status(200).json(cache.data)
  }

  try {
    const response = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { username: LEETCODE_USERNAME } })
    })
    const json = await response.json()
    const user = json.data?.matchedUser
    const contest = json.data?.userContestRanking

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const acMap: Record<string, number> = {}
    const totalMap: Record<string, number> = {}
    user.submitStats.acSubmissionNum.forEach((s: any) => { acMap[s.difficulty] = s.count })
    user.submitStats.totalSubmissionNum.forEach((s: any) => { totalMap[s.difficulty] = s.count })

    const result = {
      username: user.username,
      realName: user.profile.realName,
      avatar: user.profile.userAvatar,
      ranking: user.profile.ranking,
      solved: {
        total: acMap['All'] || 0,
        easy: acMap['Easy'] || 0,
        medium: acMap['Medium'] || 0,
        hard: acMap['Hard'] || 0
      },
      submissions: {
        total: totalMap['All'] || 0,
        easy: totalMap['Easy'] || 0,
        medium: totalMap['Medium'] || 0,
        hard: totalMap['Hard'] || 0
      },
      contest: contest ? {
        rating: Math.round(contest.rating),
        globalRanking: contest.globalRanking,
        attended: contest.attendedContestsCount,
        totalParticipants: contest.totalParticipants
      } : null
    }

    cache = { data: result, expires: now + CACHE_MS }
    res.status(200).json(result)
  } catch (error) {
    console.error('[leetcode] fetch failed', error)
    res.status(500).json({
      username: LEETCODE_USERNAME,
      solved: { total: 15, easy: 9, medium: 6, hard: 0 },
      submissions: { total: 16, easy: 9, medium: 7, hard: 0 },
      contest: null,
      error: 'Failed to fetch LeetCode stats'
    })
  }
}

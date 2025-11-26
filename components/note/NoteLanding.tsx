'use client'

import NoteHero from './NoteHero'
import QuickFilters from './QuickFilters'
import KnowledgeMap from './KnowledgeMap'
import LearningJourney from './LearningJourney'
import Highlights from './Highlights'
import UtilityDeck from './UtilityDeck'
import { noteFilters, noteJourney, noteHighlights, noteUtilities } from '../../data/noteContent'

const totalNotes = noteFilters.reduce((acc, item) => acc + item.count, 0)

const heroStats = [
  { label: '笔记条目', value: `${totalNotes}+`, description: '累积整理的知识密度' },
  { label: '年度更新', value: '48', description: '2025 已发布篇章' },
  { label: '专题轨道', value: `${noteFilters.length}`, description: '持续维护的主线' }
]

const knowledgeStatsStatic = [
  { label: '精选入口', value: `${noteFilters.length}`, hint: 'Quick Tracks' },
  { label: '学习阶段', value: `${noteJourney.length}`, hint: 'Journey 里程碑' }
]

interface NoteLandingProps {
  contextJson: Record<string, unknown>
}

export default function NoteLanding ({ contextJson }: NoteLandingProps): JSX.Element {
  const areaCount = Object.values(contextJson).filter((value) => typeof value === 'string').length
  const knowledgeStats = [
    { label: '领域', value: `${areaCount}`, hint: '顶层分类' },
    ...knowledgeStatsStatic
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-16">
        <NoteHero
          title="Note Lab · 知识实验室"
          subtitle="NOTE SYSTEM"
          description="以设计化视角梳理编程、架构与效率笔记，串起「学习 → 实践 → 沉淀」的闭环，打造可探索、可复用的知识图谱。"
          badges={['Design-driven Learning', 'Continuous Delivery', 'Public Notes']}
          stats={heroStats}
          primaryAction={{ label: '开始探索', href: '#note-map' }}
          secondaryAction={{ label: '查看最新', href: '#note-highlights' }}
          tertiaryAction={{ label: '订阅更新', href: '#note-utility' }}
        />

        <QuickFilters items={noteFilters} />

        <KnowledgeMap json={contextJson} stats={knowledgeStats} />

        <LearningJourney stages={noteJourney} />

        <Highlights data={noteHighlights} />

        <UtilityDeck items={noteUtilities} />
      </div>
    </div>
  )
}

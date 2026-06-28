'use client'

import { useTranslations } from 'next-intl'
import type { FlowLesson, LessonMode } from '@/data/lessons'
import { PACK_LABEL } from '@/data/lessons'
import type { LessonStatus } from '@/lib/lessonProgress'

const MODE_ICON: Record<LessonMode, string> = {
  normal:      '',
  blindFlow:   '🙈',
  noBackspace: '⌫',
  hardSigns:   'ą',
}

const MODE_BADGE: Record<LessonMode, { label: string; cls: string } | null> = {
  normal:      null,
  blindFlow:   { label: 'Blind',  cls: 'bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/25' },
  noBackspace: { label: 'No ⌫',  cls: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/25' },
  hardSigns:   { label: 'ą·ę·ź', cls: 'bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/25' },
}

const STATUS_CLS: Record<LessonStatus, string> = {
  locked:    'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-[#111] border-gray-200 dark:border-[#222]',
  available: 'cursor-pointer bg-white dark:bg-[#161616] border-gray-200 dark:border-[#2a2a2a] hover:border-[var(--accent-400)] dark:hover:border-[var(--accent-500)]/50 hover:shadow-sm',
  completed: 'cursor-pointer bg-teal-50 dark:bg-teal-500/6 border-teal-200 dark:border-teal-500/20 hover:border-teal-300 dark:hover:border-teal-400/30',
  mastered:  'cursor-pointer bg-amber-50 dark:bg-amber-500/6 border-amber-200 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-400/30',
}

interface Props {
  lesson: FlowLesson
  status: LessonStatus
  stars: 0 | 1 | 2 | 3 | 4 | 5
  isNext?: boolean
  onClick?: () => void
  onSkip?: () => void
}

export default function LessonTile({ lesson, status, stars, isNext, onClick, onSkip }: Props) {
  const t = useTranslations('lessons')
  const modeBadge = MODE_BADGE[lesson.mode]
  const modeIcon = MODE_ICON[lesson.mode]
  const isLocked = status === 'locked'

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      className={`relative w-full text-left border rounded-2xl px-4 py-4 transition-all duration-150 ${STATUS_CLS[status]}`}
    >
      {/* Top row: number + stars */}
      <div className="flex items-start justify-between mb-2">
        <span className={`text-sm font-mono font-bold tabular-nums ${
          isLocked ? 'text-gray-400 dark:text-gray-600' :
          status === 'mastered' ? 'text-amber-500 dark:text-amber-400' :
          status === 'completed' ? 'text-teal-500 dark:text-teal-400' :
          'text-[var(--accent-500)] dark:text-[var(--accent-400)]'
        }`}>
          {String(lesson.id).padStart(3, '0')}
        </span>
        <Stars count={stars} status={status} />
      </div>

      {/* Title */}
      <p className={`text-sm font-semibold leading-tight mb-2 ${
        isLocked ? 'text-gray-400 dark:text-gray-600' :
        status === 'mastered' ? 'text-amber-700 dark:text-amber-300' :
        status === 'completed' ? 'text-teal-700 dark:text-teal-300' :
        'text-gray-800 dark:text-gray-200'
      }`}>
        {isLocked && modeIcon ? `${modeIcon} ···` : lesson.title}
      </p>

      {/* Pack + mode badge */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[9px] ${isLocked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400 dark:text-gray-600'}`}>
          {PACK_LABEL[lesson.pack]}
        </span>
        {modeBadge && !isLocked && (
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${modeBadge.cls}`}>
            {modeBadge.label}
          </span>
        )}
      </div>

      {/* Difficulty dots */}
      <div className="flex gap-0.5 mt-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full ${
            i < lesson.difficulty
              ? isLocked
                ? 'bg-gray-300 dark:bg-gray-700'
                : status === 'mastered' ? 'bg-amber-400' : status === 'completed' ? 'bg-teal-400' : 'bg-[var(--accent-400)]'
              : 'bg-gray-200 dark:bg-[#2a2a2a]'
          }`} />
        ))}
      </div>

      {/* Lock icon */}
      {isLocked && (
        <span className="absolute top-3 right-3 text-gray-400 dark:text-gray-600 text-xs">🔒</span>
      )}

      {/* "następna" label */}
      {isNext && !isLocked && (
        <span className="absolute top-2.5 right-2.5 text-[8px] font-bold bg-[var(--accent-500)] text-white px-1.5 py-0.5 rounded-full leading-tight">
          {t('next')}
        </span>
      )}

      {/* Skip button for blind/noBackspace lessons */}
      {onSkip && (
        <button
          onClick={e => { e.stopPropagation(); onSkip() }}
          className="absolute bottom-2.5 right-2.5 text-[9px] font-semibold text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] rounded-md px-1.5 py-0.5 transition-colors"
        >
          {t('skip')}
        </button>
      )}
    </button>
  )
}

function Stars({ count, status }: { count: number; status: LessonStatus }) {
  if (status === 'locked' || status === 'available') return null
  const color = status === 'mastered' ? 'text-amber-400' : 'text-teal-400'
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-xs leading-none ${i <= count ? color : 'text-gray-200 dark:text-gray-700'}`}>★</span>
      ))}
    </div>
  )
}

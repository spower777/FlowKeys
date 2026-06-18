import type { LessonPack } from './lessons'

export type PackGroupId = 'zen' | 'gaming' | 'self' | 'spirit' | 'story' | 'polish'

export interface PackGroup {
  id: PackGroupId
  label: string
  description: string
  icon: string
  packs: LessonPack[]
  defaultEnabled: boolean
}

export const PACK_GROUPS: PackGroup[] = [
  {
    id: 'zen',
    label: 'Zen Flow',
    description: 'Spokój, cisza, ruch. Filmowy klimat jadeitowej drogi.',
    icon: '🍃',
    packs: ['jadePath', 'start'],
    defaultEnabled: true,
  },
  {
    id: 'self',
    label: 'Self Flow',
    description: 'Afirmacje, motywacja i spokojny dialog ze sobą.',
    icon: '🌱',
    packs: ['affirmations', 'motivation', 'visualization', 'mindfulness', 'mastery', 'noBackspace', 'blindFlow'],
    defaultEnabled: true,
  },
  {
    id: 'story',
    label: 'Opowieści',
    description: 'Krótkie historyjki, emocje, relacje, pamięć.',
    icon: '📖',
    packs: ['stories', 'relationships'],
    defaultEnabled: true,
  },
  {
    id: 'polish',
    label: 'Polskie znaki',
    description: 'ą ę ć ł ń ó ś ź ż — ogonki bez paniki.',
    icon: 'ą',
    packs: ['polishSigns'],
    defaultEnabled: true,
  },
  {
    id: 'gaming',
    label: 'Gaming',
    description: 'Respawn, loot, baza. Trening w języku gracza.',
    icon: '🎮',
    packs: ['gaming'],
    defaultEnabled: false,
  },
  {
    id: 'spirit',
    label: 'Duchowość',
    description: 'Cisza, prowadzenie, modlitwa bez słów.',
    icon: '✦',
    packs: ['spirituality'],
    defaultEnabled: false,
  },
]

export const DEFAULT_PACK_GROUPS: PackGroupId[] = PACK_GROUPS
  .filter(g => g.defaultEnabled)
  .map(g => g.id)

export function getPacksForGroups(groupIds: PackGroupId[]): Set<LessonPack> {
  const packs = new Set<LessonPack>()
  for (const group of PACK_GROUPS) {
    if (groupIds.includes(group.id)) {
      for (const pack of group.packs) packs.add(pack)
    }
  }
  return packs
}

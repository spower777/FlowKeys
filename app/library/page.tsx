'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import {
  getLibrary, saveCustomText, updateCustomText, deleteCustomText,
  splitIntoChunks, CHUNK_THRESHOLD,
  type CustomText,
} from '@/lib/library'

const TAGS = [
  'Wspomnienie', 'Notatka', 'Nauka', 'Afirmacja', 'Modlitwa',
  'Opowieść', 'Praca', 'Rodzina', 'Trening', 'Inne',
] as const

const MOODS = [
  'Spokojny', 'Motywujący', 'Duchowy', 'Filmowy',
  'Gaming', 'Osobisty', 'Techniczny', 'Surowy',
] as const

const MOOD_EMOJI: Record<string, string> = {
  Spokojny: '🧘', Motywujący: '🔥', Duchowy: '✨', Filmowy: '🎬',
  Gaming: '🎮', Osobisty: '💛', Techniczny: '⚙️', Surowy: '🪨',
}

const TAG_EMOJI: Record<string, string> = {
  Wspomnienie: '💭', Notatka: '📝', Nauka: '📖', Afirmacja: '✊',
  Modlitwa: '🙏', Opowieść: '📜', Praca: '💼', Rodzina: '👨‍👩‍👧', Trening: '💪', Inne: '•',
}

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one
  if (n >= 2 && n <= 4) return few
  return many
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
}

// ── Add / Edit Form ──────────────────────────────────────────────────────────

interface FormProps {
  initialTitle?: string
  initialText?: string
  initialTags?: string[]
  initialMood?: string
  isEdit?: boolean
  onSave: (data: { title: string; text: string; tags: string[]; mood: string }, andPractice: boolean) => void
  onBack: () => void
}

function LibraryForm({ initialTitle = '', initialText = '', initialTags = [], initialMood = '', isEdit, onSave, onBack }: FormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [mood, setMood] = useState(initialMood)

  const valid = title.trim().length > 0 && text.trim().length > 0
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  function toggleTag(t: string) {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition">← Wróć do biblioteki</button>
      <h2 className="text-xl font-bold">{isEdit ? 'Edytuj tekst' : 'Dodaj nowy tekst'}</h2>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tytuł</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Np. Wspomnienie z Chorwacji, Moja afirmacja poranna..."
          className="w-full bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent-400)] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tekst</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Wklej tekst, który chcesz ćwiczyć... Notatka, wspomnienie, fragment książki, modlitwa, afirmacja."
          rows={8}
          className="w-full bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent-400)] focus:border-transparent transition resize-y leading-relaxed"
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">
          {wordCount} {plural(wordCount, 'słowo', 'słowa', 'słów')} · {text.length} znaków
        </p>
        {text.trim().length > 0 && text.trim().length < 100 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-3 py-2 mt-2">
            Ten tekst jest bardzo krótki — wynik rundy może być niemiarodajny. Zalecane minimum to ok. 100 znaków.
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-2">Klimat</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(prev => prev === m ? '' : m)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                mood === m
                  ? 'bg-[var(--accent-100)] dark:bg-[var(--accent-600)]/20 text-[var(--accent-600)] dark:text-[var(--accent-400)] border-[var(--accent-200)] dark:border-[var(--accent-500)]/40'
                  : 'bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a] hover:border-[var(--accent-400)] dark:hover:border-[var(--accent-500)]/30'
              }`}
            >
              {MOOD_EMOJI[m]} {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-2">Tagi</label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                tags.includes(tag)
                  ? 'bg-[var(--accent-100)] dark:bg-[var(--accent-600)]/20 text-[var(--accent-600)] dark:text-[var(--accent-400)] border-[var(--accent-200)] dark:border-[var(--accent-500)]/40'
                  : 'bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a] hover:border-[var(--accent-400)] dark:hover:border-[var(--accent-500)]/30'
              }`}
            >
              {TAG_EMOJI[tag]} {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave({ title, text, tags, mood }, false)}
          disabled={!valid}
          className="flex-1 py-3 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#282828] border border-gray-200 dark:border-[#2e2e2e] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Zapisz do biblioteki
        </button>
        <button
          onClick={() => onSave({ title, text, tags, mood }, true)}
          disabled={!valid}
          className="flex-1 py-3 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-sm font-bold rounded-xl transition hover:shadow-lg hover:shadow-[var(--accent-500)]/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Zapisz i ćwicz →
        </button>
      </div>
    </div>
  )
}

// ── Text Card (Grid view) ─────────────────────────────────────────────────────

function TextCard({
  text,
  onPractice,
  onEdit,
  onDelete,
}: {
  text: CustomText
  onPractice: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const chunks = text.text.length > CHUNK_THRESHOLD ? splitIntoChunks(text.text) : null
  const nextChunk = chunks ? Math.min((text.lastChunkIndex ?? -1) + 1, chunks.length - 1) : 0
  const allDone = chunks ? (text.lastChunkIndex ?? -1) >= chunks.length - 1 : false
  const practiceLabel = chunks
    ? (allDone ? 'Zacznij od nowa →' : `Fragment ${nextChunk + 1}/${chunks.length} →`)
    : (text.lastPracticedAt ? 'Kontynuuj →' : 'Ćwicz →')

  return (
    <div className="group bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] hover:border-[var(--accent-400)] dark:hover:border-[var(--accent-500)]/30 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-0.5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug flex-1 min-w-0">{text.title}</p>
        <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs"
            title="Edytuj"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition text-gray-400 hover:text-red-500 text-xs"
            title="Usuń"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Tags/mood row */}
      {(text.mood || text.tags.length > 0) && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {text.mood && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--accent-100)] dark:bg-[var(--accent-500)]/15 text-[var(--accent-600)] dark:text-[var(--accent-400)] border border-[var(--accent-200)] dark:border-[var(--accent-500)]/20">
              {MOOD_EMOJI[text.mood]} {text.mood}
            </span>
          )}
          {text.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-500 border border-gray-200 dark:border-[#2a2a2a]">
              {TAG_EMOJI[tag]} {tag}
            </span>
          ))}
        </div>
      )}

      {/* Preview */}
      <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-2">
        {text.text.slice(0, 140)}{text.text.length > 140 ? '…' : ''}
      </p>

      {/* Short text badge */}
      {text.text.trim().length < 100 && (
        <p className="text-[9px] text-amber-600 dark:text-amber-400 mb-2">⚠ Krótki tekst — wynik próbny</p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-600 mb-3">
        <span>{text.practiceCount} {plural(text.practiceCount, 'runda', 'rundy', 'rund')}</span>
        {text.bestWpm != null && (
          <span className="text-[var(--accent-600)] dark:text-[var(--accent-400)] font-semibold">{text.bestWpm} WPM best</span>
        )}
        {chunks && (
          <span className="ml-auto text-[var(--accent-500)] dark:text-[var(--accent-400)] font-medium">
            {allDone ? `✓ ${chunks.length} fragmentów` : `${nextChunk}/${chunks.length} fragmentów`}
          </span>
        )}
        {!chunks && text.lastPracticedAt && (
          <span className="ml-auto">{formatDate(text.lastPracticedAt)}</span>
        )}
      </div>

      {/* Practice button */}
      <button
        onClick={onPractice}
        className="w-full py-2.5 bg-[var(--accent-50)] dark:bg-[var(--accent-500)]/10 hover:bg-[var(--accent-100)] dark:hover:bg-[var(--accent-500)]/20 text-[var(--accent-600)] dark:text-[var(--accent-400)] text-xs font-bold rounded-xl border border-[var(--accent-200)] dark:border-[var(--accent-500)]/20 transition group-hover:border-[var(--accent-400)] dark:group-hover:border-[var(--accent-500)]/40"
      >
        {practiceLabel}
      </button>
    </div>
  )
}

// ── Text Row (List view) ──────────────────────────────────────────────────────

function TextRow({
  text,
  onPractice,
  onEdit,
  onDelete,
}: {
  text: CustomText
  onPractice: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const chunks = text.text.length > CHUNK_THRESHOLD ? splitIntoChunks(text.text) : null
  const nextChunk = chunks ? Math.min((text.lastChunkIndex ?? -1) + 1, chunks.length - 1) : 0
  const allDone = chunks ? (text.lastChunkIndex ?? -1) >= chunks.length - 1 : false

  return (
    <div className="group flex items-center gap-3 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] hover:border-[var(--accent-400)] dark:hover:border-[var(--accent-500)]/30 rounded-xl px-4 py-3 transition-all duration-200">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{text.title}</p>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 dark:text-gray-600">
          <span>{text.practiceCount} {plural(text.practiceCount, 'runda', 'rundy', 'rund')}</span>
          {text.bestWpm != null && (
            <span className="text-[var(--accent-600)] dark:text-[var(--accent-400)] font-medium">{text.bestWpm} WPM</span>
          )}
          {chunks && (
            <span>{allDone ? `✓ ${chunks.length} fr.` : `${nextChunk + 1}/${chunks.length} fr.`}</span>
          )}
          {text.lastPracticedAt && <span className="ml-auto">{formatDate(text.lastPracticedAt)}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs"
            title="Edytuj"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition text-gray-400 hover:text-red-500 text-xs"
            title="Usuń"
          >
            🗑
          </button>
        </div>
        <button
          onClick={onPractice}
          className="text-xs px-3 py-1.5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white rounded-lg transition font-medium ml-1"
        >
          {chunks && !allDone ? `Fr. ${nextChunk + 1}/${chunks.length} →` : 'Ćwicz →'}
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type View = 'list' | 'add' | 'edit'
type DateFilter = 'all' | 'week' | 'month' | 'older'
type SortBy = 'newest' | 'practiced' | 'az' | 'rounds' | 'wpm'

const SORT_LABELS: Record<SortBy, string> = {
  newest:   'Najnowsze',
  practiced:'Ostatnio ćwiczone',
  az:       'A–Z',
  rounds:   'Rundy ↓',
  wpm:      'WPM ↓',
}

function sortTexts(texts: CustomText[], sort: SortBy): CustomText[] {
  return [...texts].sort((a, b) => {
    switch (sort) {
      case 'newest':   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'practiced': {
        const ta = a.lastPracticedAt ? new Date(a.lastPracticedAt).getTime() : 0
        const tb = b.lastPracticedAt ? new Date(b.lastPracticedAt).getTime() : 0
        return tb - ta
      }
      case 'az':      return a.title.localeCompare(b.title, 'pl')
      case 'rounds':  return b.practiceCount - a.practiceCount
      case 'wpm':     return (b.bestWpm ?? 0) - (a.bestWpm ?? 0)
    }
  })
}

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  all: 'Wszystkie',
  week: 'Ten tydzień',
  month: 'Ten miesiąc',
  older: 'Starsze',
}

function applyDateFilter(texts: CustomText[], filter: DateFilter): CustomText[] {
  if (filter === 'all') return texts
  const now = Date.now()
  const WEEK  = 7  * 24 * 60 * 60 * 1000
  const MONTH = 30 * 24 * 60 * 60 * 1000
  return texts.filter(t => {
    const age = now - new Date(t.createdAt).getTime()
    if (filter === 'week')  return age <= WEEK
    if (filter === 'month') return age <= MONTH
    if (filter === 'older') return age > MONTH
    return true
  })
}

export default function LibraryPage() {
  const router = useRouter()
  const [texts, setTexts] = useState<CustomText[]>([])
  const [view, setView] = useState<View>('list')
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [listMode, setListMode] = useState(false)
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('newest')

  useEffect(() => {
    const lib = getLibrary()
    setTexts(lib)
    if (lib.length > 5) setListMode(true)
  }, [])

  function refresh() { setTexts(getLibrary()) }

  function practice(text: CustomText) {
    let chunkIndex = 0
    if (text.text.length > CHUNK_THRESHOLD) {
      const chunks = splitIntoChunks(text.text)
      const last = text.lastChunkIndex ?? -1
      chunkIndex = last + 1 >= chunks.length ? 0 : last + 1
    }
    localStorage.setItem('flowkeys_pending_library_text', JSON.stringify({
      id: text.id,
      text: text.text,
      title: text.title,
      chunkIndex,
    }))
    router.push('/')
  }

  function handleFormSave(
    data: { title: string; text: string; tags: string[]; mood: string },
    andPractice: boolean
  ) {
    let id: string
    if (editId) {
      updateCustomText(editId, data)
      id = editId
    } else {
      const saved = saveCustomText(data)
      id = saved.id
    }
    refresh()
    setView('list')
    setEditId(null)

    if (andPractice) {
      localStorage.setItem('flowkeys_pending_library_text', JSON.stringify({
        id,
        text: data.text,
        title: data.title,
        chunkIndex: 0,
      }))
      router.push('/')
    }
  }

  function openEdit(text: CustomText) {
    setEditId(text.id)
    setView('edit')
  }

  function confirmDelete(id: string) {
    deleteCustomText(id)
    refresh()
    setDeleteId(null)
  }

  const totalSessions = texts.reduce((s, t) => s + t.practiceCount, 0)
  const bestWpm = texts.reduce((b, t) => Math.max(b, t.bestWpm ?? 0), 0)
  const lastPracticed = [...texts]
    .filter(t => t.lastPracticedAt)
    .sort((a, b) => (b.lastPracticedAt! > a.lastPracticedAt! ? 1 : -1))[0]
  const continueText = lastPracticed ?? texts[0] ?? null
  const editingText = editId ? texts.find(t => t.id === editId) : null
  const filteredTexts = sortTexts(applyDateFilter(texts, dateFilter), sortBy)

  // Form view
  if (view === 'add' || view === 'edit') {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <Header />
          <LibraryForm
            key={editId ?? 'add'}
            initialTitle={editingText?.title}
            initialText={editingText?.text}
            initialTags={editingText?.tags}
            initialMood={editingText?.mood}
            isEdit={view === 'edit'}
            onSave={handleFormSave}
            onBack={() => { setView('list'); setEditId(null) }}
          />
        </div>
      </main>
    )
  }

  // List view
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <Header />

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h1 className="text-2xl font-bold">Moja Biblioteka</h1>
              {texts.length > 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {texts.length} {plural(texts.length, 'tekst', 'teksty', 'tekstów')}
                  {totalSessions > 0 ? ` · ${totalSessions} ${plural(totalSessions, 'runda', 'rundy', 'rund')}` : ''}
                  {bestWpm > 0 ? ` · ${bestWpm} WPM best` : ''}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Teksty, do których warto wracać.</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {texts.length > 0 && (
                <button
                  onClick={() => setListMode(v => !v)}
                  title={listMode ? 'Widok kafelków' : 'Widok listy'}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525] transition text-sm"
                >
                  {listMode ? '⊞' : '≡'}
                </button>
              )}
              <button
                onClick={() => setView('add')}
                className="flex items-center gap-1.5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition hover:shadow-lg hover:shadow-[var(--accent-500)]/20 active:scale-[0.98]"
              >
                + Dodaj tekst
              </button>
            </div>
          </div>

          {/* Continue */}
          {continueText && continueText.lastPracticedAt && (
            <button
              onClick={() => practice(continueText)}
              className="w-full flex items-center gap-4 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white rounded-2xl px-6 py-5 text-left transition-all hover:shadow-xl hover:shadow-[var(--accent-500)]/25 hover:-translate-y-0.5 active:translate-y-0 group mt-5"
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-xl group-hover:scale-110 transition-transform">▶</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-65 mb-0.5">Kontynuuj</p>
                <p className="text-base font-bold leading-tight truncate">{continueText.title}</p>
                <p className="text-xs opacity-60 mt-0.5">
                  {continueText.lastWpm != null ? `${continueText.lastWpm} WPM · ` : ''}
                  {continueText.practiceCount} {plural(continueText.practiceCount, 'runda', 'rundy', 'rund')}
                  {(() => {
                    if (continueText.text.length > CHUNK_THRESHOLD) {
                      const ch = splitIntoChunks(continueText.text)
                      const next = Math.min((continueText.lastChunkIndex ?? -1) + 1, ch.length - 1)
                      return ` · Fragment ${next + 1}/${ch.length}`
                    }
                    return ` · ${formatDate(continueText.lastPracticedAt!)}`
                  })()}
                </p>
              </div>
              <span className="shrink-0 text-2xl opacity-70 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          )}
        </div>

        {/* Empty state */}
        {texts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-fade-up">📚</div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 animate-fade-up" style={{ animationDelay: '60ms' }}>
              Twoja biblioteka jest jeszcze pusta
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed animate-fade-up" style={{ animationDelay: '120ms' }}>
              Dodaj notatkę, wspomnienie albo fragment, do którego chcesz wracać. Każdy tekst buduje własny rytm.
            </p>
            <button
              onClick={() => setView('add')}
              className="animate-fade-up bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-sm font-bold px-6 py-3 rounded-xl transition hover:shadow-lg hover:shadow-[var(--accent-500)]/20 active:scale-[0.98]"
              style={{ animationDelay: '180ms' }}
            >
              Dodaj pierwszy tekst
            </button>
          </div>
        )}

        {/* Text grid / list */}
        {texts.length > 0 && (
          <div className="space-y-3">
            {/* Header row: label + filters + sort */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest shrink-0">Moje teksty</p>
              <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
                {(Object.keys(DATE_FILTER_LABELS) as DateFilter[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setDateFilter(f)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border whitespace-nowrap transition ${
                      dateFilter === f
                        ? 'bg-[var(--accent-500)] text-white border-[var(--accent-600)]'
                        : 'bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a] hover:border-[var(--accent-400)]'
                    }`}
                  >
                    {DATE_FILTER_LABELS[f]}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortBy)}
                className="text-[10px] px-2.5 py-1 rounded-full border bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a] hover:border-[var(--accent-400)] transition shrink-0 cursor-pointer"
              >
                {(Object.keys(SORT_LABELS) as SortBy[]).map(s => (
                  <option key={s} value={s}>{SORT_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {filteredTexts.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-600 py-8 text-center">
                Brak tekstów z wybranego okresu.
              </p>
            )}

            {listMode ? (
              <div className="space-y-1.5">
                {filteredTexts.map(text => (
                  <TextRow
                    key={text.id}
                    text={text}
                    onPractice={() => practice(text)}
                    onEdit={() => openEdit(text)}
                    onDelete={() => setDeleteId(text.id)}
                  />
                ))}
                {dateFilter === 'all' && (
                  <button
                    onClick={() => setView('add')}
                    className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-gray-200 dark:border-[#2a2a2a] hover:border-[var(--accent-400)] dark:hover:border-[var(--accent-500)]/40 text-xs text-gray-400 dark:text-gray-600 hover:text-[var(--accent-500)] dark:hover:text-[var(--accent-400)] transition-all"
                  >
                    + Dodaj nowy tekst
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredTexts.map(text => (
                  <TextCard
                    key={text.id}
                    text={text}
                    onPractice={() => practice(text)}
                    onEdit={() => openEdit(text)}
                    onDelete={() => setDeleteId(text.id)}
                  />
                ))}
                {dateFilter === 'all' && (
                  <button
                    onClick={() => setView('add')}
                    className="border-2 border-dashed border-gray-200 dark:border-[#2a2a2a] hover:border-[var(--accent-400)] dark:hover:border-[var(--accent-500)]/40 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-600 hover:text-[var(--accent-500)] dark:hover:text-[var(--accent-400)] transition-all duration-200 min-h-[180px] group"
                  >
                    <span className="text-4xl leading-none group-hover:scale-110 transition-transform duration-200">+</span>
                    <span className="text-xs font-medium">Dodaj nowy tekst</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Delete modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl p-6 w-full max-w-sm space-y-4 animate-fade-up">
              <div>
                <h3 className="text-base font-bold mb-1">Usunąć ten tekst?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">Tekst i cała historia wyników zostaną trwale usunięte. Nie da się cofnąć.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
                >
                  Anuluj
                </button>
                <button
                  onClick={() => confirmDelete(deleteId)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition"
                >
                  Usuń
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

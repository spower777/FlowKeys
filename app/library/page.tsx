'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import {
  getLibrary, saveCustomText, updateCustomText, deleteCustomText,
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
          placeholder="Np. Wspomnienie z Chorwacji, Moja afirmacja poranná..."
          className="w-full bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tekst</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Wklej tekst, który chcesz ćwiczyć... Notatka, wspomnienie, fragment książki, modlitwa, afirmacja."
          rows={8}
          className="w-full bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-y leading-relaxed"
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
                  ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/40'
                  : 'bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a] hover:border-violet-300 dark:hover:border-violet-500/30'
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
                  ? 'bg-[var(--accent-100)] dark:bg-[var(--accent-600)]/20 text-[var(--accent-600)] dark:text-[var(--accent-300)] border-[var(--accent-300)] dark:border-[var(--accent-500)]/40'
                  : 'bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a] hover:border-[var(--accent-300)] dark:hover:border-[var(--accent-500)]/30'
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
          className="flex-1 py-3 bg-violet-500 hover:bg-violet-600 text-white text-sm font-bold rounded-xl transition hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Zapisz i ćwicz →
        </button>
      </div>
    </div>
  )
}

// ── Text Card ─────────────────────────────────────────────────────────────────

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
  return (
    <div className="group bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] hover:border-violet-300 dark:hover:border-violet-500/30 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-0.5 flex flex-col">
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
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20">
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
          <span className="text-blue-500 dark:text-blue-400 font-semibold">{text.bestWpm} WPM best</span>
        )}
        {text.lastPracticedAt && (
          <span className="ml-auto">{formatDate(text.lastPracticedAt)}</span>
        )}
      </div>

      {/* Practice button */}
      <button
        onClick={onPractice}
        className="w-full py-2.5 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-bold rounded-xl border border-violet-200 dark:border-violet-500/20 transition group-hover:border-violet-300 dark:group-hover:border-violet-500/40"
      >
        Ćwicz →
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type View = 'list' | 'add' | 'edit'

export default function LibraryPage() {
  const router = useRouter()
  const [texts, setTexts] = useState<CustomText[]>([])
  const [view, setView] = useState<View>('list')
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { setTexts(getLibrary()) }, [])

  function refresh() { setTexts(getLibrary()) }

  function practice(text: CustomText) {
    localStorage.setItem('flowkeys_pending_library_text', JSON.stringify({
      id: text.id,
      text: text.text,
      title: text.title,
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
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">Moja Biblioteka</h1>
            <button
              onClick={() => setView('add')}
              className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
            >
              + Dodaj tekst
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Teksty, do których warto wracać.</p>

          {texts.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-4 py-4 text-center">
                <p className="text-3xl font-black text-violet-500 dark:text-violet-400">{texts.length}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                  {plural(texts.length, 'tekst', 'teksty', 'tekstów')}
                </p>
              </div>
              <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-4 py-4 text-center">
                <p className="text-3xl font-black text-[var(--accent-600)] dark:text-[var(--accent-400)]">{totalSessions}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                  {plural(totalSessions, 'runda', 'rundy', 'rund')}
                </p>
              </div>
              <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-4 py-4 text-center">
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{bestWpm || '—'}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">WPM best</p>
              </div>
            </div>
          )}

          {/* Continue */}
          {continueText && continueText.lastPracticedAt && (
            <button
              onClick={() => practice(continueText)}
              className="w-full flex items-center gap-4 bg-violet-500 hover:bg-violet-600 text-white rounded-2xl px-6 py-5 text-left transition-all hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-xl group-hover:scale-110 transition-transform">▶</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-65 mb-0.5">Kontynuuj</p>
                <p className="text-base font-bold leading-tight truncate">{continueText.title}</p>
                <p className="text-xs opacity-60 mt-0.5">
                  {continueText.lastWpm != null ? `${continueText.lastWpm} WPM · ` : ''}{continueText.practiceCount} {plural(continueText.practiceCount, 'runda', 'rundy', 'rund')} · {formatDate(continueText.lastPracticedAt)}
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
              className="animate-fade-up bg-violet-500 hover:bg-violet-600 text-white text-sm font-bold px-6 py-3 rounded-xl transition hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
              style={{ animationDelay: '180ms' }}
            >
              Dodaj pierwszy tekst
            </button>
          </div>
        )}

        {/* Grid */}
        {texts.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Moje teksty</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {texts.map(text => (
                <TextCard
                  key={text.id}
                  text={text}
                  onPractice={() => practice(text)}
                  onEdit={() => openEdit(text)}
                  onDelete={() => setDeleteId(text.id)}
                />
              ))}

              {/* Add card */}
              <button
                onClick={() => setView('add')}
                className="border-2 border-dashed border-gray-200 dark:border-[#2a2a2a] hover:border-violet-300 dark:hover:border-violet-500/40 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-600 hover:text-violet-500 dark:hover:text-violet-400 transition-all duration-200 min-h-[180px] group"
              >
                <span className="text-4xl leading-none group-hover:scale-110 transition-transform duration-200">+</span>
                <span className="text-xs font-medium">Dodaj nowy tekst</span>
              </button>
            </div>
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

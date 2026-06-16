'use client'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
}

export default function TextInput({ value, onChange, onSubmit }: Props) {
  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Wklej tutaj swój tekst — notatkę, wspomnienie, fragment rozmowy..."
        className="w-full h-52 bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl px-5 py-4 text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50 text-sm leading-relaxed"
        autoFocus
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">{value.trim().split(/\s+/).filter(Boolean).length} słów</p>
        <button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-[#2a2a2a] disabled:text-gray-600 text-white text-sm font-medium rounded-xl transition"
        >
          Dalej →
        </button>
      </div>
    </div>
  )
}

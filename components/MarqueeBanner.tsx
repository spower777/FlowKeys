'use client'

const ITEMS = [
  '✦ Pisz własnym głosem',
  '✦ 272 lekcje · od podstaw do mistrzostwa',
  '✦ Blind Flow — pisz z pamięci',
  '✦ No Backspace · zero poprawek',
  '✦ WPM · Dokładność · Indeks spokoju',
  '✦ Twoje teksty jako trening',
  '✦ Klawiatura ma swój rytm',
  '✦ Biblioteka Twoich historii',
  '✦ Polskie znaki · ą ę ć ł ń ó ś ź ż',
  '✦ Każda runda zostawia ślad',
]

export default function MarqueeBanner() {
  const text = ITEMS.join('   ')
  const doubled = `${text}   ${text}   `

  return (
    <div className="overflow-hidden rounded-xl bg-gray-950 dark:bg-black border border-gray-800 dark:border-gray-900 h-9 flex items-center select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span className="font-mono text-[11px] font-semibold tracking-widest text-[var(--accent-400)] opacity-90">
          {doubled}
        </span>
      </div>
    </div>
  )
}

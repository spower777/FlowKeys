export type BadgeCategory =
  | 'streak' | 'accuracy' | 'speed' | 'calm'
  | 'blindFlow' | 'noBackspace' | 'polishSigns' | 'lessons' | 'mastery' | 'quality'

export interface FlowBadge {
  id: string
  title: string
  description: string
  category: BadgeCategory
  icon: string
  requirement: {
    type:
      | 'daysStreak' | 'accuracy' | 'wpm' | 'calmIndex'
      | 'blindFlowCount' | 'noBackspaceCount' | 'polishSignsPerfect'
      | 'lessonsCompleted' | 'lessonsMastered'
      | 'quietRound' | 'cleanRound' | 'customTextSession'
    value: number
  }
}

// Qualitative badge requirement types (used in checkAndUnlockBadges)
// quietRound: sessions with calmScore>=90 AND backspace<=10 AND completion>=90
// cleanRound: sessions with backspace<=5 AND completion>=90
// customTextSession: sessions with own text (no lessonId) AND completion>=90

export const badges: FlowBadge[] = [
  // Lessons
  { id: 'first_round',    title: 'Pierwszy Rytm',        description: 'Ukończ pierwszą lekcję.',                   category: 'lessons',     icon: '🟢', requirement: { type: 'lessonsCompleted', value: 1 } },
  { id: 'ten_lessons',    title: 'Rozgrzane Palce',       description: 'Ukończ 10 lekcji.',                         category: 'lessons',     icon: '🔟', requirement: { type: 'lessonsCompleted', value: 10 } },
  { id: 'fifty_lessons',  title: 'Stały Kurs',            description: 'Ukończ 50 lekcji.',                         category: 'lessons',     icon: '📚', requirement: { type: 'lessonsCompleted', value: 50 } },
  { id: 'hundred_lessons',title: 'Mistrz Klawiatury',     description: 'Ukończ 100 lekcji.',                        category: 'lessons',     icon: '🏆', requirement: { type: 'lessonsCompleted', value: 100 } },

  // Streak
  { id: 'three_days',   title: 'Trzy Dni Rytmu',       description: 'Ćwicz przez 3 dni z rzędu.',   category: 'streak', icon: '🔥', requirement: { type: 'daysStreak', value: 3 } },
  { id: 'seven_days',   title: 'Tydzień Bez Ucieczki', description: 'Ćwicz przez 7 dni z rzędu.',   category: 'streak', icon: '🔥', requirement: { type: 'daysStreak', value: 7 } },
  { id: 'thirty_days',  title: 'Miesiąc Cierpliwości', description: 'Ćwicz przez 30 dni z rzędu.',  category: 'streak', icon: '🔥', requirement: { type: 'daysStreak', value: 30 } },

  // Accuracy
  { id: 'accuracy_90',  title: 'Czysty Start',        description: 'Osiągnij 90% dokładności.',               category: 'accuracy', icon: '🎯', requirement: { type: 'accuracy', value: 90 } },
  { id: 'accuracy_95',  title: 'Pewna Ręka',          description: 'Osiągnij 95% dokładności.',               category: 'accuracy', icon: '🎯', requirement: { type: 'accuracy', value: 95 } },
  { id: 'accuracy_98',  title: 'Żelazna Dokładność',  description: 'Osiągnij 98% dokładności.',               category: 'accuracy', icon: '🎯', requirement: { type: 'accuracy', value: 98 } },
  { id: 'accuracy_100', title: 'Bez Skazy',           description: 'Ukończ rundę ze 100% dokładności.',       category: 'accuracy', icon: '✨', requirement: { type: 'accuracy', value: 100 } },

  // Speed
  { id: 'wpm_30', title: 'Pierwszy Bieg',    description: 'Osiągnij 30 WPM.',  category: 'speed', icon: '⚡', requirement: { type: 'wpm', value: 30 } },
  { id: 'wpm_40', title: 'Płynny Krok',      description: 'Osiągnij 40 WPM.',  category: 'speed', icon: '⚡', requirement: { type: 'wpm', value: 40 } },
  { id: 'wpm_50', title: 'Szybki Strumień',  description: 'Osiągnij 50 WPM.',  category: 'speed', icon: '⚡', requirement: { type: 'wpm', value: 50 } },
  { id: 'wpm_60', title: 'Ekspres',          description: 'Osiągnij 60 WPM.',  category: 'speed', icon: '⚡', requirement: { type: 'wpm', value: 60 } },
  { id: 'wpm_80', title: 'Błyskawica',       description: 'Osiągnij 80 WPM.',  category: 'speed', icon: '⚡', requirement: { type: 'wpm', value: 80 } },

  // Calm
  { id: 'calm_80', title: 'Spokojna Dłoń',      description: 'Osiągnij indeks spokoju 80.',  category: 'calm', icon: '✋', requirement: { type: 'calmIndex', value: 80 } },
  { id: 'calm_90', title: 'Cichy Mechanizm',     description: 'Osiągnij indeks spokoju 90.',  category: 'calm', icon: '✋', requirement: { type: 'calmIndex', value: 90 } },
  { id: 'calm_95', title: 'Nerwy ze Stali',      description: 'Osiągnij indeks spokoju 95.',  category: 'calm', icon: '🧘', requirement: { type: 'calmIndex', value: 95 } },
  { id: 'calm_99', title: 'Mnich Klawiatury',    description: 'Osiągnij indeks spokoju 99.',  category: 'calm', icon: '🧘', requirement: { type: 'calmIndex', value: 99 } },

  // No Backspace
  { id: 'no_backspace_1',  title: 'Bez Cofania',       description: 'Ukończ jedną rundę bez Backspace.',   category: 'noBackspace', icon: '→', requirement: { type: 'noBackspaceCount', value: 1 } },
  { id: 'no_backspace_5',  title: 'Prosto Przed Siebie', description: 'Ukończ 5 rund bez Backspace.',      category: 'noBackspace', icon: '→', requirement: { type: 'noBackspaceCount', value: 5 } },
  { id: 'no_backspace_20', title: 'Nie Oglądam Się',   description: 'Ukończ 20 rund bez Backspace.',       category: 'noBackspace', icon: '→', requirement: { type: 'noBackspaceCount', value: 20 } },

  // Blind Flow
  { id: 'blind_1',  title: 'Ślepy Strumień',        description: 'Ukończ pierwszą rundę Blind Flow.',   category: 'blindFlow', icon: '🌙', requirement: { type: 'blindFlowCount', value: 1 } },
  { id: 'blind_10', title: 'Piszę z Pamięci',        description: 'Ukończ 10 rund Blind Flow.',          category: 'blindFlow', icon: '🌙', requirement: { type: 'blindFlowCount', value: 10 } },
  { id: 'blind_50', title: 'Wewnętrzna Klawiatura',  description: 'Ukończ 50 rund Blind Flow.',          category: 'blindFlow', icon: '🌙', requirement: { type: 'blindFlowCount', value: 50 } },

  // Polish Signs
  { id: 'polish_1',  title: 'Pierwszy Ogonek',   description: 'Ukończ lekcję z polskimi znakami.',                   category: 'polishSigns', icon: 'ą', requirement: { type: 'polishSignsPerfect', value: 1 } },
  { id: 'polish_10', title: 'Mistrz Ogonków',    description: 'Ukończ 10 lekcji z polskimi znakami bez błędu.',      category: 'polishSigns', icon: 'ą', requirement: { type: 'polishSignsPerfect', value: 10 } },
  { id: 'polish_50', title: 'Zażółć Champion',   description: 'Ukończ 50 lekcji z polskimi znakami bez błędu.',      category: 'polishSigns', icon: 'ą', requirement: { type: 'polishSignsPerfect', value: 50 } },

  // Quality badges
  { id: 'cicha_runda',    title: 'Cicha Runda',      description: 'Ukończ rundę ze spokojem ≥90 i maks. 10 cofnięciami.',  category: 'quality', icon: '🤫', requirement: { type: 'quietRound',        value: 1 } },
  { id: 'bez_szarpania',  title: 'Bez Szarpania',    description: 'Ukończ rundę z maksymalnie 5 cofnięciami.',             category: 'quality', icon: '🧊', requirement: { type: 'cleanRound',        value: 1 } },
  { id: 'wlasny_glos',    title: 'Własny Głos',      description: 'Ukończ trening na własnym tekście (nie lekcji).',       category: 'quality', icon: '✍️', requirement: { type: 'customTextSession', value: 1 } },

  // Mastery
  { id: 'mastered_10',  title: 'Dziesięć Czystych', description: 'Opanuj 10 lekcji na 3 gwiazdki.',    category: 'mastery', icon: '◇', requirement: { type: 'lessonsMastered', value: 10 } },
  { id: 'mastered_50',  title: 'Mapa Postępu',      description: 'Opanuj 50 lekcji na 3 gwiazdki.',    category: 'mastery', icon: '◇', requirement: { type: 'lessonsMastered', value: 50 } },
  { id: 'mastered_100', title: 'Sto Czystych Rund', description: 'Opanuj 100 lekcji na 3 gwiazdki.',   category: 'mastery', icon: '◇', requirement: { type: 'lessonsMastered', value: 100 } },
  { id: 'flow_777',     title: '777 Flow',           description: 'Dotrzyj do ostatniej lekcji.',       category: 'mastery', icon: '◇', requirement: { type: 'lessonsCompleted', value: 777 } },
]

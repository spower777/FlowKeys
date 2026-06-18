export interface Chapter {
  id: number
  title: string
  range: string
  description: string
}

export const chapters: Chapter[] = [
  { id: 1, title: 'Pierwszy Rytm',   range: '1–20',    description: 'Proste zdania, spokojny start, rytm bez presji.' },
  { id: 2, title: 'Płynność',        range: '21–40',   description: 'Krótkie teksty, więcej tempa, mniej napięcia.' },
  { id: 3, title: 'Polskie Znaki',   range: '41–50',   description: 'Ćwiczenie ogonków, końcówek i trudnych liter.' },
  { id: 4, title: 'Uważność',        range: '51–110',  description: 'Pisanie jako koncentracja. Mniej chaosu, więcej obecności.' },
  { id: 5, title: 'Afirmacje',       range: '111–210', description: 'Budowanie spokojnego, wspierającego dialogu ze sobą.' },
  { id: 6, title: 'Relacje',         range: '211–270', description: 'Ciepłe zdania, obecność, wdzięczność i dobra komunikacja.' },
  { id: 7, title: 'Blind Flow',      range: '271–350', description: 'Pisanie z pamięci i słuchu. Mniej kontroli wzrokowej.' },
  { id: 8, title: 'Wizualizacja',    range: '351–450', description: 'Wyobraźnia, emocja spełnienia i mentalny obraz celu.' },
  { id: 9, title: 'Opowieści',       range: '451–570', description: 'Dłuższe teksty, narracja, rytm i interpunkcja.' },
  { id: 10, title: 'Mistrzostwo',    range: '571–777', description: 'Miks trybów, dłuższe teksty i zaawansowana precyzja.' },
]

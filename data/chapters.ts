export interface Chapter {
  id: number
  title: string
  range: string
  description: string
}

export const chapters: Chapter[] = [
  { id: 1,  title: 'Pierwszy Rytm',       range: '1–20',    description: 'Proste zdania, spokojny start, rytm bez presji.' },
  { id: 2,  title: 'Płynność',            range: '21–40',   description: 'Krótkie teksty, więcej tempa, mniej napięcia.' },
  { id: 3,  title: 'Polskie Znaki',       range: '41–50',   description: 'Ćwiczenie ogonków, końcówek i trudnych liter.' },
  { id: 4,  title: 'Nowy Rytm',           range: '51–65',   description: 'Kompaktowe teksty, spokojny powrót do klawiszy.' },
  { id: 5,  title: 'Głębszy Rytm',        range: '66–80',   description: 'Dłuższe zdania, więcej własnego głosu.' },
  { id: 6,  title: 'Polskie Ogonki',      range: '81–90',   description: 'Ogonki w akcji: ą ę ć ł ń ó ś ź ż.' },
  { id: 7,  title: 'Blind Flow',          range: '91–100',  description: 'Pisanie z pamięci. Ekran milczy, palce pamiętają.' },
  { id: 8,  title: 'Wizualizacja',        range: '101–110', description: 'Wyobraźnia i stan spełnienia jako praktyka.' },
  { id: 9,  title: 'Duchowość',           range: '111–120', description: 'Cisza, prowadzenie, modlitwa i spokój.' },
  { id: 10, title: 'Relacje',             range: '121–130', description: 'Obecność, miłość i komunikacja w codzienności.' },
  { id: 11, title: 'Opowieści',           range: '131–140', description: 'Krótkie życiowe historyjki z rytmem.' },
  { id: 12, title: 'Mistrzostwo',         range: '141–150', description: 'Dyscyplina, precyzja i stabilny progres.' },
  { id: 13, title: 'Jadeitowa Droga I',   range: '151–156', description: 'Spokój i oddech w duchu filmowego wuxia.' },
  { id: 14, title: 'Jadeitowa Droga II',  range: '157–170', description: 'Coraz głębiej — cień, ostrze i rytm.' },
  { id: 15, title: 'Jadeitowa Droga III', range: '171–190', description: 'Trudniejsze zdania, mistrzowski poziom.' },
  { id: 16, title: 'Gaming Flow',         range: '191–210', description: 'Respawn, loot, baza. Trening w języku gracza.' },
  { id: 17, title: 'Rząd Domowy',         range: '211–222', description: 'a s d f g h j k l — palce uczą się swojego miejsca.' },
  { id: 18, title: 'Nowe Klawisze',       range: '223–232', description: 'e i r n o t w z c — krok po kroku poza rząd domowy.' },
  { id: 19, title: 'Cyfry',              range: '233–242', description: '1 2 3 4 5 6 7 8 9 0 — rząd numeryczny od podstaw.' },
  { id: 20, title: 'Symbole',            range: '243–252', description: '. , ! ? : ; - ( ) " % @ / — interpunkcja i znaki specjalne.' },
  { id: 21, title: 'Górny Rząd',         range: '253–262', description: 'q w e r t y u i o p — kompletny górny rząd krok po kroku.' },
  { id: 22, title: 'Dolny Rząd',         range: '263–272', description: 'z x c v b n m — dolny rząd i łączenie wszystkich trzech.' },
]

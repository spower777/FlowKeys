export type LessonPack =
  | 'start' | 'motivation' | 'affirmations' | 'polishSigns' | 'mindfulness'
  | 'relationships' | 'spirituality' | 'visualization' | 'stories' | 'mastery'
  | 'blindFlow' | 'noBackspace'

export type LessonMode = 'normal' | 'blindFlow' | 'noBackspace' | 'hardSigns'

export interface FlowLesson {
  id: number
  chapterId: number
  pack: LessonPack
  title: string
  subtitle?: string
  difficulty: 1 | 2 | 3 | 4 | 5
  mode: LessonMode
  text: string
  minAccuracy?: number
  minCalmIndex?: number
  tags?: string[]
}

export const PACK_LABEL: Record<LessonPack, string> = {
  start: 'Start', motivation: 'Motywacja', affirmations: 'Afirmacje',
  polishSigns: 'Polskie znaki', mindfulness: 'Uważność', relationships: 'Relacje',
  spirituality: 'Duchowość', visualization: 'Wizualizacja', stories: 'Opowieści',
  mastery: 'Mistrzostwo', blindFlow: 'Blind Flow', noBackspace: 'No Backspace',
}

export const MODE_LABEL: Record<LessonMode, string> = {
  normal: 'Normal', blindFlow: 'Blind', noBackspace: 'No BS', hardSigns: 'PL znaki',
}

export const lessons: FlowLesson[] = [
  // ── Rozdział 1 · Pierwszy Rytm ────────────────────────────────────────────────
  {
    id: 1, chapterId: 1, pack: 'start', title: 'Pierwszy Rytm',
    subtitle: 'Zaczynam spokojnie.', difficulty: 1, mode: 'normal',
    text: 'Piszę spokojnie. Nie muszę się spieszyć. Każdy znak jest małym krokiem naprzód. Palce układają się naturalnie na rządzie domowym. Rytm zaczyna się tu, przy tej jednej chwili, nie gdzieś dalej.',
    tags: ['start', 'spokój'],
  },
  {
    id: 2, chapterId: 1, pack: 'start', title: 'Bez Pośpiechu',
    difficulty: 1, mode: 'normal',
    text: 'Najpierw rytm, potem szybkość. Klawiatura nie ucieka. Palce wracają na swoje miejsce po każdym znaku. Nie walczę z tekstem — po prostu pozwalam mu płynąć spokojnie przez dłonie, zdanie po zdaniu.',
  },
  {
    id: 3, chapterId: 1, pack: 'affirmations', title: 'Kocham Siebie',
    difficulty: 1, mode: 'normal',
    text: 'Kocham siebie. Szanuję siebie. Uczę się cierpliwie i każdego dnia robię kolejny krok. Nie muszę być gotowy na wszystko. Wystarczy, że zaczynam od jednego spokojnego zdania i wracam, gdy odejdę.',
  },
  {
    id: 4, chapterId: 1, pack: 'affirmations', title: 'Szanuję Siebie',
    difficulty: 1, mode: 'normal',
    text: 'Szanuję siebie. Mój wysiłek ma znaczenie, nawet jeśli dziś idę wolniej niż wczoraj. Nie muszę być idealny, żeby robić postęp. Wystarczy, że wracam do ćwiczenia i nie uciekam od własnego rytmu.',
  },
  {
    id: 5, chapterId: 1, pack: 'motivation', title: 'Dajesz Radę',
    difficulty: 1, mode: 'normal',
    text: 'Dajesz radę. Nawet mały postęp jest postępem. Dziś robisz coś dobrego dla siebie i dla swojego rytmu. Jedna runda spokojnie to więcej niż zero rund idealnie — zapamiętaj to i wróć jutro.',
  },
  {
    id: 6, chapterId: 1, pack: 'motivation', title: 'Nigdy Nie Było Lepiej',
    difficulty: 1, mode: 'normal',
    text: 'Nigdy nie było lepiej. Teraz widzę postęp, którego wcześniej nie potrafiłem zauważyć. Uczę się spokojnie i to naprawdę wystarczy. Wracam do klawiatury z lekką głową i otwartą, rozluźnioną dłonią.',
  },
  {
    id: 7, chapterId: 1, pack: 'start', title: 'Powrót Palców',
    difficulty: 1, mode: 'normal',
    text: 'Palce wracają na rząd domowy. To jest mój punkt spokoju. Stąd zaczynam i tu wracam po każdym błędzie. Rząd domowy zawsze czeka. Nie ma powodu, żeby się spieszyć do kolejnego zdania.',
  },
  {
    id: 8, chapterId: 1, pack: 'mindfulness', title: 'Spokojny Oddech',
    difficulty: 1, mode: 'normal',
    text: 'Oddycham spokojnie. Piszę wolniej. Gdy zwalniam, widzę więcej i popełniam mniej błędów. Piszę jedno zdanie naraz. Nie patrzę na wynik — patrzę tylko na teraźniejszy znak tuż przede mną.',
  },
  {
    id: 9, chapterId: 1, pack: 'motivation', title: 'Małe Kroki',
    difficulty: 1, mode: 'normal',
    text: 'Małe kroki budują dużą zmianę. Jedna runda dzisiaj może być początkiem nowego nawyku. Nie muszę pisać szybko, żeby pisać dobrze. Rytm buduje się powoli i pewnie, jak fundament pod stopami.',
  },
  {
    id: 10, chapterId: 1, pack: 'start', title: 'Czysty Przebieg',
    difficulty: 1, mode: 'noBackspace',
    text: 'Nie poprawiam. Jadę dalej. Błąd jest śladem nauki, a nie wyrokiem. Każde zdanie do końca, bez cofania, bez paniki. Spokojnie prowadzę dłoń przez tekst i nie oglądam się za siebie.',
    minAccuracy: 80,
  },
  {
    id: 11, chapterId: 1, pack: 'polishSigns', title: 'Pierwsze Ogonki',
    difficulty: 2, mode: 'hardSigns',
    text: 'Polskie znaki wymagają spokojnej ręki i skupionej uwagi. ą ę ć ł ń ó ś ź ż — każdy z nich ma swoje miejsce na klawiaturze. Nie walczę z nimi siłą, tylko uczę się, gdzie leżą. Powoli, znak po znaku, aż palec trafia bez wahania. Cierpliwość jest tu ważniejsza niż szybkość.',
  },
  {
    id: 12, chapterId: 1, pack: 'polishSigns', title: 'Łagodne Znaki',
    difficulty: 2, mode: 'hardSigns',
    text: 'Zażółć gęślą jaźń. To zdanie zawiera wszystkie najtrudniejsze polskie znaki. Piszę je powoli, dbając o każdy ogonek: ź, ó, ę, ś, ą, ż. Gdy nabiorę rytmu, znaki wracają na swoje miejsce same, jakby palec je pamiętał od zawsze.',
  },
  {
    id: 13, chapterId: 1, pack: 'relationships', title: 'Dobrze, Że Jesteś',
    difficulty: 1, mode: 'normal',
    text: 'Dobrze, że jesteś. Twoja obecność ma znaczenie, nawet wtedy, gdy dzień jest cichy i nic szczególnego się nie dzieje. Nie musisz robić czegoś wielkiego, żeby być ważnym. Czasem wystarczy, że siedzisz obok i słuchasz. Takie chwile zostają najdłużej.',
  },
  {
    id: 14, chapterId: 1, pack: 'relationships', title: 'Jesteś Ważny',
    difficulty: 1, mode: 'normal',
    text: 'Jesteś ważny. Nie dlatego, że wszystko robisz idealnie, ale dlatego, że jesteś sobą. Twój rytm, twoje tempo, twoje błędy — to wszystko należy do ciebie. Nie musisz ścigać się z nikim. Masz prawo iść swoją drogą i robić postęp po swojemu.',
  },
  {
    id: 15, chapterId: 1, pack: 'spirituality', title: 'Jezus Cię Kocha',
    difficulty: 1, mode: 'normal',
    text: 'Jezus Cię kocha. Nie jesteś sam, nawet w chwilach, które wydają się puste i bez znaczenia. W tej ciszy też może być obecność i pokój głębszy niż słowa. Nie musisz mieć wszystkiego poukładanego, żeby czuć tę bliskość i spokój.',
  },
  {
    id: 16, chapterId: 1, pack: 'visualization', title: 'Widzę Siebie',
    difficulty: 2, mode: 'normal',
    text: 'Widzę siebie spokojnego, silnego i skupionego. Zachowuję się tak, jakby to już było prawdą — bo właśnie to buduję. Moje dłonie poruszają się pewnie. Mój oddech jest równy. Mój umysł jest tu, przy klawiaturze, przy tym zdaniu, przy tej jednej chwili.',
  },
  {
    id: 17, chapterId: 1, pack: 'visualization', title: 'To Już Dojrzewa',
    difficulty: 2, mode: 'normal',
    text: 'Mój cel już dojrzewa pod powierzchnią. Każde działanie jest znakiem, że jestem bliżej życia, którego pragnę. Nie muszę tego widzieć od razu. Nasiona rosną pod ziemią zanim pojawi się kiełek. Wystarczy, że pracuję spokojnie i ufam procesowi.',
  },
  {
    id: 18, chapterId: 1, pack: 'mindfulness', title: 'Mniej Kontroli',
    difficulty: 2, mode: 'normal',
    text: 'Nie muszę kontrolować każdego znaku z osobna. Uczę się ufać dłoniom, rytmowi i spokojnej uwadze. Gdy luzuję chwyt, tekst płynie łatwiej niż wtedy, gdy się napinam. Kontrola i zaufanie mogą iść razem — najpierw uwaga, potem swoboda.',
  },
  {
    id: 19, chapterId: 1, pack: 'motivation', title: 'Najlepszy Moment',
    difficulty: 2, mode: 'normal',
    text: 'Najlepszy moment na start nie zawsze wygląda wielko i wyjątkowo. Czasem zaczyna się od jednej spokojnej rundy bez presji i oczekiwań. Nie czekam na idealne warunki — siadam, piszę i pozwalam, żeby było jak jest. To jest właśnie ten moment.',
  },
  {
    id: 20, chapterId: 1, pack: 'start', title: 'Bez Paniki',
    difficulty: 2, mode: 'noBackspace',
    text: 'Gdy pojawia się błąd, nie panikuję. Piszę dalej, zdanie za zdaniem, do samego końca. Spokój jest ważniejszy niż szybka poprawka. Uczę się prowadzić dłoń przez tekst nawet wtedy, gdy nie wszystko wychodzi tak, jak planowałem.',
  },

  // ── Rozdział 2 · Płynność ────────────────────────────────────────────────────
  {
    id: 21, chapterId: 2, pack: 'motivation', title: 'Stabilny Progres',
    difficulty: 2, mode: 'normal',
    text: 'Progres nie musi krzyczeć o sobie. Czasem jest cichy, powtarzalny i właśnie dlatego prawdziwy. Nie szukam wielkich skoków naprzód — wolę stabilny rytm, który prowadzi mnie dalej każdego dnia. Drobne wyniki sumują się w coś realnego, jeśli nie przestanę wracać.',
  },
  {
    id: 22, chapterId: 2, pack: 'affirmations', title: 'Ufam Sobie',
    difficulty: 2, mode: 'normal',
    text: 'Ufam sobie. Moje tempo jest wystarczające. Nie muszę nikomu udowadniać własnej wartości, bo ona nie zależy od wyników ani od szybkości. Uczę się pisać spokojnie, myśleć spokojnie, żyć spokojnie. Zaufanie do siebie to cicha pewność, że dam radę.',
  },
  {
    id: 23, chapterId: 2, pack: 'affirmations', title: 'Wybieram Spokój',
    difficulty: 2, mode: 'normal',
    text: 'Wybieram spokój. Wybieram uwagę i cierpliwość wobec siebie i własnego procesu uczenia się. Nie zawsze wszystko wychodzi za pierwszym razem — i to jest w pełnym porządku. Spokój nie jest nagrodą za sukces. Spokój jest postawą, którą wybieram niezależnie od wyniku.',
  },
  {
    id: 24, chapterId: 2, pack: 'mindfulness', title: 'Rytm Dłoni',
    difficulty: 2, mode: 'normal',
    text: 'Dłonie odnajdują rytm, gdy przestaję im przeszkadzać swoją niecierpliwością. Gdy wracam do podstaw, wszystko staje się prostsze i wyraźniejsze. Każdy palec wie, gdzie iść, jeśli mu na to pozwolę. Uczę się uważności przez klawiaturę — jeden znak, jedna chwila.',
  },
  {
    id: 25, chapterId: 2, pack: 'blindFlow', title: 'Pamięć Zdania',
    difficulty: 2, mode: 'blindFlow',
    text: 'Najpierw słucham uważnie. Potem piszę z pamięci, nie z oczu. Nie walczę z tekstem — pozwalam mu wrócić stamtąd, gdzie się zatrzymał. Obraz zdania zostaje chwilę po tym, jak znika z ekranu. Ufam temu, co zapamiętałem, i prowadzę palce dalej.',
  },
  {
    id: 26, chapterId: 2, pack: 'motivation', title: 'Jestem Coraz Lepszy',
    difficulty: 2, mode: 'normal',
    text: 'Jestem coraz lepszy. Nie dlatego, że nie robię błędów, ale dlatego, że za każdym razem wracam do ćwiczenia. Powtarzalność jest silniejsza niż talent. Każda runda buduje nawyk, każdy nawyk buduje umiejętność, każda umiejętność buduje spokojną pewność.',
  },
  {
    id: 27, chapterId: 2, pack: 'polishSigns', title: 'Ć, Ś i Ź',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ćwiczę śmiało, bo źródło spokoju jest bliżej, niż myślę. Trzy najtrudniejsze dla mnie znaki to ć, ś i ź. Każdy z nich wymaga skupienia, ale staje się łatwiejszy z każdym powtórzeniem. Nie spieszę się. Daje mi czas na każdy ogonek, bo czas tu naprawdę działa.',
  },
  {
    id: 28, chapterId: 2, pack: 'polishSigns', title: 'Ł i Ż',
    difficulty: 3, mode: 'hardSigns',
    text: 'Łagodność i żar mogą iść razem. Piszę dokładnie, ale nie napinam dłoni przy znakach ł i ż. Każde łagodne uderzenie jest skuteczniejsze niż napięty gest. Żar w uczeniu się nie musi oznaczać siły — może być cichą konsekwencją, która przynosi efekty.',
  },
  {
    id: 29, chapterId: 2, pack: 'relationships', title: 'Twoja Obecność',
    difficulty: 2, mode: 'normal',
    text: 'Twoja obecność ma znaczenie. Czasem jedno dobre słowo zostaje w człowieku na długo, dłużej niż wielkie gesty i głośne deklaracje. Nie musisz być wszędzie i dla wszystkich. Wystarczy, że jesteś naprawdę tam, gdzie jesteś — obecny, uważny, otwarty.',
  },
  {
    id: 30, chapterId: 2, pack: 'spirituality', title: 'Pokój w Ciszy',
    difficulty: 2, mode: 'normal',
    text: 'W ciszy odnajduję pokój. Nie wszystko musi być rozwiązane od razu i nie wszystko musi być teraz wyjaśnione. Cisza nie jest pustką — jest przestrzenią, w której można usłyszeć to, co naprawdę ważne. Uczę się być spokojny nawet gdy pytania wiszą bez odpowiedzi.',
  },
  {
    id: 31, chapterId: 2, pack: 'visualization', title: 'Żyję Jak Spełniony',
    difficulty: 3, mode: 'normal',
    text: 'Zachowuję się tak, jakby moje dobre życie już było faktem. Myśl, emocja i działanie idą razem, kiedy naprawdę w to wierzę. Nie udaję, że wszystko jest idealne — ćwiczę postawę człowieka, który wie, dokąd zmierza. To zmienia sposób, w jaki siadam każdego dnia.',
  },
  {
    id: 32, chapterId: 2, pack: 'visualization', title: 'Wdzięczność Teraz',
    difficulty: 3, mode: 'normal',
    text: 'Czuję wdzięczność teraz, nie dopiero po wszystkim. To zmienia sposób, w jaki idę przez dzień. Kiedy szukam tego, za co mogę być wdzięczny, zawsze coś znajduję — ciepłą herbatę, spokojny wieczór, chwilę przy klawiaturze bez presji. Małe rzeczy budują dobre życie.',
  },
  {
    id: 33, chapterId: 2, pack: 'stories', title: 'Kartka od Mamy',
    difficulty: 3, mode: 'normal',
    text: 'Wróciłem późno do domu. Na stole czekała kartka od mamy i garnek zupy, który wciąż był ciepły. Nie napisała wiele, tylko kilka słów — ale wiedziałem, że myślała o mnie cały dzień. Czasem miłość nie robi hałasu. Wyraża się w jedzeniu zostawionym na kuchence.',
  },
  {
    id: 34, chapterId: 2, pack: 'stories', title: 'Cichy Pokój',
    difficulty: 3, mode: 'normal',
    text: 'Pokój był cichy, ale nie pusty. Przez okno wpadało słabe zimowe słońce i rozgrzewało kawałek podłogi przy biurku. Usiadłem, otworzyłem klawiaturę i poczułem, że mam gdzie wrócić po długim dniu. W takich chwilach człowiek wie, że ma swoje miejsce.',
  },
  {
    id: 35, chapterId: 2, pack: 'noBackspace', title: 'Nie Poprawiam',
    difficulty: 3, mode: 'noBackspace',
    text: 'Nie poprawiam natychmiast. Uczę się płynąć dalej, nawet gdy pojawi się nierówność w środku zdania. Każdy błąd zostaje za mną, ale kierunek pozostaje z przodu. Jadę do końca i dopiero wtedy oceniam, co poszło nie tak i co poprawię następnym razem.',
  },
  {
    id: 36, chapterId: 2, pack: 'blindFlow', title: 'Z Pamięci',
    difficulty: 3, mode: 'blindFlow',
    text: 'Piszę z pamięci. Nie widzę całego tekstu naraz, ale widzę kierunek. Zdanie układa się w głowie zanim trafi na ekran, kawałek po kawałku. Uczę się pisać z obrazem w umyśle, nie z oczami wbitymi w litery. Obraz wystarczy. Ruch wystarczy. Ufam temu, co zapamiętałem.',
  },
  {
    id: 37, chapterId: 2, pack: 'motivation', title: 'Mniej Siły',
    difficulty: 2, mode: 'normal',
    text: 'Mniej siły, więcej rytmu. Klawiatura nie wymaga uderzeń, tylko spokojnej obecności. Gdy przestaję napinać dłonie, tekst płynie inaczej — lżej, pewniej, naturalnie. Siła to nie wartość przy klawiaturze. Wartością jest kontakt: lekki, skupiony i cierpliwy.',
  },
  {
    id: 38, chapterId: 2, pack: 'mindfulness', title: 'Lekki Dotyk',
    difficulty: 2, mode: 'normal',
    text: 'Dotykam klawiszy lekko i pewnie. Nie muszę walczyć z tekstem ani wymuszać każdego znaku. Wystarczy spokojny, świadomy ruch. Uważność przy pisaniu zaczyna się od dłoni — od tego, jak trzymam rękę, jak trafia palec, jak kończę zdanie. Cisza też jest częścią rytmu.',
  },
  {
    id: 39, chapterId: 2, pack: 'affirmations', title: 'Zasługuję na Dobro',
    difficulty: 2, mode: 'normal',
    text: 'Zasługuję na dobro. Zasługuję na spokój i na warunki, które mnie wspierają. Mogę budować życie bez ciągłej walki i bez udowadniania czegokolwiek. Moje potrzeby mają znaczenie. Mogę je wyrażać bez wstydu i dbać o nie każdego dnia bez poczucia winy.',
  },
  {
    id: 40, chapterId: 2, pack: 'motivation', title: 'Dziś Wystarczy',
    difficulty: 2, mode: 'normal',
    text: 'Dziś wystarczy jedna dobra runda. Nie muszę robić wszystkiego naraz, bo to nie wyścig — to trening. Każde ćwiczenie jest krokiem, który sumuje się w wynik. Mały postęp każdego dnia jest bardziej trwały niż wielki wysiłek raz na miesiąc. Wrócę jutro.',
  },

  // ── Rozdział 3 · Polskie Znaki ───────────────────────────────────────────────
  {
    id: 41, chapterId: 3, pack: 'polishSigns', title: 'Zażółć',
    difficulty: 3, mode: 'hardSigns',
    text: 'Zażółć gęślą jaźń — zdanie, które testuje każdy znak diakrytyczny w polskim alfabecie. Piszę je spokojnie, dbając o ż, ó, ę, ą, ź, ń. Potem ćwiczę je jeszcze raz, tym razem nieco śmielej. Każde powtórzenie wbija znak głębiej w pamięć palca, aż staje się naturalny.',
  },
  {
    id: 42, chapterId: 3, pack: 'polishSigns', title: 'Ścieżka Znaków',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ścieżka przez łąkę była wąska, ale prowadziła dokładnie tam, gdzie trzeba. Szłam nią powoli, uważając na korzenie i mokrą trawę. Żaden pośpiech nie był tu potrzebny — wystarczyło podążać dalej. Polskie znaki są jak ta ścieżka: spokojne i zawsze na swoim miejscu.',
  },
  {
    id: 43, chapterId: 3, pack: 'polishSigns', title: 'Źródło',
    difficulty: 3, mode: 'hardSigns',
    text: 'Źródło cierpliwości jest bliżej, niż sądzę. Każde ćwiczenie otwiera kolejny mały próg, a za nim jest więcej przestrzeni i spokoju. Nie spieszę się do następnego poziomu. Ważniejsze jest, żeby ten obecny był naprawdę mój — żebym czuł znaki, a nie tylko klikał.',
  },
  {
    id: 44, chapterId: 3, pack: 'polishSigns', title: 'Łąka i Dzień',
    difficulty: 3, mode: 'hardSigns',
    text: 'Łąka pachniała deszczem, a dzień płynął wolniej niż zwykle. Ćwiczyłem przy otwartym oknie, słysząc szum liści i odgłosy miasta. To był dobry znak — spokój na zewnątrz pomagał skupić się w środku. Łąka, deszcz, ł, ą, ę — wszystko tworzyło jeden spokojny rytm.',
  },
  {
    id: 45, chapterId: 3, pack: 'polishSigns', title: 'Żółty Liść',
    difficulty: 3, mode: 'hardSigns',
    text: 'Żółty liść opadł cicho na ziemię. Nikt go nie poganiał, więc zrobił to w swoim czasie i po swojemu. Tak samo jest z nauką polskich znaków — żaden pośpiech nie zastąpi spokojnego powtarzania. ż, ó, ł — każdy wymaga czasu. Daj im ten czas, a zapamiętasz je.',
  },
  {
    id: 46, chapterId: 3, pack: 'polishSigns', title: 'Cisza i Ćwiczenie',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ćwiczenie w ciszy uczy więcej niż ćwiczenie w pośpiechu i pod presją. Spokojna dłoń pamięta znaki lepiej, bo nie walczy z napięciem. Wyłączam muzykę, zamykam inne karty i siadam z pełną uwagą. ć, ś, ź — cisza jest moim najlepszym nauczycielem tych znaków.',
  },
  {
    id: 47, chapterId: 3, pack: 'polishSigns', title: 'Niech Płynie',
    difficulty: 3, mode: 'hardSigns',
    text: 'Niech tekst płynie bez szarpania i zatrzymywania. Niech palce znajdą drogę przez każdy ogonek — ą, ę, ć, ł, ń, ó, ś, ź, ż. Piszę bez oceniania się za każdy znak. Płynność jest celem, a doskonałość przychodzi po niej. Najpierw ruch i rytm, potem precyzja.',
  },
  {
    id: 48, chapterId: 3, pack: 'polishSigns', title: 'Małe Zwycięstwo',
    difficulty: 3, mode: 'hardSigns',
    text: 'Każde poprawne ą, ę, ć, ł, ń, ó, ś, ź i ż to małe zwycięstwo nad starym nawykiem. Nie muszę trafiać wszystkich od razu — z każdym powtórzeniem trafia ich więcej. Mój palec uczy się, mój mózg zapamiętuje, moja dłoń nabiera spokojnej pewności. Tak rośnie umiejętność.',
  },
  {
    id: 49, chapterId: 3, pack: 'noBackspace', title: 'Bez Cofania',
    difficulty: 3, mode: 'noBackspace',
    text: 'Bez cofania widzę prawdę o własnym rytmie. Nie ukrywam błędów pod warstwą szybkich poprawek — zostają jako ślad nauki. Płynę do końca tekstu, obserwuję co wyszło i wracam z lepszym zamiarem. Każda runda bez cofania uczy mnie więcej niż dziesięć z poprawkami.',
  },
  {
    id: 50, chapterId: 3, pack: 'blindFlow', title: 'Ślepy Strumień',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ślepy strumień płynie inaczej niż ten, który widzę. Nie widzę każdego kamienia pod wodą, ale czuję kierunek i wiem, kiedy rytm jest prawdziwy. Uczę się pisać z obrazem w umyśle, nie z oczami na ekranie. Tekst znika, ale palce wiedzą, gdzie iść. Wystarczy ufać.',
  },
]

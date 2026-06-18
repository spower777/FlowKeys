export type LessonPack =
  | 'start' | 'motivation' | 'affirmations' | 'polishSigns' | 'mindfulness'
  | 'relationships' | 'spirituality' | 'visualization' | 'stories' | 'mastery'
  | 'blindFlow' | 'noBackspace' | 'jadePath'

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
  jadePath: 'Jadeitowa Droga',
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

  // ── Rozdział 4 · Nowy Rytm ───────────────────────────────────────────────────
  {
    id: 51, chapterId: 4, pack: 'start', title: 'Nie Muszę Się Spieszyć',
    difficulty: 1, mode: 'normal',
    text: 'Nie muszę się spieszyć, żeby iść do przodu. Każdy spokojny ruch ma znaczenie. Palce wracają na swoje miejsce, a ja wracam do siebie.',
  },
  {
    id: 52, chapterId: 4, pack: 'start', title: 'Pierwszy Rytm',
    difficulty: 1, mode: 'normal',
    text: 'Najpierw rytm, potem szybkość. Klawiatura nie jest przeciwnikiem. Jest tylko mostem między myślą a światem.',
  },
  {
    id: 53, chapterId: 4, pack: 'motivation', title: 'Dobra Runda',
    difficulty: 1, mode: 'normal',
    text: 'To była runda. Nie wyrok. Jeśli popełniłem błąd, mam informację. Jeśli pisałem spokojnie, mam zwycięstwo.',
  },
  {
    id: 54, chapterId: 4, pack: 'affirmations', title: 'Kocham Siebie',
    difficulty: 1, mode: 'normal',
    text: 'Kocham siebie nie dlatego, że jestem idealny. Kocham siebie dlatego, że wracam, próbuję i uczę się być po swojej stronie.',
  },
  {
    id: 55, chapterId: 4, pack: 'affirmations', title: 'Szanuję Siebie',
    difficulty: 1, mode: 'normal',
    text: 'Szanuję siebie. Mój wysiłek ma znaczenie. Nie muszę zasługiwać na spokój perfekcją. Mogę zacząć od jednego dobrego oddechu.',
  },
  {
    id: 56, chapterId: 4, pack: 'motivation', title: 'Dajesz Radę',
    difficulty: 1, mode: 'normal',
    text: 'Dajesz radę. Nawet jeśli dzisiaj idzie wolniej, nadal idzie. Postęp czasem wygląda jak ciche wrócenie do ćwiczenia.',
  },
  {
    id: 57, chapterId: 4, pack: 'mindfulness', title: 'Nie Ma Paniki',
    difficulty: 1, mode: 'normal',
    text: 'Błąd nie jest alarmem. Błąd jest śladem. Mogę go zobaczyć, odetchnąć i pisać dalej bez robienia z klawiatury miejsca katastrofy.',
  },
  {
    id: 58, chapterId: 4, pack: 'motivation', title: 'Małe Kroki',
    difficulty: 1, mode: 'normal',
    text: 'Małe kroki budują dużą zmianę. Jedna spokojna runda dzisiaj może być początkiem nawyku, który jutro będzie pracował za mnie.',
  },
  {
    id: 59, chapterId: 4, pack: 'start', title: 'Wróć Do Rzędu',
    difficulty: 1, mode: 'normal',
    text: 'Palce wracają na rząd domowy. To nie jest kara, tylko baza. Z tej bazy mogę ruszyć w każdą stronę i nie zgubić siebie.',
  },
  {
    id: 60, chapterId: 4, pack: 'mindfulness', title: 'Oddycham',
    difficulty: 1, mode: 'normal',
    text: 'Oddycham spokojnie. Piszę wolniej. Gdy zwalniam, widzę więcej. Gdy widzę więcej, mniej walczę ze sobą.',
  },
  {
    id: 61, chapterId: 4, pack: 'affirmations', title: 'Nie Muszę Udowadniać',
    difficulty: 1, mode: 'normal',
    text: 'Nie muszę nikomu udowadniać własnej wartości. Mogę ćwiczyć po cichu, bez teatru, bez presji i bez publicznego pojedynku z Enterem.',
  },
  {
    id: 62, chapterId: 4, pack: 'motivation', title: 'Dzisiaj Wystarczy',
    difficulty: 1, mode: 'normal',
    text: 'Dzisiaj wystarczy jedna dobra runda. Nie wszystko naraz. Nie wojnę, tylko trening. Nie panika, tylko powrót.',
  },
  {
    id: 63, chapterId: 4, pack: 'affirmations', title: 'Jestem Po Swojej Stronie',
    difficulty: 1, mode: 'normal',
    text: 'Jestem po swojej stronie. Nawet kiedy coś mi nie wychodzi, nie muszę się opuszczać. Mogę poprawić kierunek bez bicia siebie kijem.',
  },
  {
    id: 64, chapterId: 4, pack: 'motivation', title: 'Cichy Progres',
    difficulty: 1, mode: 'normal',
    text: 'Progres nie zawsze krzyczy. Czasem siedzi cicho, robi swoje i po miesiącu wygląda jak cud, choć był tylko sumą małych powrotów.',
  },
  {
    id: 65, chapterId: 4, pack: 'mindfulness', title: 'Spokojna Dłoń',
    difficulty: 1, mode: 'normal',
    text: 'Spokojna dłoń pamięta więcej niż spięta głowa. Nie muszę naciskać mocniej. Wystarczy, że będę obecny.',
  },

  // ── Rozdział 5 · Głębszy Rytm ────────────────────────────────────────────────
  {
    id: 66, chapterId: 5, pack: 'motivation', title: 'Nigdy Nie Było Lepiej',
    difficulty: 2, mode: 'normal',
    text: 'Nigdy nie było lepiej, bo teraz widzę rzeczy, których wcześniej nie umiałem zobaczyć. Nawet chaos może stać się materiałem do nauki.',
  },
  {
    id: 67, chapterId: 5, pack: 'affirmations', title: 'Ufam Procesowi',
    difficulty: 2, mode: 'normal',
    text: 'Ufam procesowi. Nie muszę znać całej drogi, żeby zrobić następny krok. Wystarczy jeden ruch, jedna decyzja i jedna spokojna runda.',
  },
  {
    id: 68, chapterId: 5, pack: 'mindfulness', title: 'Mój Umysł Może Zwalniać',
    difficulty: 2, mode: 'normal',
    text: 'Mój umysł może zwalniać. Nie każda myśl musi od razu zostać złapana. Czasem najlepsze rzeczy przychodzą, gdy przestaję za nimi biec.',
  },
  {
    id: 69, chapterId: 5, pack: 'start', title: 'Piszę Jak Człowiek',
    difficulty: 2, mode: 'normal',
    text: 'Piszę jak człowiek, nie jak maszyna do produkcji wyniku. Wynik jest skutkiem ubocznym. Najważniejsze jest to, że wracam do rytmu.',
  },
  {
    id: 70, chapterId: 5, pack: 'affirmations', title: 'Jestem Wystarczający',
    difficulty: 2, mode: 'normal',
    text: 'Jestem wystarczający już teraz. Mogę się rozwijać bez pogardy do siebie. To dziwne dla mózgu, wiem, ale może się przyzwyczai.',
  },
  {
    id: 71, chapterId: 5, pack: 'mindfulness', title: 'Zamieniam Chaos W Rytm',
    difficulty: 2, mode: 'normal',
    text: 'Zamieniam chaos w rytm. Nie przez siłę, tylko przez powrót. Jedno słowo, jeden oddech, jeden znak. Tak robi się porządek.',
  },
  {
    id: 72, chapterId: 5, pack: 'affirmations', title: 'Moje Tempo',
    difficulty: 2, mode: 'normal',
    text: 'Moje tempo jest moje. Mogę przyspieszać, kiedy jestem gotowy, i zwalniać, kiedy potrzebuję precyzji. To nie ucieczka, to mądrość.',
  },
  {
    id: 73, chapterId: 5, pack: 'noBackspace', title: 'Bez Cofania',
    difficulty: 2, mode: 'noBackspace',
    text: 'Nie cofam natychmiast. Daję sobie zobaczyć prawdziwy ślad ruchu. Błąd nie znika, ale przestaje mną rządzić.',
  },
  {
    id: 74, chapterId: 5, pack: 'affirmations', title: 'Jestem Najlepszym Wydarzeniem',
    difficulty: 2, mode: 'normal',
    text: 'Jestem najlepszym, co mogło mi się przytrafić, bo ze sobą zostaję najdłużej. Warto więc mówić do siebie jak do kogoś ważnego.',
  },
  {
    id: 75, chapterId: 5, pack: 'visualization', title: 'Przyszłość Już Ćwiczy',
    difficulty: 2, mode: 'normal',
    text: 'Moja przyszłość zaczyna się w tej rundzie. Nie w wielkim przemówieniu, nie w fajerwerkach, tylko w cichym powtórzeniu dobrego ruchu.',
  },
  {
    id: 76, chapterId: 5, pack: 'mindfulness', title: 'Dłoń Wie',
    difficulty: 2, mode: 'normal',
    text: 'Dłoń wie więcej, gdy głowa nie krzyczy. Pozwalam palcom pamiętać. Pozwalam ciału uczyć się bez ciągłego egzaminu.',
  },
  {
    id: 77, chapterId: 5, pack: 'motivation', title: 'Nie Jestem Spóźniony',
    difficulty: 2, mode: 'normal',
    text: 'Nie jestem spóźniony do własnego życia. Zaczynam tam, gdzie jestem. To miejsce może być niedoskonałe, ale jest prawdziwe.',
  },
  {
    id: 78, chapterId: 5, pack: 'mindfulness', title: 'Czysta Obecność',
    difficulty: 2, mode: 'normal',
    text: 'W tej chwili nie muszę rozwiązywać całego życia. Mam tekst, oddech i palce. To wystarczy, żeby wrócić do obecności.',
  },
  {
    id: 79, chapterId: 5, pack: 'start', title: 'Nie Walczę Z Tekstem',
    difficulty: 2, mode: 'normal',
    text: 'Nie walczę z tekstem. Czytam, oddycham i piszę. Jeśli pomylę znak, świat nadal obraca się dalej, zuchwała planeta jedna.',
  },
  {
    id: 80, chapterId: 5, pack: 'mindfulness', title: 'Wewnętrzny Porządek',
    difficulty: 2, mode: 'normal',
    text: 'Porządek zaczyna się od małych rzeczy. Od dłoni. Od oddechu. Od tego, że nie uciekam, gdy robi się trochę niewygodnie.',
  },

  // ── Rozdział 6 · Polskie Ogonki ─────────────────────────────────────────────
  {
    id: 81, chapterId: 6, pack: 'polishSigns', title: 'Zażółć Spokojnie',
    difficulty: 3, mode: 'hardSigns',
    text: 'Zażółć gęślą jaźń. To nie jest zdanie, to polski smok ortograficzny. Podchodzę spokojnie, znak po znaku, bez heroizmu.',
  },
  {
    id: 82, chapterId: 6, pack: 'polishSigns', title: 'Źródło Cierpliwości',
    difficulty: 3, mode: 'hardSigns',
    text: 'Źródło cierpliwości jest bliżej, niż sądzę. Ćwiczę ą, ę, ć, ł, ń, ó, ś, ź i ż bez napinania dłoni.',
  },
  {
    id: 83, chapterId: 6, pack: 'polishSigns', title: 'Łagodność',
    difficulty: 3, mode: 'hardSigns',
    text: 'Łagodność nie oznacza słabości. Czasem oznacza, że nie muszę walić w klawisze jak człowiek próbujący obudzić drukarkę.',
  },
  {
    id: 84, chapterId: 6, pack: 'polishSigns', title: 'Ścieżka Przez Znaki',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ścieżka przez polskie znaki jest wąska, ale można ją przejść. Wystarczy mniej pośpiechu, więcej uwagi i trochę pokory dla ogonków.',
  },
  {
    id: 85, chapterId: 6, pack: 'polishSigns', title: 'Ćwiczę Bez Złości',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ćwiczę bez złości. Jeśli zgubię ś, ź albo ć, nie robię dramatu. Wracam do ruchu i uczę palce nowej mapy.',
  },
  {
    id: 86, chapterId: 6, pack: 'polishSigns', title: 'Żółty Liść',
    difficulty: 3, mode: 'hardSigns',
    text: 'Żółty liść spadł na ziemię bez pośpiechu. Nikt go nie poganiał, więc zrobił to idealnie. Moje palce też mogą zwolnić.',
  },
  {
    id: 87, chapterId: 6, pack: 'polishSigns', title: 'Łąka Po Deszczu',
    difficulty: 3, mode: 'hardSigns',
    text: 'Łąka po deszczu pachniała spokojem. Szły przez nią myśli, które nie musiały już niczego udowadniać.',
  },
  {
    id: 88, chapterId: 6, pack: 'polishSigns', title: 'Nie Gubię Ogonków',
    difficulty: 3, mode: 'hardSigns',
    text: 'Nie gubię ogonków, bo ogonki też są częścią sensu. Polska litera bez ogonka wygląda czasem jak człowiek bez kawy.',
  },
  {
    id: 89, chapterId: 6, pack: 'polishSigns', title: 'Czułość Do Detalu',
    difficulty: 3, mode: 'hardSigns',
    text: 'Czułość do detalu uczy mnie cierpliwości. Jeden znak może zmienić słowo, a jeden spokojny oddech może zmienić rundę.',
  },
  {
    id: 90, chapterId: 6, pack: 'polishSigns', title: 'Mały Ogonek, Duża Różnica',
    difficulty: 3, mode: 'hardSigns',
    text: 'Mały ogonek robi dużą różnicę. Tak samo mały nawyk. Tak samo jedna decyzja, żeby nie panikować przy błędzie.',
  },

  // ── Rozdział 7 · Blind Flow ──────────────────────────────────────────────────
  {
    id: 91, chapterId: 7, pack: 'blindFlow', title: 'Piszę Z Pamięci',
    difficulty: 3, mode: 'blindFlow',
    text: 'Piszę z pamięci. Nie widzę wszystkiego, ale czuję kierunek. To ćwiczenie nie sprawdza tylko palców. Sprawdza zaufanie.',
  },
  {
    id: 92, chapterId: 7, pack: 'blindFlow', title: 'Mniej Oczu',
    difficulty: 3, mode: 'blindFlow',
    text: 'Kiedy mniej patrzę, mniej kontroluję. Kiedy mniej kontroluję, zaczynam słyszeć rytm. Blind Flow to nie ciemność, tylko inny rodzaj uwagi.',
  },
  {
    id: 93, chapterId: 7, pack: 'blindFlow', title: 'Wewnętrzna Klawiatura',
    difficulty: 3, mode: 'blindFlow',
    text: 'Wewnętrzna klawiatura buduje się powoli. Najpierw jest zgadywanie, potem rytm, a potem nagle palce wiedzą, gdzie wrócić.',
  },
  {
    id: 94, chapterId: 7, pack: 'blindFlow', title: 'Nie Widzę, Ale Idę',
    difficulty: 3, mode: 'blindFlow',
    text: 'Nie widzę całego tekstu, ale idę dalej. To dobra lekcja dla pisania i całego życia, niestety życie też ma kiepski interfejs.',
  },
  {
    id: 95, chapterId: 7, pack: 'blindFlow', title: 'Cisza Ekranu',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ekran milczy, więc słyszę siebie. Palce przestają pytać o pozwolenie. Zaczynają szukać rytmu w pamięci.',
  },
  {
    id: 96, chapterId: 7, pack: 'blindFlow', title: 'Bez Podglądania',
    difficulty: 3, mode: 'blindFlow',
    text: 'Bez podglądania widać więcej. Widać napięcie, pośpiech i miejsca, w których głowa próbuje przejąć stery jak spanikowany kapitan.',
  },
  {
    id: 97, chapterId: 7, pack: 'blindFlow', title: 'Pamiętam Zdanie',
    difficulty: 3, mode: 'blindFlow',
    text: 'Pamiętam zdanie nie jako obraz, ale jako rytm. Słowa wracają przez dłonie. Nie muszę ich gonić, wystarczy je zaprosić.',
  },
  {
    id: 98, chapterId: 7, pack: 'blindFlow', title: 'Ciemność Pomaga',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ciemność pomaga, gdy oczy robią za komisję śledczą. Zamykam kontrolę, otwieram rytm i pozwalam dłoniom pracować.',
  },
  {
    id: 99, chapterId: 7, pack: 'blindFlow', title: 'Piszę Dalej',
    difficulty: 3, mode: 'blindFlow',
    text: 'Piszę dalej, nawet jeśli nie jestem pewien. Niepewność nie musi mnie zatrzymać. Może być tylko częścią drogi.',
  },
  {
    id: 100, chapterId: 7, pack: 'blindFlow', title: 'Ufam Dłoniom',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ufam dłoniom. Ufam rytmowi. Ufam temu, że ciało może nauczyć się rzeczy, których głowa nie musi ciągle nadzorować.',
  },

  // ── Rozdział 8 · Wizualizacja ────────────────────────────────────────────────
  {
    id: 101, chapterId: 8, pack: 'visualization', title: 'Żyję Jak Spełniony',
    difficulty: 3, mode: 'normal',
    text: 'Żyję tak, jakby moje dobre życie już zaczęło się dzisiaj. Nie czekam na idealny moment. Wchodzę w stan człowieka, który wraca do siebie.',
  },
  {
    id: 102, chapterId: 8, pack: 'visualization', title: 'Neville Bez Peleryny',
    difficulty: 3, mode: 'normal',
    text: 'Wyobrażam sobie koniec, ale nie uciekam od działania. Czuję spełnienie i robię mały krok. Mistyka mistyką, ale palce też mają robotę.',
  },
  {
    id: 103, chapterId: 8, pack: 'visualization', title: 'Stan Spełnienia',
    difficulty: 3, mode: 'normal',
    text: 'Wchodzę w stan spełnienia. Nie jako udawanie, ale jako ćwiczenie wyboru. Moje ciało uczy się nowego sposobu bycia.',
  },
  {
    id: 104, chapterId: 8, pack: 'visualization', title: 'Obraz Przyszłości',
    difficulty: 3, mode: 'normal',
    text: 'Widzę siebie spokojnego, silnego i obecnego. Nie idealnego. Prawdziwego. Takiego, który nie ucieka od życia ani od klawiatury.',
  },
  {
    id: 105, chapterId: 8, pack: 'visualization', title: 'Już Jestem W Drodze',
    difficulty: 3, mode: 'normal',
    text: 'Już jestem w drodze. Nie muszę czekać, aż poczuję się gotowy. Gotowość często przychodzi dopiero po pierwszym ruchu.',
  },
  {
    id: 106, chapterId: 8, pack: 'visualization', title: 'Czuję To Teraz',
    difficulty: 3, mode: 'normal',
    text: 'Czuję wdzięczność teraz, nie dopiero po wszystkim. To zmienia napięcie w ciele i sposób, w jaki patrzę na własny dzień.',
  },
  {
    id: 107, chapterId: 8, pack: 'visualization', title: 'Dobre Życie',
    difficulty: 3, mode: 'normal',
    text: 'Dobre życie nie musi wejść z fanfarami. Może zacząć się od tego, że dziś nie zdradzam siebie w małych decyzjach.',
  },
  {
    id: 108, chapterId: 8, pack: 'visualization', title: 'Nowa Tożsamość',
    difficulty: 3, mode: 'normal',
    text: 'Staję się człowiekiem, który ćwiczy spokojnie. Człowiekiem, który kończy rundę. Człowiekiem, który nie robi z błędu religii.',
  },
  {
    id: 109, chapterId: 8, pack: 'visualization', title: 'To Już Pracuje',
    difficulty: 3, mode: 'normal',
    text: 'To już pracuje we mnie. Nawyk rośnie po cichu. Nie muszę widzieć korzeni, żeby wiedzieć, że coś zaczyna się układać.',
  },
  {
    id: 110, chapterId: 8, pack: 'visualization', title: 'Przyszły Ja',
    difficulty: 3, mode: 'normal',
    text: 'Przyszły ja nie jest obcym człowiekiem. To ja po wielu małych powrotach. Każda runda jest wiadomością wysłaną do niego.',
  },

  // ── Rozdział 9 · Duchowość ───────────────────────────────────────────────────
  {
    id: 111, chapterId: 9, pack: 'spirituality', title: 'Jezus Cię Kocha',
    difficulty: 2, mode: 'normal',
    text: 'Jezus cię kocha. Nie jako hasło na kubku, tylko jako przypomnienie, że nie jesteś sam w miejscu, którego nie umiesz jeszcze nazwać.',
  },
  {
    id: 112, chapterId: 9, pack: 'spirituality', title: 'Pokój W Ciszy',
    difficulty: 2, mode: 'normal',
    text: 'W ciszy też może być obecność. Nie każda odpowiedź przychodzi jako zdanie. Czasem przychodzi jako pokój, który zostaje chwilę dłużej.',
  },
  {
    id: 113, chapterId: 9, pack: 'spirituality', title: 'Nie Jestem Sam',
    difficulty: 2, mode: 'normal',
    text: 'Nie jestem sam. Nawet gdy dzień jest ciężki, mogę oprzeć się o coś większego niż mój aktualny lęk.',
  },
  {
    id: 114, chapterId: 9, pack: 'spirituality', title: 'Łaska Nie Krzyczy',
    difficulty: 3, mode: 'normal',
    text: 'Łaska nie zawsze krzyczy. Czasem działa cicho, jak światło pod drzwiami. Wystarczy zauważyć, że jeszcze jest droga.',
  },
  {
    id: 115, chapterId: 9, pack: 'spirituality', title: 'Modlitwa Bez Słów',
    difficulty: 3, mode: 'normal',
    text: 'Czasem modlitwa nie ma słów. Jest tylko oddech, zmęczenie i pragnienie, żeby wrócić do dobra. To też może wystarczyć.',
  },
  {
    id: 116, chapterId: 9, pack: 'spirituality', title: 'Bóg Nie Jest Excelem',
    difficulty: 3, mode: 'normal',
    text: 'Bóg nie jest Excelem, który liczy moje błędy w komórkach. Mogę wracać bez udawania, że zawsze wiem, co robię.',
  },
  {
    id: 117, chapterId: 9, pack: 'spirituality', title: 'Światło W Małym Ruchu',
    difficulty: 3, mode: 'normal',
    text: 'Światło czasem pojawia się w małym ruchu. W tym, że nie rezygnuję. W tym, że robię jedną dobrą rzecz mimo zmęczenia.',
  },
  {
    id: 118, chapterId: 9, pack: 'spirituality', title: 'Nie Muszę Być Gotowy',
    difficulty: 3, mode: 'normal',
    text: 'Nie muszę być gotowy, żeby zostać poprowadzony. Czasem wystarczy powiedzieć: jestem tutaj, nie wiem jak, ale chcę iść dalej.',
  },
  {
    id: 119, chapterId: 9, pack: 'spirituality', title: 'Wdzięczność',
    difficulty: 3, mode: 'normal',
    text: 'Wdzięczność nie kasuje problemów. Ona tylko przypomina, że problemy nie są całą prawdą. To już dużo.',
  },
  {
    id: 120, chapterId: 9, pack: 'spirituality', title: 'Ciche Prowadzenie',
    difficulty: 3, mode: 'normal',
    text: 'Ciche prowadzenie nie zawsze wygląda jak znak z nieba. Czasem wygląda jak decyzja, żeby nie wracać do starego chaosu.',
  },

  // ── Rozdział 10 · Relacje ────────────────────────────────────────────────────
  {
    id: 121, chapterId: 10, pack: 'relationships', title: 'Ojciec Też Wraca',
    difficulty: 3, mode: 'normal',
    text: 'Ojciec też się uczy. Nie zawsze wiedziałem, jak być obecny, ale mogę wracać. Miłość nie jest perfekcją. Miłość jest powrotem.',
  },
  {
    id: 122, chapterId: 10, pack: 'relationships', title: 'Dziecko Patrzy',
    difficulty: 3, mode: 'normal',
    text: 'Dziecko patrzy nie tylko na moje słowa, ale na mój rytm. Jeśli uczę się spokoju, pokazuję więcej niż jedną lekcję.',
  },
  {
    id: 123, chapterId: 10, pack: 'relationships', title: 'Nie Naprawię Wszystkiego Naraz',
    difficulty: 3, mode: 'normal',
    text: 'Nie naprawię wszystkiego naraz. Mogę jednak być dziś trochę bardziej obecny niż wczoraj. To nie jest mało.',
  },
  {
    id: 124, chapterId: 10, pack: 'relationships', title: 'Dobrze, Że Jesteś',
    difficulty: 2, mode: 'normal',
    text: 'Dobrze, że jesteś. Twoja obecność ma znaczenie, nawet gdy nie masz gotowej odpowiedzi. Czasem wystarczy zostać.',
  },
  {
    id: 125, chapterId: 10, pack: 'relationships', title: 'Miłość W Praktyce',
    difficulty: 3, mode: 'normal',
    text: 'Miłość w praktyce rzadko wygląda jak film. Częściej wygląda jak cierpliwość, rozmowa, herbata i nieuciekanie, gdy robi się trudno.',
  },
  {
    id: 126, chapterId: 10, pack: 'relationships', title: 'Słucham',
    difficulty: 2, mode: 'normal',
    text: 'Słucham uważniej. Nie po to, żeby wygrać rozmowę, ale żeby naprawdę usłyszeć człowieka po drugiej stronie.',
  },
  {
    id: 127, chapterId: 10, pack: 'relationships', title: 'Nie Muszę Mieć Racji',
    difficulty: 3, mode: 'normal',
    text: 'Nie muszę zawsze mieć racji. Mogę mieć kontakt. A kontakt jest często cenniejszy niż triumfalne stanie na ruinach dyskusji.',
  },
  {
    id: 128, chapterId: 10, pack: 'relationships', title: 'Bliskość',
    difficulty: 3, mode: 'normal',
    text: 'Bliskość nie powstaje z wielkich deklaracji. Powstaje z małych chwil, w których ktoś czuje, że nie musi udawać.',
  },
  {
    id: 129, chapterId: 10, pack: 'relationships', title: 'Mniej Obrony',
    difficulty: 3, mode: 'normal',
    text: 'Mniej się bronię, więcej słucham. To trudne, bo ego lubi nosić hełm. Ale czasem można go zdjąć i nadal przeżyć.',
  },
  {
    id: 130, chapterId: 10, pack: 'relationships', title: 'Dobre Słowo',
    difficulty: 2, mode: 'normal',
    text: 'Dobre słowo może zostać w człowieku na długo. Nie zawsze wiem, które słowo nim będzie, więc mówię ostrożniej.',
  },

  // ── Rozdział 11 · Opowieści ──────────────────────────────────────────────────
  {
    id: 131, chapterId: 11, pack: 'stories', title: 'Kartka Od Mamy',
    difficulty: 3, mode: 'normal',
    text: 'Wróciłem późno do domu. Na stole czekała kartka od mamy i garnek zupy. Czasem miłość nie robi hałasu, tylko zostawia ciepło.',
  },
  {
    id: 132, chapterId: 11, pack: 'stories', title: 'Pies Przy Kaloryferze',
    difficulty: 3, mode: 'normal',
    text: 'Pies spał zwinięty przy kaloryferze i nawet nie wstał mnie przywitać. Uznałem to za szczyt zaufania albo bezczelności.',
  },
  {
    id: 133, chapterId: 11, pack: 'stories', title: 'Bieg Po Zmroku',
    difficulty: 3, mode: 'normal',
    text: 'Wybiegłem po zmroku, gdy miasto zaczynało milknąć. Po kilku minutach oddech znalazł rytm, a głowa przestała udawać centrum wszechświata.',
  },
  {
    id: 134, chapterId: 11, pack: 'stories', title: 'Stara Klawiatura',
    difficulty: 3, mode: 'normal',
    text: 'Stara klawiatura miała własny charakter. Niektóre klawisze działały jakby po negocjacjach, inne jakby miały osobisty żal do użytkownika.',
  },
  {
    id: 135, chapterId: 11, pack: 'stories', title: 'Deszcz Na Szybie',
    difficulty: 3, mode: 'normal',
    text: 'Deszcz stukał o szybę, a ja pisałem wolniej niż zwykle. Nie dlatego, że nie umiałem. Dlatego, że pierwszy raz nie musiałem uciekać.',
  },
  {
    id: 136, chapterId: 11, pack: 'stories', title: 'Nocna Iteracja',
    difficulty: 3, mode: 'normal',
    text: 'O drugiej w nocy poprawiałem kolor przycisku, jakby od tego zależał los cywilizacji. Rano okazało się, że najbardziej potrzebowałem snu.',
  },
  {
    id: 137, chapterId: 11, pack: 'stories', title: 'Mały Pokój',
    difficulty: 3, mode: 'normal',
    text: 'Pokój był mały, ale spokojny. Na biurku stał kubek, obok leżały notatki, a w środku dnia pojawiło się coś podobnego do nadziei.',
  },
  {
    id: 138, chapterId: 11, pack: 'stories', title: 'Powrót Z Pracy',
    difficulty: 3, mode: 'normal',
    text: 'Wróciłem z pracy zmęczony, ale nie całkiem pusty. Czasem wystarczy prosta rzecz: cisza, zupa i świadomość, że dzień już się kończy.',
  },
  {
    id: 139, chapterId: 11, pack: 'stories', title: 'Runda Po Biegu',
    difficulty: 3, mode: 'normal',
    text: 'Po biegu palce pisały inaczej. Ciało było zmęczone, ale spokojniejsze. Jakby napięcie zostało gdzieś między latarniami.',
  },
  {
    id: 140, chapterId: 11, pack: 'stories', title: 'Zwykły Wieczór',
    difficulty: 3, mode: 'normal',
    text: 'Zwykły wieczór może być początkiem zmiany. Nie musi wyglądać imponująco. Wystarczy, że nie oddam go bezmyślnie staremu chaosowi.',
  },

  // ── Rozdział 12 · Mistrzostwo ────────────────────────────────────────────────
  {
    id: 141, chapterId: 12, pack: 'mastery', title: 'Mistrz Nie Krzyczy',
    difficulty: 4, mode: 'normal',
    text: 'Mistrz nie musi krzyczeć, że jest mistrzem. Po prostu wraca do podstaw, kiedy inni szukają magicznego skrótu z brokatem.',
  },
  {
    id: 142, chapterId: 12, pack: 'mastery', title: 'Dokładność Przed Prędkością',
    difficulty: 4, mode: 'normal',
    text: 'Dokładność przed prędkością. Najpierw czysta droga, potem tempo. Szybkość bez kontroli to tylko efektowna forma potykania się.',
  },
  {
    id: 143, chapterId: 12, pack: 'mastery', title: 'Stabilność',
    difficulty: 4, mode: 'normal',
    text: 'Stabilność jest większym osiągnięciem niż jednorazowy rekord. Rekord robi hałas. Stabilność zmienia człowieka po cichu.',
  },
  {
    id: 144, chapterId: 12, pack: 'mastery', title: 'Nie Gonię Wyniku',
    difficulty: 4, mode: 'normal',
    text: 'Nie gonię wyniku. Buduję warunki, w których wynik sam zaczyna rosnąć. To nudniejsze, więc oczywiście skuteczniejsze.',
  },
  {
    id: 145, chapterId: 12, pack: 'mastery', title: 'Mniej Dramatycznie',
    difficulty: 4, mode: 'normal',
    text: 'Mniej dramatycznie, bardziej regularnie. Tak powstaje postęp. Niestety bez fanfar, smoków i muzyki trailerowej.',
  },
  {
    id: 146, chapterId: 12, pack: 'mastery', title: 'Spokojna Moc',
    difficulty: 4, mode: 'normal',
    text: 'Spokojna moc nie wygląda jak napięcie. Wygląda jak człowiek, który robi swoje, nawet gdy nikt nie klaszcze.',
  },
  {
    id: 147, chapterId: 12, pack: 'mastery', title: 'Rzemiosło',
    difficulty: 4, mode: 'normal',
    text: 'Rzemiosło zaczyna się tam, gdzie kończy się zachwyt nad nowością. Wracam, powtarzam, poprawiam i pozwalam, żeby jakość rosła.',
  },
  {
    id: 148, chapterId: 12, pack: 'mastery', title: 'Pełna Obecność',
    difficulty: 4, mode: 'normal',
    text: 'Pełna obecność to nie napięta kontrola. To spokojne widzenie tego, co jest. Tekstu, dłoni, błędu, oddechu i następnego znaku.',
  },
  {
    id: 149, chapterId: 12, pack: 'mastery', title: 'Nie Uciekam',
    difficulty: 4, mode: 'normal',
    text: 'Nie uciekam od trudniejszej rundy. Nie muszę jej wygrać spektakularnie. Wystarczy, że przejdę przez nią uczciwie.',
  },
  {
    id: 150, chapterId: 12, pack: 'mastery', title: '777 Flow',
    difficulty: 5, mode: 'normal',
    text: 'Na końcu nie chodzi o 777 lekcji. Chodzi o człowieka, który nauczył się wracać. Do rytmu, do spokoju, do siebie i do następnego znaku.',
  },

  // ── Rozdział 13 · Jadeitowa Droga I ─────────────────────────────────────────
  {
    id: 151, chapterId: 13, pack: 'jadePath', title: 'Ciche Ostrze',
    difficulty: 2, mode: 'normal',
    text: 'Ostrze nie musi błyszczeć, żeby było ostre. Człowiek nie musi krzyczeć, żeby mieć siłę. Najpierw cisza, potem ruch.',
  },
  {
    id: 152, chapterId: 13, pack: 'jadePath', title: 'Droga Bambusu',
    difficulty: 2, mode: 'normal',
    text: 'Bambus ugina się na wietrze, ale nie łamie. Uczę się tego samego. Mniej oporu, więcej elastyczności, spokojniejszy powrót.',
  },
  {
    id: 153, chapterId: 13, pack: 'jadePath', title: 'Mistrz I Oddech',
    difficulty: 2, mode: 'normal',
    text: 'Mistrz nie patrzył na moje błędy. Patrzył na mój oddech. Powiedział, że palce zdradzają tylko to, czego serce jeszcze nie uspokoiło.',
  },
  {
    id: 154, chapterId: 13, pack: 'jadePath', title: 'Deszcz Na Dziedzińcu',
    difficulty: 2, mode: 'normal',
    text: 'Deszcz padał na pusty dziedziniec. Każda kropla trafiała dokładnie tam, gdzie miała spaść. Tak chcę pisać: bez pośpiechu i bez walki.',
  },
  {
    id: 155, chapterId: 13, pack: 'jadePath', title: 'Pierwszy Ukłon',
    difficulty: 2, mode: 'normal',
    text: 'Zanim dotknę klawiatury, robię wewnętrzny ukłon. Nie przed tekstem, nie przed wynikiem, ale przed własnym skupieniem.',
  },
  {
    id: 156, chapterId: 13, pack: 'jadePath', title: 'Liść Na Wodzie',
    difficulty: 2, mode: 'normal',
    text: 'Liść płynie po wodzie, bo nie próbuje wygrać z rzeką. Ja też nie muszę walczyć z tekstem. Wystarczy, że odnajdę nurt.',
  },

  // ── Rozdział 14 · Jadeitowa Droga II ────────────────────────────────────────
  {
    id: 157, chapterId: 14, pack: 'jadePath', title: 'Dziesięć Pierścieni Spokoju',
    difficulty: 3, mode: 'normal',
    text: 'Każdy pierścień był lekcją. Jeden uczył cierpliwości, drugi odwagi, trzeci ciszy. Ostatni przypominał, że największa moc nie potrzebuje hałasu.',
  },
  {
    id: 158, chapterId: 14, pack: 'jadePath', title: 'Dom Latających Myśli',
    difficulty: 3, mode: 'normal',
    text: 'Myśli przelatywały jak sztylety przez bambusowy las. Nie próbowałem łapać wszystkich. Wybrałem jedną i poprowadziłem ją spokojnie do końca.',
  },
  {
    id: 159, chapterId: 14, pack: 'jadePath', title: 'Hero Bez Publiczności',
    difficulty: 3, mode: 'normal',
    text: 'Prawdziwy bohater nie zawsze stoi na placu przed armią. Czasem siedzi wieczorem przy biurku i nie ucieka od własnego treningu.',
  },
  {
    id: 160, chapterId: 14, pack: 'jadePath', title: 'Szkoła Cienia',
    difficulty: 3, mode: 'normal',
    text: 'Cień nie jest wrogiem. Pokazuje tylko, gdzie jeszcze nie dotarło światło. Błąd w tekście działa podobnie, choć mniej poetycko i bardziej irytująco.',
  },
  {
    id: 161, chapterId: 14, pack: 'jadePath', title: 'Niebieski Miecz',
    difficulty: 3, mode: 'normal',
    text: 'Niebieski miecz przeciął powietrze bez gniewu. W tym ruchu było coś więcej niż siła. Była decyzja, że chaos nie będzie już dowodził.',
  },
  {
    id: 162, chapterId: 14, pack: 'jadePath', title: 'Jadeitowa Brama',
    difficulty: 3, mode: 'normal',
    text: 'Przed jadeitową bramą nie pytano o szybkość. Pytano, czy umiesz wrócić po błędzie. Dopiero wtedy otwierała się pierwsza lekcja.',
  },
  {
    id: 163, chapterId: 14, pack: 'jadePath', title: 'Trening O Świcie',
    difficulty: 3, mode: 'normal',
    text: 'O świcie nie było widowni. Był tylko chłód, oddech i powtarzany ruch. Tak rodzi się prawdziwa zmiana: bez świadków, bez fanfar.',
  },
  {
    id: 164, chapterId: 14, pack: 'jadePath', title: 'Czerwony Szal',
    difficulty: 3, mode: 'normal',
    text: 'Czerwony szal poruszył się na wietrze, zanim ciało zrobiło pierwszy krok. Czasem zamiar pojawia się wcześniej niż ruch. Trzeba go usłyszeć.',
  },
  {
    id: 165, chapterId: 14, pack: 'jadePath', title: 'Lekcja Mistrza',
    difficulty: 3, mode: 'normal',
    text: 'Mistrz powiedział: jeśli chcesz pisać szybko, najpierw naucz się pisać spokojnie. Uznałem to za banał, więc oczywiście miał rację.',
  },
  {
    id: 166, chapterId: 14, pack: 'jadePath', title: 'Kamień I Rzeka',
    difficulty: 3, mode: 'normal',
    text: 'Kamień trwa, rzeka płynie. Człowiek potrzebuje obu. Stałości, żeby wracać, i ruchu, żeby nie zamienić się w mebel z ambicjami.',
  },
  {
    id: 167, chapterId: 14, pack: 'jadePath', title: 'Ostrze Bez Gniewu',
    difficulty: 3, mode: 'normal',
    text: 'Ostrze prowadzone gniewem drży. Ostrze prowadzone spokojem trafia. Palce działają podobnie. Gdy przestaję walczyć, zaczynam pisać czyściej.',
  },
  {
    id: 168, chapterId: 14, pack: 'jadePath', title: 'Sala Luster',
    difficulty: 3, mode: 'normal',
    text: 'W sali luster zobaczyłem wszystkie swoje wersje. Najbardziej spodobała mi się ta, która nie panikowała po jednym błędzie.',
  },
  {
    id: 169, chapterId: 14, pack: 'jadePath', title: 'Smok Nad Dachami',
    difficulty: 3, mode: 'normal',
    text: 'Smok przeleciał nad dachami miasta i nie obejrzał się ani razu. Być może dlatego był smokiem, a nie człowiekiem poprawiającym każde zdanie.',
  },
  {
    id: 170, chapterId: 14, pack: 'jadePath', title: 'Ukryta Siła',
    difficulty: 3, mode: 'normal',
    text: 'Ukryta siła nie mieszka w napięciu. Mieszka w decyzji, że dziś znów siadam, znów ćwiczę i znów wracam do rytmu.',
  },

  // ── Rozdział 15 · Jadeitowa Droga III ───────────────────────────────────────
  {
    id: 171, chapterId: 15, pack: 'jadePath', title: 'Most Nad Mgłą',
    difficulty: 4, mode: 'normal',
    text: 'Most nad mgłą wyglądał, jakby prowadził donikąd. A jednak każdy krok odsłaniał następny fragment drogi. Tak właśnie działa praktyka.',
  },
  {
    id: 172, chapterId: 15, pack: 'jadePath', title: 'Cisza Przed Ruchem',
    difficulty: 4, mode: 'normal',
    text: 'Najważniejszy moment przychodzi przed ruchem. Krótka cisza, w której ciało wybiera kierunek. Jeśli tam jest spokój, reszta ma szansę się ułożyć.',
  },
  {
    id: 173, chapterId: 15, pack: 'jadePath', title: 'Tancerz I Wojownik',
    difficulty: 4, mode: 'normal',
    text: 'Tancerz i wojownik spotkali się na pustym placu. Jeden znał lekkość, drugi dyscyplinę. Dopiero razem zrozumieli, czym jest prawdziwy rytm.',
  },
  {
    id: 174, chapterId: 15, pack: 'jadePath', title: 'Złoty Krąg',
    difficulty: 4, mode: 'normal',
    text: 'Złoty krąg zamknął się wokół dłoni, ale nie był więzieniem. Był przypomnieniem, że moc bez kierunku staje się tylko hałasem.',
  },
  {
    id: 175, chapterId: 15, pack: 'jadePath', title: 'Bambusowy Las',
    difficulty: 4, mode: 'normal',
    text: 'W bambusowym lesie każdy dźwięk wydawał się większy. Mój oddech, krok, szelest ubrania. W takim miejscu nie da się oszukać własnego napięcia.',
  },
  {
    id: 176, chapterId: 15, pack: 'jadePath', title: 'Czarna Herbata',
    difficulty: 4, mode: 'normal',
    text: 'Czarna herbata parzyła się powoli. Nikt jej nie poganiał, bo każdy wiedział, że smak wymaga czasu. Trening dłoni też nie lubi desperacji.',
  },
  {
    id: 177, chapterId: 15, pack: 'jadePath', title: 'Mapa Bez Atramentu',
    difficulty: 4, mode: 'normal',
    text: 'Dostałem mapę bez atramentu. Mistrz powiedział, że droga pojawi się dopiero wtedy, gdy zacznę iść. Bardzo zabawne, mistrzu, bardzo wygodne.',
  },
  {
    id: 178, chapterId: 15, pack: 'jadePath', title: 'Trzy Oddechy',
    difficulty: 4, mode: 'normal',
    text: 'Pierwszy oddech uspokaja ciało. Drugi porządkuje myśli. Trzeci przypomina, że nie muszę wygrać rundy, żeby ją dobrze przeżyć.',
  },
  {
    id: 179, chapterId: 15, pack: 'jadePath', title: 'Księga Bez Tytułu',
    difficulty: 4, mode: 'normal',
    text: 'Księga nie miała tytułu, bo każdy uczeń musiał nadać jej własny sens. Moja zaczęła się od prostego zdania: wracaj do rytmu.',
  },
  {
    id: 180, chapterId: 15, pack: 'jadePath', title: 'Ostatnia Próba',
    difficulty: 4, mode: 'normal',
    text: 'Ostatnia próba nie sprawdzała siły. Sprawdzała, czy po porażce potrafię wstać bez teatralnego cierpienia i zrobić następny krok.',
  },
  {
    id: 181, chapterId: 15, pack: 'jadePath', title: 'Czerwony Pył',
    difficulty: 4, mode: 'normal',
    text: 'Czerwony pył unosił się po walce, ale najważniejsze było to, co zostało po nim: cisza, oddech i decyzja, żeby nie wracać do chaosu.',
  },
  {
    id: 182, chapterId: 15, pack: 'jadePath', title: 'Mistrz Klawiatury',
    difficulty: 4, mode: 'normal',
    text: 'Mistrz klawiatury nie wali w klawisze. Dotyka ich jak ktoś, kto wie, że każdy znak jest małą bramą. Pretensjonalne, ale działa.',
  },
  {
    id: 183, chapterId: 15, pack: 'jadePath', title: 'Siedem Bram',
    difficulty: 4, mode: 'normal',
    text: 'Przeszedłem przez siedem bram. Za każdą czekała ta sama lekcja w innym przebraniu: mniej napięcia, więcej obecności, spokojniejszy powrót.',
  },
  {
    id: 184, chapterId: 15, pack: 'jadePath', title: 'Wojownik Nie Ucieka',
    difficulty: 4, mode: 'normal',
    text: 'Wojownik nie ucieka przed własnym błędem. Patrzy na niego, uczy się z niego i idzie dalej. Bez dramatu, bez fanfar, bez robienia miny do plakatu.',
  },
  {
    id: 185, chapterId: 15, pack: 'jadePath', title: 'Światło Na Ostrzu',
    difficulty: 4, mode: 'normal',
    text: 'Światło zatrzymało się na ostrzu tylko przez chwilę. Wystarczyło, żeby zobaczyć, że prawdziwa precyzja jest spokojna.',
  },
  {
    id: 186, chapterId: 15, pack: 'jadePath', title: 'Kropla Atramentu',
    difficulty: 4, mode: 'normal',
    text: 'Jedna kropla atramentu spadła na papier i zmieniła cały znak. Jedna decyzja potrafi zrobić to samo z dniem.',
  },
  {
    id: 187, chapterId: 15, pack: 'jadePath', title: 'Niebo Po Burzy',
    difficulty: 4, mode: 'normal',
    text: 'Niebo po burzy nie tłumaczy się z grzmotów. Po prostu robi się jasne. Może ja też nie muszę analizować każdego starego chaosu.',
  },
  {
    id: 188, chapterId: 15, pack: 'jadePath', title: 'Krąg Uczniów',
    difficulty: 4, mode: 'normal',
    text: 'W kręgu uczniów każdy chciał wyglądać spokojnie. Tylko jeden naprawdę oddychał. I oczywiście ten jeden pisał najlepiej, irytująca legenda.',
  },
  {
    id: 189, chapterId: 15, pack: 'jadePath', title: 'Stary Dzwon',
    difficulty: 4, mode: 'normal',
    text: 'Stary dzwon zabrzmiał raz i wszyscy zamilkli. Nie dlatego, że był głośny. Dlatego, że jego dźwięk miał środek.',
  },
  {
    id: 190, chapterId: 15, pack: 'jadePath', title: 'Złoty Smok',
    difficulty: 5, mode: 'normal',
    text: 'Złoty smok nie pilnował skarbu. Pilnował wejścia do miejsca, w którym człowiek przestaje udawać, że brak cierpliwości jest charakterem.',
  },
]

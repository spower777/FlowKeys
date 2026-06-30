export type LessonPack =
  | 'start' | 'motivation' | 'affirmations' | 'polishSigns' | 'mindfulness'
  | 'relationships' | 'spirituality' | 'visualization' | 'stories' | 'mastery'
  | 'blindFlow' | 'noBackspace' | 'jadePath' | 'gaming' | 'homerow'
  | 'numbers' | 'symbols'
  | 'emeraldTablets' | 'bhagavadGita' | 'taoTeching'

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
  gaming: 'Gaming',
  homerow: 'Podstawy',
  numbers: 'Cyfry',
  symbols: 'Symbole',
  emeraldTablets: 'Tablice Szmaragdowe',
  bhagavadGita: 'Bhagavad Gita',
  taoTeching: 'Tao Te Ching',
}

export const MODE_LABEL: Record<LessonMode, string> = {
  normal: 'Normal', blindFlow: 'Blind', noBackspace: 'No BS', hardSigns: 'PL znaki',
}

export const lessons: FlowLesson[] = [
  // ── Rozdział 17 · Rząd Domowy ─────────────────────────────────────────────────
  {
    id: 211, chapterId: 17, pack: 'homerow', title: 'Palce na miejscu',
    subtitle: 'f i j — dwa wskazujące', difficulty: 1, mode: 'normal',
    text: 'ff jj ff jj fj jf fff jjj fjf jfj ffj jjf fj jf fjfj jfjf ff jj ff jj fj jf fjf jfj fj jf ff jj ff jj fj jf fff jjj fjf jfj ffj jjf fj jf fjfj',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 212, chapterId: 17, pack: 'homerow', title: 'Środkowe palce',
    subtitle: 'd i k', difficulty: 1, mode: 'normal',
    text: 'dd kk dd kk dk kd ddd kkk dkd kdk ddk kdd dk kd dkdk kdkd dd kk dd kk dk kd dkd kdk dd kk dd kk dk kd ddd kkk dkd kdk ddk kdd dk kd dkdk',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 213, chapterId: 17, pack: 'homerow', title: 'Pierścieniowe palce',
    subtitle: 's i l', difficulty: 1, mode: 'normal',
    text: 'ss ll ss ll sl ls sss lll sls lsl ssl lss sl ls slsl lsls ss ll ss ll sl ls sls lsl ss ll ss ll sl ls sss lll sls lsl ssl lss sl ls slsl',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 214, chapterId: 17, pack: 'homerow', title: 'Mały palec',
    subtitle: 'a — lewy mały', difficulty: 1, mode: 'normal',
    text: 'aa aa aaa aas aad aaf aaj aak aal as ad af aj ak al aa ss aa dd aa ff aa jj aa kk aa ll aa aa aaa aas aad aaf aaj aak aal as ad af aj ak al',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 215, chapterId: 17, pack: 'homerow', title: 'g i h — środek',
    subtitle: 'wskazujące sięgają środka', difficulty: 1, mode: 'normal',
    text: 'gg hh gg hh gh hg ggg hhh ghg hgh ggh hhg gh hg fgh jhg ghgh hghg gg hh gh hg fgh jhg gg hh gg hh gh hg ggg hhh ghg hgh ggh hhg gh hg fgh',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 216, chapterId: 17, pack: 'homerow', title: 'Lewa ręka',
    subtitle: 'asdf — cztery klucze', difficulty: 1, mode: 'normal',
    text: 'asdf fdsa asdf fdsa asd fds dsa fda sdf adf asdf fdsa asd sdf fda adf dsa asdf fdsa asdf fdsa asdf fdsa asd fds dsa fda sdf adf asdf',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 217, chapterId: 17, pack: 'homerow', title: 'Prawa ręka',
    subtitle: 'jkl — trzy klucze', difficulty: 1, mode: 'normal',
    text: 'jkl lkj jkl lkj jk kj kl lk jl lj jkl lkj jkl lkj jk lk kl jl jkl lkj kl lk jl jkl lkj jkl lkj jk kj kl lk jl lj jkl lkj jkl',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 218, chapterId: 17, pack: 'homerow', title: 'Pierwsze słowa',
    subtitle: 'tylko rząd domowy', difficulty: 1, mode: 'normal',
    text: 'las dal sad jak fal jad daj sal las jak fal dal sad daj sal jak las dal fal sad jak daj las dal sad jak fal jad daj sal las jak fal dal sad',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 219, chapterId: 17, pack: 'homerow', title: 'Klasa i skala',
    subtitle: 'dłuższe słowa z rzędu', difficulty: 1, mode: 'normal',
    text: 'klasa skala alfa slajd falka faks lada klasa skala alfa faks lada klasa skala alfa slajd klasa skala alfa slajd falka faks lada klasa skala alfa',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 220, chapterId: 17, pack: 'homerow', title: 'Zdanie z rzędu',
    subtitle: 'las dal jak fal', difficulty: 1, mode: 'normal',
    text: 'jak las dal fal jak las dal sad jak fal las dal jak las dal sad fal jak las dal jak fal jak las dal fal jak las dal sad jak fal las dal jak',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 221, chapterId: 17, pack: 'homerow', title: 'Pełny rząd',
    subtitle: 'asdfghjkl razem', difficulty: 1, mode: 'normal',
    text: 'asdfghjkl lkjhgfdsa jak las dal fal klasa skala alfa jak las fal sad jak klasa alfa las asdfghjkl lkjhgfdsa jak las dal fal klasa skala alfa',
    tags: ['podstawy', 'rząd-domowy'],
  },
  {
    id: 222, chapterId: 17, pack: 'homerow', title: 'Tylko rząd — czysto',
    subtitle: 'runda bez błędów', difficulty: 1, mode: 'normal',
    text: 'jak las dal fal klasa skala alfa slajd faks lada sad jak daj sal jak las dal alfa klasa jak las dal fal klasa skala alfa slajd faks lada sad',
    tags: ['podstawy', 'rząd-domowy'],
  },

  // ── Rozdział 18 · Nowe Klawisze ───────────────────────────────────────────────
  {
    id: 223, chapterId: 18, pack: 'homerow', title: 'E — pierwsza góra',
    subtitle: 'środkowy sięga w górę', difficulty: 1, mode: 'normal',
    text: 'jej lej jej lej dej jej lej jak jej lej jak las jej lej dej jak fal jej lej jej lej jak jej lej jej lej dej jej lej jak jej lej jak las jej',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 224, chapterId: 18, pack: 'homerow', title: 'I — prawa góra',
    subtitle: 'prawy pierścieniowy sięga', difficulty: 1, mode: 'normal',
    text: 'jaki dali sali ski jaki jak dali las jaki sali jak ski las jaki dali jak ski jaki dali jaki dali sali ski jaki jak dali las jaki sali jak',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 225, chapterId: 18, pack: 'homerow', title: 'R — lewa góra',
    subtitle: 'wskazujący sięga po r', difficulty: 1, mode: 'normal',
    text: 'rak raj dar rasa kar rak raj dar las rak raj dar jak rak raj dar rasa kar rak raj dar rak raj dar rasa kar rak raj dar las rak raj dar jak',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 226, chapterId: 18, pack: 'homerow', title: 'N — prawa dół',
    subtitle: 'wskazujący sięga w dół', difficulty: 1, mode: 'normal',
    text: 'nas nad na nas nad las jak na dal nas nad jak fal nas nad na las jak na nas nad nad na nas nad na nas nad las jak na dal nas nad jak fal nas',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 227, chapterId: 18, pack: 'homerow', title: 'O — prawa góra',
    subtitle: 'pierścieniowy sięga po o', difficulty: 2, mode: 'normal',
    text: 'do ok los sol kos dok kod do ok jak los sol do ok jak kos dok kod do ok los jak sol do do ok los sol kos dok kod do ok jak los sol do ok jak',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 228, chapterId: 18, pack: 'homerow', title: 'T — lewa góra',
    subtitle: 'wskazujący sięga po t', difficulty: 2, mode: 'normal',
    text: 'tak lat kat tak lat jak kat tak las tak lat jak fal tak lat kat jak las tak lat kat jak tak lat kat tak lat jak kat tak las tak lat jak fal',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 229, chapterId: 18, pack: 'homerow', title: 'W — sąsiad T',
    subtitle: 'kolejna lewa litera', difficulty: 2, mode: 'normal',
    text: 'was wal was wal jak was wal las was wal dal was wal fal was jak was wal las was wal jak was wal was wal jak was wal las was wal dal was wal',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 230, chapterId: 18, pack: 'homerow', title: 'Z — lewa dół',
    subtitle: 'dolny rząd zaczyna się', difficulty: 2, mode: 'normal',
    text: 'raz za zad zero raz za jak raz las za rak dar raz zero na los tak raz za zero raz jak raz za zad zero raz za jak raz las za rak dar raz zero',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 231, chapterId: 18, pack: 'homerow', title: 'C — prawa dół',
    subtitle: 'bo c jest wszędzie', difficulty: 2, mode: 'normal',
    text: 'co cal co cal jak co cal las co jak cal co jak cal las co jak cal jak las co cal jak co co cal co cal jak co cal las co jak cal co jak cal las',
    tags: ['podstawy', 'nowe-klawisze'],
  },
  {
    id: 232, chapterId: 18, pack: 'homerow', title: 'Pierwsze zdania',
    subtitle: 'łączę wszystkie poznane klawisze', difficulty: 2, mode: 'normal',
    text: 'tak on do jak las dal rak dar na los tak on jak las tak on do jak los dar na rak tak on tak on do jak las dal rak dar na los tak on jak las',
    tags: ['podstawy', 'nowe-klawisze'],
  },

  // ── Rozdział 1 · Pierwszy Rytm ────────────────────────────────────────────────
  {
    id: 1, chapterId: 1, pack: 'start', title: 'Pierwszy Rytm',
    subtitle: 'Zaczynam spokojnie.', difficulty: 1, mode: 'normal',
    text: 'Piszę spokojnie. Nie muszę się spieszyć. Każdy znak jest małym krokiem naprzód. Palce układają się naturalnie na rządzie domowym. Rytm zaczyna się tu, przy tej jednej chwili, nie gdzieś dalej. Oddycham równo i daję sobie czas. Nie gonię za wynikiem — jestem tu i teraz, zdanie po zdaniu, krok po kroku.',
    tags: ['start', 'spokój'],
  },
  {
    id: 2, chapterId: 1, pack: 'start', title: 'Bez Pośpiechu',
    difficulty: 1, mode: 'normal',
    text: 'Najpierw rytm, potem szybkość. Klawiatura nie ucieka. Palce wracają na swoje miejsce po każdym znaku. Nie walczę z tekstem — po prostu pozwalam mu płynąć spokojnie przez dłonie, zdanie po zdaniu. Każdy błąd to część drogi, nie powód do zatrzymania. Wracam do rytmu i zaczynam jeszcze raz, spokojnie i bez pośpiechu.',
  },
  {
    id: 3, chapterId: 1, pack: 'affirmations', title: 'Kocham Siebie',
    difficulty: 1, mode: 'normal',
    text: 'Kocham siebie. Szanuję siebie. Uczę się cierpliwie i każdego dnia robię kolejny krok. Nie muszę być gotowy na wszystko. Wystarczy, że zaczynam od jednego spokojnego zdania i wracam, gdy odejdę. Moje tempo jest moje. Nie porównuję się z nikim — każde ćwiczenie robię dla siebie, nie przeciw sobie.',
  },
  {
    id: 4, chapterId: 1, pack: 'affirmations', title: 'Szanuję Siebie',
    difficulty: 1, mode: 'normal',
    text: 'Szanuję siebie. Mój wysiłek ma znaczenie, nawet jeśli dziś idę wolniej niż wczoraj. Nie muszę być idealny, żeby robić postęp. Wystarczy, że wracam do ćwiczenia i nie uciekam od własnego rytmu. Każda sesja buduje coś trwałego. Nie widzę efektów od razu — ale wiem, że są. Wracam i próbuję jeszcze raz.',
  },
  {
    id: 5, chapterId: 1, pack: 'motivation', title: 'Dajesz Radę',
    difficulty: 1, mode: 'normal',
    text: 'Dajesz radę. Nawet mały postęp jest postępem. Każde naciśnięcie klawisza coś znaczy, nawet jeśli tego teraz nie czujesz. Dziś robisz coś dobrego dla siebie i dla swojego rytmu. Nie musisz być najlepszy — musisz być tutaj. Jedna runda spokojnie to więcej niż zero rund idealnie — zapamiętaj to i wróć jutro z tą samą cierpliwością.',
  },
  {
    id: 6, chapterId: 1, pack: 'motivation', title: 'Nigdy Nie Było Lepiej',
    difficulty: 1, mode: 'normal',
    text: 'Nigdy nie było lepiej. Teraz widzę postęp, którego wcześniej nie potrafiłem zauważyć. Uczę się spokojnie i to naprawdę wystarczy. Nie ścigam się z nikim — ani z wynikiem, ani z czasem. Każde spokojne ćwiczenie buduje coś trwałego w rękach i w głowie. Wracam do klawiatury z lekką głową i otwartą, rozluźnioną dłonią.',
  },
  {
    id: 7, chapterId: 1, pack: 'start', title: 'Powrót Palców',
    difficulty: 1, mode: 'normal',
    text: 'Palce wracają na rząd domowy. To jest mój punkt spokoju. Stąd zaczynam i tu wracam po każdym błędzie, po każdej przerwie. Rząd domowy zawsze czeka — zawsze jest na swoim miejscu. Nie muszę się spieszyć. Nie ma powodu, żeby gnać do kolejnego zdania. Zaczynam od tu, od teraz.',
  },
  {
    id: 8, chapterId: 1, pack: 'mindfulness', title: 'Spokojny Oddech',
    difficulty: 1, mode: 'normal',
    text: 'Oddycham spokojnie. Piszę wolniej. Gdy zwalniam, widzę więcej i popełniam mniej błędów. Spokój to nie słabość — to umiejętność. Piszę jedno zdanie naraz i nie skaczę myślami do kolejnego. Nie patrzę na wynik — patrzę tylko na teraźniejszy znak tuż przede mną. Jeden znak. Jeden gest.',
  },
  {
    id: 9, chapterId: 1, pack: 'motivation', title: 'Małe Kroki',
    difficulty: 1, mode: 'normal',
    text: 'Małe kroki budują dużą zmianę. Jedna runda dzisiaj może być początkiem nowego nawyku. Nie muszę pisać szybko, żeby pisać dobrze. Rytm buduje się powoli i pewnie, jak fundament pod stopami. Każda sesja to cegiełka — niewidoczna z bliska, ale niezbędna w całości. Wracam tu regularnie i pozwalam, żeby postęp przychodził sam.',
  },
  {
    id: 10, chapterId: 1, pack: 'start', title: 'Czysty Przebieg',
    difficulty: 1, mode: 'noBackspace',
    text: 'Nie poprawiam. Jadę dalej. Błąd jest śladem nauki, a nie wyrokiem. Każde zdanie do końca, bez cofania, bez paniki. Spokojnie prowadzę dłoń przez tekst i nie oglądam się za siebie. Pomyłka zostaje za mną — liczy się to, co przede mną. Przepływ jest ważniejszy niż perfekcja, a palce uczą się przez ruch, nie przez zatrzymanie.',
    minAccuracy: 80,
  },
  {
    id: 11, chapterId: 1, pack: 'polishSigns', title: 'Pierwsze Ogonki',
    difficulty: 2, mode: 'hardSigns',
    text: 'Polskie znaki wymagają spokojnej ręki i skupionej uwagi. ą ę ć ł ń ó ś ź ż — każdy z nich ma swoje miejsce na klawiaturze. Nie walczę z nimi siłą, tylko uczę się, gdzie leżą. Powoli, znak po znaku, aż palec trafia bez wahania. Cierpliwość jest tu ważniejsza niż szybkość. Mięśnie zapamiętają każdą ścieżkę, jeśli tylko dam im czas. Dziś mogę się zatrzymać — jutro palec już będzie wiedział sam.',
  },
  {
    id: 12, chapterId: 1, pack: 'polishSigns', title: 'Łagodne Znaki',
    difficulty: 2, mode: 'hardSigns',
    text: 'Zażółć gęślą jaźń. To zdanie zawiera wszystkie najtrudniejsze polskie znaki. Piszę je powoli, dbając o każdy ogonek: ź, ó, ę, ś, ą, ż. Gdy nabiorę rytmu, znaki wracają na swoje miejsce same, jakby palec je pamiętał od zawsze. Nie spieszę się — każde powtórzenie to krok głębiej w pamięć mięśniową. Zdanie, które kiedyś było wyzwaniem, staje się z czasem naturalnym odruchem.',
  },
  {
    id: 13, chapterId: 1, pack: 'relationships', title: 'Dobrze, Że Jesteś',
    difficulty: 1, mode: 'normal',
    text: 'Dobrze, że jesteś. Twoja obecność ma znaczenie, nawet wtedy, gdy dzień jest cichy i nic szczególnego się nie dzieje. Nie musisz robić czegoś wielkiego, żeby być ważnym. Czasem wystarczy, że siedzisz obok i słuchasz. Takie chwile zostają najdłużej. Twój spokój, twoje słowa, twój uśmiech — to więcej, niż myślisz. Ktoś zapamiętuje ciebie właśnie takim. Bycie tu, w pełni obecnym, to jeden z największych darów, jaki możesz dać.',
  },
  {
    id: 14, chapterId: 1, pack: 'relationships', title: 'Jesteś Ważny',
    difficulty: 1, mode: 'normal',
    text: 'Jesteś ważny. Nie dlatego, że wszystko robisz idealnie, ale dlatego, że jesteś sobą. Twój rytm, twoje tempo, twoje błędy — to wszystko należy do ciebie. Nie musisz ścigać się z nikim. Masz prawo iść swoją drogą i robić postęp po swojemu. Inni mogą mieć inne tempo — i to jest w porządku. Twoja droga ma sens, nawet jeśli nie wiesz jeszcze, dokąd prowadzi. Zaufaj temu, co budujesz krok po kroku.',
  },
  {
    id: 15, chapterId: 1, pack: 'spirituality', title: 'Jezus Cię Kocha',
    difficulty: 1, mode: 'normal',
    text: 'Jezus Cię kocha. Nie jesteś sam, nawet w chwilach, które wydają się puste i bez znaczenia. W tej ciszy też może być obecność i pokój głębszy niż słowa. Nie musisz mieć wszystkiego poukładanego, żeby czuć tę bliskość i spokój. Możesz przyjść taki, jaki jesteś — z pytaniami, ze zmęczeniem, ze zwątpieniem. Ta miłość nie zależy od tego, jak bardzo masz wszystko razem. Ona jest po prostu tutaj.',
  },
  {
    id: 16, chapterId: 1, pack: 'visualization', title: 'Widzę Siebie',
    difficulty: 2, mode: 'normal',
    text: 'Widzę siebie spokojnego, silnego i skupionego. Zachowuję się tak, jakby to już było prawdą — bo właśnie to buduję. Moje dłonie poruszają się pewnie. Mój oddech jest równy. Mój umysł jest tu, przy klawiaturze, przy tym zdaniu, przy tej jednej chwili. Każde powtórzenie przybliża mnie do tej wersji siebie. Nie spieszę się — jestem dokładny. Skupienie to nie napięcie, to spokojne bycie z tym, co jest teraz.',
  },
  {
    id: 17, chapterId: 1, pack: 'visualization', title: 'To Już Dojrzewa',
    difficulty: 2, mode: 'normal',
    text: 'Mój cel już dojrzewa pod powierzchnią. Każde działanie jest znakiem, że jestem bliżej życia, którego pragnę. Nie muszę tego widzieć od razu — postęp rzadko jest widoczny na co dzień. Nasiona rosną pod ziemią długo, zanim pojawi się kiełek. Tak samo moje umiejętności dojrzewają w ciszy, zanim w pełni staną się widoczne. Wystarczy, że pracuję spokojnie, krok po kroku, i ufam procesowi. Każda sesja to małe zasilenie korzeni.',
  },
  {
    id: 18, chapterId: 1, pack: 'mindfulness', title: 'Mniej Kontroli',
    difficulty: 2, mode: 'normal',
    text: 'Nie muszę kontrolować każdego znaku z osobna. Uczę się ufać dłoniom, rytmowi i spokojnej uwadze. Napięcie tylko spowalnia — gdy luzuję chwyt i pozwalam dłoniom działać swobodnie, tekst płynie łatwiej niż wtedy, gdy się napinam. Kontrola i zaufanie mogą iść razem — najpierw uwaga, potem swoboda. To nie są sprzeczności, lecz dwa etapy jednego przepływu.',
  },
  {
    id: 19, chapterId: 1, pack: 'motivation', title: 'Najlepszy Moment',
    difficulty: 2, mode: 'normal',
    text: 'Najlepszy moment na start nie zawsze wygląda wielko i wyjątkowo. Często nie zapowiada się niczym szczególnym. Czasem zaczyna się od jednej spokojnej rundy bez presji i oczekiwań — bez potrzeby bycia doskonałym od pierwszego znaku. Nie czekam na idealne warunki, bo nigdy nie są w pełni gotowe. Siadam, piszę i pozwalam, żeby było jak jest. Obecność jest ważniejsza od gotowości. To jest właśnie ten moment.',
  },
  {
    id: 20, chapterId: 1, pack: 'start', title: 'Bez Paniki',
    difficulty: 2, mode: 'noBackspace',
    text: 'Gdy pojawia się błąd, nie panikuję. Zatrzymanie kosztuje więcej niż samo potknięcie. Piszę dalej, zdanie za zdaniem, do samego końca. Spokój jest ważniejszy niż szybka poprawka — pogoń za błędem tylko rozbija rytm. Uczę się prowadzić dłoń przez tekst nawet wtedy, gdy nie wszystko wychodzi tak, jak planowałem. Błąd to część nauki, nie jej przeciwieństwo.',
  },

  // ── Rozdział 2 · Płynność ────────────────────────────────────────────────────
  {
    id: 21, chapterId: 2, pack: 'motivation', title: 'Stabilny Progres',
    difficulty: 2, mode: 'normal',
    text: 'Progres nie musi krzyczeć o sobie. Czasem jest cichy, powtarzalny i właśnie dlatego prawdziwy. Nie szukam wielkich skoków naprzód — wolę stabilny rytm, który prowadzi mnie dalej każdego dnia. Każda sesja, nawet krótka, zostawia w mnie coś trwałego. Drobne wyniki sumują się w coś realnego, jeśli nie przestanę wracać. Regularność jest moją siłą — nie spektakl ani pośpiech, lecz wierność małym krokom, które dzień po dniu budują coś, z czego mogę być spokojnie dumny.',
  },
  {
    id: 22, chapterId: 2, pack: 'affirmations', title: 'Ufam Sobie',
    difficulty: 2, mode: 'normal',
    text: 'Ufam sobie. Moje tempo jest wystarczające. Nie muszę nikomu udowadniać własnej wartości, bo ona nie zależy od wyników ani od szybkości. Każdy błąd, który popełniam, należy do procesu — nie jest powodem do wstydu, lecz częścią drogi. Uczę się pisać spokojnie, myśleć spokojnie, żyć spokojnie. Zaufanie do siebie to cicha pewność, że dam radę — nawet wtedy, gdy idzie trudniej niż zwykle.',
  },
  {
    id: 23, chapterId: 2, pack: 'affirmations', title: 'Wybieram Spokój',
    difficulty: 2, mode: 'normal',
    text: 'Wybieram spokój. Wybieram uwagę i cierpliwość wobec siebie i własnego procesu uczenia się. Nie zawsze wszystko wychodzi za pierwszym razem — i to jest w pełnym porządku. Mogę zacząć jeszcze raz, tyle razy ile trzeba, bez gniewu i bez oceniania. Spokój nie jest nagrodą za sukces. Spokój jest postawą, którą wybieram niezależnie od wyniku — ponieważ naprawdę wierzę, że właśnie tak wygląda nauka na swoich warunkach.',
  },
  {
    id: 24, chapterId: 2, pack: 'mindfulness', title: 'Rytm Dłoni',
    difficulty: 2, mode: 'normal',
    text: 'Dłonie odnajdują rytm, gdy przestaję im przeszkadzać swoją niecierpliwością. Gdy wracam do podstaw, wszystko staje się prostsze i wyraźniejsze. Nie muszę kontrolować każdego ruchu z osobna — wystarczy, że jestem w pełni obecny. Każdy palec wie, gdzie iść, jeśli mu na to pozwolę. Klawiatura staje się miejscem uważności — jeden znak, jedna chwila, jeden oddech. W tej prostocie kryje się coś, czego szukam.',
  },
  {
    id: 25, chapterId: 2, pack: 'blindFlow', title: 'Pamięć Zdania',
    difficulty: 2, mode: 'blindFlow',
    text: 'Najpierw słucham uważnie. Potem piszę z pamięci, nie z oczu. Nie walczę z tekstem — pozwalam mu wrócić stamtąd, gdzie się zatrzymał. Obraz zdania zostaje chwilę po tym, jak znika z ekranu. Ufam temu, co zapamiętałem, i prowadzę palce dalej. Skupienie nie jest wysiłkiem — to cicha przestrzeń, w której słowa same wracają na swoje miejsca. Słuch i pamięć pracują razem, a palce podążają za nimi spokojnie. Im mniej szukam, tym łatwiej je odnajduję.',
  },
  {
    id: 26, chapterId: 2, pack: 'motivation', title: 'Jestem Coraz Lepszy',
    difficulty: 2, mode: 'normal',
    text: 'Jestem coraz lepszy. Nie dlatego, że nie robię błędów, ale dlatego, że za każdym razem wracam do ćwiczenia. Powtarzalność jest silniejsza niż talent. Każda runda buduje nawyk, każdy nawyk buduje umiejętność, każda umiejętność buduje spokojną pewność. Błąd to nie cofnięcie — to wskazówka. Zatrzymuję się na chwilę, poprawiam i idę dalej. Tak właśnie wygląda prawdziwy postęp: cierpliwy, konsekwentny, coraz pewniejszy siebie.',
  },
  {
    id: 27, chapterId: 2, pack: 'polishSigns', title: 'Ć, Ś i Ź',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ćwiczę śmiało, bo źródło spokoju jest bliżej, niż myślę. Trzy najtrudniejsze dla mnie znaki to ć, ś i ź. Każdy z nich wymaga skupienia, ale staje się łatwiejszy z każdym powtórzeniem. Nie spieszę się. Daję sobie czas na każdy ogonek, bo czas tu naprawdę działa. Ogonki i kreski nie są przeszkodą — są częścią języka, który piszę. Uczę się ich z ciekawością, nie z lękiem. Z każdą serią znaki przestają być trudne i stają się znajome.',
  },
  {
    id: 28, chapterId: 2, pack: 'polishSigns', title: 'Ł i Ż',
    difficulty: 3, mode: 'hardSigns',
    text: 'Łagodność i żar mogą iść razem. Piszę dokładnie, ale nie napinam dłoni przy znakach ł i ż. Każde łagodne uderzenie jest skuteczniejsze niż napięty gest. Żar w uczeniu się nie musi oznaczać siły — może być cichą konsekwencją, która przynosi efekty. Skupiam się na jakości każdego uderzenia, nie na jego sile. Kiedy dłoń jest wolna od napięcia, palce poruszają się swobodniej i celniej. Łagodność to nie brak zaangażowania — to jego dojrzała forma.',
  },
  {
    id: 29, chapterId: 2, pack: 'relationships', title: 'Twoja Obecność',
    difficulty: 2, mode: 'normal',
    text: 'Twoja obecność ma znaczenie. Czasem jedno dobre słowo zostaje w człowieku na długo, dłużej niż wielkie gesty i głośne deklaracje. Nie musisz być wszędzie i dla wszystkich — nikt z nas nie może temu sprostać. Wystarczy, że jesteś naprawdę tam, gdzie jesteś — obecny, uważny, otwarty. Pełna uwaga to rzadki dar. Kiedy kogoś słuchasz bez rozproszenia, widzisz go naprawdę. I to właśnie zostaje.',
  },
  {
    id: 30, chapterId: 2, pack: 'spirituality', title: 'Pokój w Ciszy',
    difficulty: 2, mode: 'normal',
    text: 'W ciszy odnajduję pokój. Nie wszystko musi być rozwiązane od razu i nie wszystko musi być teraz wyjaśnione. Cisza nie jest pustką — jest przestrzenią, w której można usłyszeć to, co naprawdę ważne. Uczę się być spokojny nawet gdy pytania wiszą bez odpowiedzi. Nie każdy niepokój potrzebuje słów — czasem wystarczy pozwolić mu być. W ciszy jest mądrość, której nie da się zrozumieć przez działanie.',
  },
  {
    id: 31, chapterId: 2, pack: 'visualization', title: 'Żyję Jak Spełniony',
    difficulty: 3, mode: 'normal',
    text: 'Zachowuję się tak, jakby moje dobre życie już było faktem. Myśl, emocja i działanie idą razem, kiedy naprawdę w to wierzę. Nie udaję, że wszystko jest idealne — ćwiczę postawę człowieka, który wie, dokąd zmierza. To zmienia sposób, w jaki siadam każdego dnia. Zaczyna się od drobnych decyzji: jak wstaję, jak oddycham, jak reaguję na trudność. Ciało uczy się razem z umysłem. Postawa to praktyka, nie performance.',
  },
  {
    id: 32, chapterId: 2, pack: 'visualization', title: 'Wdzięczność Teraz',
    difficulty: 3, mode: 'normal',
    text: 'Czuję wdzięczność teraz, nie dopiero po wszystkim. To zmienia sposób, w jaki idę przez dzień. Kiedy szukam tego, za co mogę być wdzięczny, zawsze coś znajduję — ciepłą herbatę, spokojny wieczór, chwilę przy klawiaturze bez presji. Małe rzeczy budują dobre życie. Wdzięczność nie jest reakcją na idealne warunki — to decyzja podjęta zanim zacznę liczyć braki. Każdy dzień ma coś wartego uwagi. Wybieram je zauważać.',
  },
  {
    id: 33, chapterId: 2, pack: 'stories', title: 'Kartka od Mamy',
    difficulty: 3, mode: 'normal',
    text: 'Wróciłem późno do domu. Na stole czekała kartka od mamy i garnek zupy, który wciąż był ciepły. Nie napisała wiele, tylko kilka słów — ale wiedziałem, że myślała o mnie cały dzień. Zjadłem zupę w ciszy, patrząc przez okno na ciemną ulicę. Ciepło było nie tylko w garnku — było w samym geście, w tym, że ktoś pomyślał, żebym nie wracał do zimnego domu i pustego talerza. Czasem miłość nie robi hałasu. Wyraża się w jedzeniu zostawionym na kuchence.',
  },
  {
    id: 34, chapterId: 2, pack: 'stories', title: 'Cichy Pokój',
    difficulty: 3, mode: 'normal',
    text: 'Pokój był cichy, ale nie pusty. Przez okno wpadało słabe zimowe słońce i rozgrzewało kawałek podłogi przy biurku. Było w tym coś spokojnego — ta codzienność, znajomość każdego kąta i każdego cienia. Usiadłem, otworzyłem klawiaturę i poczułem, że mam gdzie wrócić po długim dniu. Palce same wiedziały, gdzie trafić. W takich chwilach człowiek wie, że ma swoje miejsce — i że to miejsce na niego czeka.',
  },
  {
    id: 35, chapterId: 2, pack: 'noBackspace', title: 'Nie Poprawiam',
    difficulty: 3, mode: 'noBackspace',
    text: 'Nie poprawiam natychmiast. Uczę się płynąć dalej, nawet gdy pojawi się nierówność w środku zdania. Zatrzymanie kosztuje więcej niż błąd — rozbija rytm i urywa myśl. Każdy błąd zostaje za mną, ale kierunek pozostaje z przodu. Nie oglądam się wstecz, nie cofam kursora. Jadę do końca, zdanie po zdaniu, aż dotrę na miejsce. Dopiero wtedy oceniam spokojnie, co poszło nie tak i co poprawię następnym razem.',
  },
  {
    id: 36, chapterId: 2, pack: 'blindFlow', title: 'Z Pamięci',
    difficulty: 3, mode: 'blindFlow',
    text: 'Piszę z pamięci. Nie widzę całego tekstu naraz, ale widzę kierunek. Zdanie układa się w głowie zanim trafi na ekran, słowo po słowie, kawałek po kawałku. To inny rodzaj uwagi — nie szukam liter oczami, lecz słucham tego, co mówi myśl. Uczę się pisać z obrazem w umyśle, nie z oczami wbitymi w klawisze. Obraz wystarczy. Ruch wystarczy. Im bardziej ufam temu, co zapamiętałem, tym swobodniej i pewniej piszę.',
  },
  {
    id: 37, chapterId: 2, pack: 'motivation', title: 'Mniej Siły',
    difficulty: 2, mode: 'normal',
    text: 'Mniej siły, więcej rytmu. Klawiatura nie wymaga uderzeń, tylko spokojnej obecności. Gdy przestaję napinać dłonie, tekst płynie inaczej — lżej, pewniej, naturalnie. Siła to nie wartość przy klawiaturze. Wartością jest kontakt: lekki, skupiony i cierpliwy. Napięcie w palcach to sygnał — przypomnienie, żeby zwolnić i wrócić do spokoju. Im bardziej rozluźniam ręce, tym pewniejszy staje się rytm. Pisanie zaczyna wtedy przepływać samo — bez wysiłku, bez oporu.',
  },
  {
    id: 38, chapterId: 2, pack: 'mindfulness', title: 'Lekki Dotyk',
    difficulty: 2, mode: 'normal',
    text: 'Dotykam klawiszy lekko i pewnie. Nie muszę walczyć z tekstem ani wymuszać każdego znaku. Wystarczy spokojny, świadomy ruch. Uważność przy pisaniu zaczyna się od dłoni — od tego, jak trzymam rękę, jak trafia palec, jak kończę zdanie. Cisza też jest częścią rytmu. Każda przerwa między słowami to przestrzeń, w której zbierają się myśl i gest. Nie spieszę się. Pozwalam, żeby kolejne znaki pojawiały się we właściwym momencie — spokojnie, jeden po drugim.',
  },
  {
    id: 39, chapterId: 2, pack: 'affirmations', title: 'Zasługuję na Dobro',
    difficulty: 2, mode: 'normal',
    text: 'Zasługuję na dobro. Zasługuję na spokój i na warunki, które mnie wspierają. Mogę budować życie bez ciągłej walki i bez udowadniania czegokolwiek. Moje potrzeby mają znaczenie. Mogę je wyrażać bez wstydu i dbać o nie każdego dnia bez poczucia winy. To nie jest egoizm — to fundament. Troszcząc się o siebie, mam więcej do dania innym. Granice są wyrazem szacunku do siebie — i do innych.',
  },
  {
    id: 40, chapterId: 2, pack: 'motivation', title: 'Dziś Wystarczy',
    difficulty: 2, mode: 'normal',
    text: 'Dziś wystarczy jedna dobra runda. Nie muszę robić wszystkiego naraz, bo to nie wyścig — to trening. Każde ćwiczenie jest krokiem, który sumuje się w wynik. Mały postęp każdego dnia jest bardziej trwały niż wielki wysiłek raz na miesiąc. Ciało i umysł uczą się powoli, ale pewnie. Regularność buduje więcej niż intensywność. Dziś zrobiłem swoje — i to wystarczy. Wrócę jutro.',
  },

  // ── Rozdział 3 · Polskie Znaki ───────────────────────────────────────────────
  {
    id: 41, chapterId: 3, pack: 'polishSigns', title: 'Zażółć',
    difficulty: 3, mode: 'hardSigns',
    text: 'Zażółć gęślą jaźń — zdanie, które testuje każdy znak diakrytyczny w polskim alfabecie. Piszę je spokojnie, dbając o ż, ó, ę, ą, ź, ń. Potem ćwiczę je jeszcze raz, tym razem nieco śmielej. Każde powtórzenie wbija znak głębiej w pamięć palca, aż staje się naturalny. To zdanie to mała podróż przez polską fonetykę. Palce uczą się rytmu i odległości między klawiszami. Z każdą iteracją ruch staje się pewniejszy — i coraz bardziej własny.',
  },
  {
    id: 42, chapterId: 3, pack: 'polishSigns', title: 'Ścieżka Znaków',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ścieżka przez łąkę była wąska, ale prowadziła dokładnie tam, gdzie trzeba. Szłam nią powoli, uważając na korzenie i mokrą trawę. Żaden pośpiech nie był tu potrzebny — wystarczyło podążać dalej. Polskie znaki są jak ta ścieżka: spokojne i zawsze na swoim miejscu. Ą, ę, ź, ż — każdy z nich ma swój krok, swój moment. Nie trzeba ich szukać na klawiaturze, jeśli ręce już wiedzą. Wystarczy zaufać palcom i iść naprzód.',
  },
  {
    id: 43, chapterId: 3, pack: 'polishSigns', title: 'Źródło',
    difficulty: 3, mode: 'hardSigns',
    text: 'Źródło cierpliwości jest bliżej, niż sądzę. Każde ćwiczenie otwiera kolejny mały próg, a za nim jest więcej przestrzeni i spokoju. Nie spieszę się do następnego poziomu. Ważniejsze jest, żeby ten obecny był naprawdę mój — żebym czuł znaki, a nie tylko klikał. Cierpliwość nie jest stratą czasu. To właśnie w niej rosną nawyki, które zostają na długo. Ź, ń, ó — każdy znak wymaga swojej chwili uwagi. Dam mu tę chwilę.',
  },
  {
    id: 44, chapterId: 3, pack: 'polishSigns', title: 'Łąka i Dzień',
    difficulty: 3, mode: 'hardSigns',
    text: 'Łąka pachniała deszczem, a dzień płynął wolniej niż zwykle. Ćwiczyłem przy otwartym oknie, słysząc szum liści i odgłosy miasta. To był dobry znak — spokój na zewnątrz pomagał skupić się w środku. Łąka, deszcz, ł, ą, ę — wszystko tworzyło jeden spokojny rytm. Takie chwile uczą mnie, że pisanie nie musi być walką z klawiaturą. Może być jak oddech — regularny, lekki, niezauważalny. Kiedy znaki przestają być przeszkodą, zostaje tylko słowo.',
  },
  {
    id: 45, chapterId: 3, pack: 'polishSigns', title: 'Żółty Liść',
    difficulty: 3, mode: 'hardSigns',
    text: 'Żółty liść opadł cicho na ziemię. Nikt go nie poganiał, więc zrobił to w swoim czasie i po swojemu. Nie spieszył się — bo spieszenie nic by nie dało. Ziemia i tak go przyjmie. Tak samo jest z nauką polskich znaków — żaden pośpiech nie zastąpi spokojnego, cierpliwego powtarzania. ż, ó, ł — każdy z nich wymaga czasu i uwagi. Wracam do nich bez pośpiechu, raz za razem. Daj im ten czas, a zapamiętasz je dobrze.',
  },
  {
    id: 46, chapterId: 3, pack: 'polishSigns', title: 'Cisza i Ćwiczenie',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ćwiczenie w ciszy uczy więcej niż ćwiczenie w pośpiechu i pod presją. Spokojna dłoń pamięta znaki lepiej, bo nie walczy z napięciem ani rozproszeniem. Wyłączam muzykę, zamykam inne karty i siadam z pełną uwagą przy klawiaturze. Biorę oddech, zanim zacznę. ć, ś, ź — te znaki wymagają skupienia, a cisza jest tym skupieniem. Kiedy otoczenie milczy, każdy znak staje się wyraźniejszy. Cisza jest moim najlepszym nauczycielem.',
  },
  {
    id: 47, chapterId: 3, pack: 'polishSigns', title: 'Niech Płynie',
    difficulty: 3, mode: 'hardSigns',
    text: 'Niech tekst płynie bez szarpania i zatrzymywania. Niech palce znajdą drogę przez każdy ogonek — ą, ę, ć, ł, ń, ó, ś, ź, ż. Nie cofam się po każdym znaku, nie poprawiam na bieżąco. Piszę bez oceniania się za każdy błąd, bez przerywania rytmu. Płynność jest celem, a doskonałość przychodzi po niej, nie przed nią. Ruch i rytm budują pamięć mięśniową. Najpierw ruch i rytm, potem precyzja i pewność.',
  },
  {
    id: 48, chapterId: 3, pack: 'polishSigns', title: 'Małe Zwycięstwo',
    difficulty: 3, mode: 'hardSigns',
    text: 'Każde poprawne ą, ę, ć, ł, ń, ó, ś, ź i ż to małe zwycięstwo nad starym nawykiem. Nie muszę trafiać wszystkich od razu — z każdym powtórzeniem trafia ich więcej i przychodzą coraz naturalniej. Błędy są częścią drogi, nie powodem do frustracji. Mój palec uczy się, mój mózg zapamiętuje, moja dłoń nabiera spokojnej pewności z sesji na sesję. Umiejętność rośnie przez setki małych kroków, nie przez jeden skok. Tak właśnie rośnie prawdziwa umiejętność.',
  },
  {
    id: 49, chapterId: 3, pack: 'noBackspace', title: 'Bez Cofania',
    difficulty: 3, mode: 'noBackspace',
    text: 'Bez cofania widzę prawdę o własnym rytmie. Nie ukrywam błędów pod warstwą szybkich poprawek — zostają jako ślad nauki, jako dowód, że byłem tu i próbowałem. Płynę do końca tekstu, nie zatrzymując się na każdym potknięciu. Obserwuję co wyszło i wracam z lepszym zamiarem, nie z frustracją. Błąd to nie klęska — to informacja. Każda runda bez cofania uczy mnie więcej o sobie niż dziesięć z poprawkami. Uczę się widzieć wzorzec, nie tylko chwilę.',
  },
  {
    id: 50, chapterId: 3, pack: 'blindFlow', title: 'Ślepy Strumień',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ślepy strumień płynie inaczej niż ten, który widzę. Nie widzę każdego kamienia pod wodą, ale czuję kierunek — i to wystarcza. Uczę się pisać z obrazem w umyśle, nie z oczami przykutymi do ekranu. Tekst znika, litery przestają być celem, a palce przejmują prowadzenie. Nie kontroluję każdego ruchu — ufam temu, co wyćwiczyłem. Kiedy rytm jest prawdziwy, nie potrzebuję patrzeć. Wystarczy słuchać dłoni.',
  },

  // ── Rozdział 4 · Nowy Rytm ───────────────────────────────────────────────────
  {
    id: 51, chapterId: 4, pack: 'start', title: 'Nie Muszę Się Spieszyć',
    difficulty: 1, mode: 'normal',
    text: 'Nie muszę się spieszyć, żeby iść do przodu. Każdy spokojny ruch ma znaczenie — nawet ten najcichszy. Tempo nie decyduje o wartości pracy. Palce wracają na swoje miejsce z własnej woli, a ja wracam do siebie. W spokoju jest siła, której pośpiech nie zna.',
  },
  {
    id: 52, chapterId: 4, pack: 'start', title: 'Pierwszy Rytm',
    difficulty: 1, mode: 'normal',
    text: 'Najpierw rytm, potem szybkość — tej kolejności nie warto odwracać. Klawiatura nie jest przeciwnikiem ani przeszkodą. Jest mostem między myślą a światem. Buduję go spokojnie, krok po kroku.',
  },
  {
    id: 53, chapterId: 4, pack: 'motivation', title: 'Dobra Runda',
    difficulty: 1, mode: 'normal',
    text: 'To była runda. Nie wyrok. Jeśli popełniłem błąd, mam informację. Jeśli pisałem spokojnie, mam zwycięstwo. Nie ma złych rund. Każda jest krokiem do przodu, nawet gdy tego nie czuję.',
  },
  {
    id: 54, chapterId: 4, pack: 'affirmations', title: 'Kocham Siebie',
    difficulty: 1, mode: 'normal',
    text: 'Kocham siebie nie dlatego, że jestem idealny. Kocham siebie dlatego, że wracam, próbuję i uczę się być po swojej stronie. To miłość, która rośnie w każdym powrocie, nie w każdym sukcesie.',
  },
  {
    id: 55, chapterId: 4, pack: 'affirmations', title: 'Szanuję Siebie',
    difficulty: 1, mode: 'normal',
    text: 'Szanuję siebie. Mój wysiłek ma znaczenie. Nie muszę zasługiwać na spokój perfekcją. Mogę zacząć od jednego dobrego oddechu. Spokój jest mój z prawa, nie z zasługi. Dziś wystarczy, że tu jestem.',
  },
  {
    id: 56, chapterId: 4, pack: 'motivation', title: 'Dajesz Radę',
    difficulty: 1, mode: 'normal',
    text: 'Dajesz radę. Nawet jeśli dzisiaj idzie wolniej, nadal idzie. Postęp czasem wygląda jak ciche wrócenie do ćwiczenia. Nie każdy dzień musi błyszczeć. Wytrwałość jest cicha, ale prawdziwa.',
  },
  {
    id: 57, chapterId: 4, pack: 'mindfulness', title: 'Nie Ma Paniki',
    difficulty: 1, mode: 'normal',
    text: 'Błąd nie jest alarmem. Błąd jest śladem. Mogę go zobaczyć, odetchnąć i pisać dalej bez robienia z klawiatury miejsca katastrofy. Każda literówka mówi mi coś — o tempie, o napięciu. Słucham i idę dalej.',
  },
  {
    id: 58, chapterId: 4, pack: 'motivation', title: 'Małe Kroki',
    difficulty: 1, mode: 'normal',
    text: 'Małe kroki budują dużą zmianę. Jedna spokojna runda dzisiaj może być początkiem nawyku, który jutro będzie pracował za mnie. Nie muszę robić wszystkiego naraz — wystarczy, że zacznę i wrócę jutro.',
  },
  {
    id: 59, chapterId: 4, pack: 'start', title: 'Wróć Do Rzędu',
    difficulty: 1, mode: 'normal',
    text: 'Palce wracają na rząd domowy. To nie jest kara, tylko baza. Z tej bazy mogę ruszyć w każdą stronę i nie zgubić siebie. Baza daje pewność, a pewność pozwala mi działać bez zastanowienia.',
  },
  {
    id: 60, chapterId: 4, pack: 'mindfulness', title: 'Oddycham',
    difficulty: 1, mode: 'normal',
    text: 'Oddycham spokojnie. Piszę wolniej. Gdy zwalniam, widzę więcej. Gdy widzę więcej, mniej walczę ze sobą. W tym spokoju jest więcej siły niż w najszybszym tempie.',
  },
  {
    id: 61, chapterId: 4, pack: 'affirmations', title: 'Nie Muszę Udowadniać',
    difficulty: 1, mode: 'normal',
    text: 'Nie muszę nikomu udowadniać własnej wartości. Mogę ćwiczyć po cichu, bez teatru, bez presji i bez publicznego pojedynku z Enterem. Moje tempo jest moje. Nikt nie musi tego potwierdzać, żeby było prawdziwe.',
  },
  {
    id: 62, chapterId: 4, pack: 'motivation', title: 'Dzisiaj Wystarczy',
    difficulty: 1, mode: 'normal',
    text: 'Dzisiaj wystarczy jedna dobra runda. Nie wszystko naraz. Nie wojnę, tylko trening. Nie panika, tylko powrót. Jeden spokojny krok do przodu — i to już wystarczy na dzisiaj.',
  },
  {
    id: 63, chapterId: 4, pack: 'affirmations', title: 'Jestem Po Swojej Stronie',
    difficulty: 1, mode: 'normal',
    text: 'Jestem po swojej stronie. Nawet kiedy coś mi nie wychodzi, nie muszę się opuszczać. Mogę poprawić kierunek bez bicia siebie kijem. Każda pomyłka to dane, nie wyrok. Wracam i próbuję spokojniej niż ostatnio.',
  },
  {
    id: 64, chapterId: 4, pack: 'motivation', title: 'Cichy Progres',
    difficulty: 1, mode: 'normal',
    text: 'Progres nie zawsze krzyczy. Czasem siedzi cicho, robi swoje i po miesiącu wygląda jak cud, choć był tylko sumą małych powrotów. Nie widać go każdego dnia. Ale on tam jest i pracuje cicho za kulisami.',
  },
  {
    id: 65, chapterId: 4, pack: 'mindfulness', title: 'Spokojna Dłoń',
    difficulty: 1, mode: 'normal',
    text: 'Spokojna dłoń pamięta więcej niż spięta głowa. Napięcie nie przyspiesza nauki — ją blokuje. Nie muszę naciskać mocniej. Wystarczy, że będę obecny i pozwolę ruchom płynąć.',
  },

  // ── Rozdział 5 · Głębszy Rytm ────────────────────────────────────────────────
  {
    id: 66, chapterId: 5, pack: 'motivation', title: 'Nigdy Nie Było Lepiej',
    difficulty: 2, mode: 'normal',
    text: 'Nigdy nie było lepiej, bo teraz widzę rzeczy, których wcześniej nie umiałem zobaczyć. Każdy błąd to nowe okno na zrozumienie. Nawet chaos może stać się materiałem do nauki — wystarczy patrzeć z ciekawością zamiast z frustracją.',
  },
  {
    id: 67, chapterId: 5, pack: 'affirmations', title: 'Ufam Procesowi',
    difficulty: 2, mode: 'normal',
    text: 'Ufam procesowi. Nie muszę znać całej drogi, żeby zrobić następny krok. Każde wyzwanie rozgrywa się po jednej chwili naraz. Wystarczy jeden ruch, jedna decyzja i jedna spokojna runda. Reszta ułoży się sama.',
  },
  {
    id: 68, chapterId: 5, pack: 'mindfulness', title: 'Mój Umysł Może Zwalniać',
    difficulty: 2, mode: 'normal',
    text: 'Mój umysł może zwalniać — i to jest w porządku. Nie każda myśl musi od razu zostać złapana. Cisza między nutami też jest muzyką. Czasem najlepsze rzeczy przychodzą właśnie wtedy, gdy przestaję za nimi biec.',
  },
  {
    id: 69, chapterId: 5, pack: 'start', title: 'Piszę Jak Człowiek',
    difficulty: 2, mode: 'normal',
    text: 'Piszę jak człowiek, nie jak maszyna do produkcji wyniku. Wynik jest skutkiem ubocznym. Liczą się palce na klawiaturze, rytm myśli, bycie tu. Najważniejsze jest to, że wracam do rytmu — raz za razem, bez względu na to, co było przed chwilą.',
  },
  {
    id: 70, chapterId: 5, pack: 'affirmations', title: 'Jestem Wystarczający',
    difficulty: 2, mode: 'normal',
    text: 'Jestem wystarczający już teraz. Mogę się rozwijać bez pogardy do siebie. To dziwne dla mózgu, wiem — uczono go, że krytyka napędza. Ale może się odzwyczaić od tego nawyku. Łagodność wobec siebie też jest formą siły.',
  },
  {
    id: 71, chapterId: 5, pack: 'mindfulness', title: 'Zamieniam Chaos W Rytm',
    difficulty: 2, mode: 'normal',
    text: 'Zamieniam chaos w rytm. Nie przez siłę, tylko przez powrót. Jedno słowo, jeden oddech, jeden znak. Nie trzeba wszystkiego naraz, nie trzeba perfekcji od razu. Tak robi się porządek — spokojnie, po jednym małym kroku.',
  },
  {
    id: 72, chapterId: 5, pack: 'affirmations', title: 'Moje Tempo',
    difficulty: 2, mode: 'normal',
    text: 'Moje tempo jest moje. Mogę przyspieszać, kiedy jestem gotowy, i zwalniać, kiedy potrzebuję precyzji. Każdy ma swój własny rytm — i żaden nie jest zły. Dostosowuję się do siebie, nie do normy kogoś innego. To nie ucieczka, to mądrość.',
  },
  {
    id: 73, chapterId: 5, pack: 'noBackspace', title: 'Bez Cofania',
    difficulty: 2, mode: 'noBackspace',
    text: 'Nie cofam natychmiast. Daję sobie zobaczyć prawdziwy ślad ruchu. Obserwuję go spokojnie — jak świadek, nie jak sędzia. Błąd nie znika, ale przestaje mną rządzić. Zostaje w tle, a ja idę dalej.',
  },
  {
    id: 74, chapterId: 5, pack: 'affirmations', title: 'Jestem Najlepszym Wydarzeniem',
    difficulty: 2, mode: 'normal',
    text: 'Jestem najlepszym, co mogło mi się przytrafić, bo ze sobą zostaję najdłużej. Nikt inny nie będzie przy mnie w każdej chwili treningu. Warto więc mówić do siebie jak do kogoś ważnego — z cierpliwością i szacunkiem.',
  },
  {
    id: 75, chapterId: 5, pack: 'visualization', title: 'Przyszłość Już Ćwiczy',
    difficulty: 2, mode: 'normal',
    text: 'Moja przyszłość zaczyna się w tej rundzie. Nie w wielkim przemówieniu, nie w fajerwerkach, tylko w cichym powtórzeniu dobrego ruchu. Jeden gest wykonany z uwagą buduje więcej niż dziesięć zrobionych na pokaz.',
  },
  {
    id: 76, chapterId: 5, pack: 'mindfulness', title: 'Dłoń Wie',
    difficulty: 2, mode: 'normal',
    text: 'Dłoń wie więcej, gdy głowa nie krzyczy. Pozwalam palcom pamiętać. Pozwalam ciału uczyć się bez ciągłego egzaminu. Zaufanie do własnego rytmu to też umiejętność, którą się ćwiczy.',
  },
  {
    id: 77, chapterId: 5, pack: 'motivation', title: 'Nie Jestem Spóźniony',
    difficulty: 2, mode: 'normal',
    text: 'Nie jestem spóźniony do własnego życia. Zaczynam tam, gdzie jestem. To miejsce może być niedoskonałe, ale jest prawdziwe. Nie szukam lepszego momentu. Ten oddech i ten tekst — to wystarczy.',
  },
  {
    id: 78, chapterId: 5, pack: 'mindfulness', title: 'Czysta Obecność',
    difficulty: 2, mode: 'normal',
    text: 'W tej chwili nie muszę rozwiązywać całego życia. Mam tekst, oddech i palce. To wystarczy, żeby wrócić do obecności. Nie muszę rozwiązywać wszystkiego naraz. Teraz wystarczy być tutaj.',
  },
  {
    id: 79, chapterId: 5, pack: 'start', title: 'Nie Walczę Z Tekstem',
    difficulty: 2, mode: 'normal',
    text: 'Nie walczę z tekstem. Czytam, oddycham i piszę. Jeśli pomylę znak, świat nadal obraca się dalej, zuchwała planeta jedna. Pomyłka to nie wyrok — to drobna wskazówka. Wracam do rytmu i piszę dalej.',
  },
  {
    id: 80, chapterId: 5, pack: 'mindfulness', title: 'Wewnętrzny Porządek',
    difficulty: 2, mode: 'normal',
    text: 'Porządek zaczyna się od małych rzeczy. Od dłoni. Od oddechu. Od tego, że nie uciekam, gdy robi się trochę niewygodnie. Buduję go cierpliwie — krok po kroku, oddech po oddechu, znak po znaku.',
  },

  // ── Rozdział 6 · Polskie Ogonki ─────────────────────────────────────────────
  {
    id: 81, chapterId: 6, pack: 'polishSigns', title: 'Zażółć Spokojnie',
    difficulty: 3, mode: 'hardSigns',
    text: 'Zażółć gęślą jaźń. To nie jest zdanie, to polski smok ortograficzny. Nie trzeba go pokonać — wystarczy z nim zatańczyć. Podchodzę spokojnie, litera po literze, bez pośpiechu i bez heroizmu.',
  },
  {
    id: 82, chapterId: 6, pack: 'polishSigns', title: 'Źródło Cierpliwości',
    difficulty: 3, mode: 'hardSigns',
    text: 'Źródło cierpliwości jest bliżej, niż sądzę. Ćwiczę ą, ę, ć, ł, ń, ó, ś, ź i ż — każdy z osobna, z uwagą. Palce uczą się same, gdy umysł przestaje się śpieszyć.',
  },
  {
    id: 83, chapterId: 6, pack: 'polishSigns', title: 'Łagodność',
    difficulty: 3, mode: 'hardSigns',
    text: 'Łagodność nie oznacza słabości. Czasem oznacza, że nie muszę walić w klawisze jak człowiek próbujący obudzić drukarkę. Lekki dotyk wystarczy. Klawiatura to nie przeciwnik — to instrument.',
  },
  {
    id: 84, chapterId: 6, pack: 'polishSigns', title: 'Ścieżka Przez Znaki',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ścieżka przez polskie znaki jest wąska, ale można ją przejść. Wystarczy mniej pośpiechu, więcej uwagi i trochę pokory dla ogonków. Każde ą i każde ź to nie przeszkoda — to charakter języka, w którym właśnie piszę.',
  },
  {
    id: 85, chapterId: 6, pack: 'polishSigns', title: 'Ćwiczę Bez Złości',
    difficulty: 3, mode: 'hardSigns',
    text: 'Ćwiczę bez złości. Jeśli zgubię ś, ź albo ć, nie robię dramatu. Każdy błąd to tylko zakręt, nie ściana. Wracam do ruchu i uczę palce nowej mapy — po cichu, bez pośpiechu.',
  },
  {
    id: 86, chapterId: 6, pack: 'polishSigns', title: 'Żółty Liść',
    difficulty: 3, mode: 'hardSigns',
    text: 'Żółty liść spadł na ziemię bez pośpiechu. Nikt go nie poganiał ani nie zatrzymał, więc zrobił to idealnie. Moje palce też mogą zwolnić. Prędkość przyjdzie sama, gdy ruch będzie spokojny.',
  },
  {
    id: 87, chapterId: 6, pack: 'polishSigns', title: 'Łąka Po Deszczu',
    difficulty: 3, mode: 'hardSigns',
    text: 'Łąka po deszczu pachniała spokojem. Szły przez nią myśli, które nie musiały już niczego udowadniać. Palce też mogą uczyć się tak — bez wyścigu, w cichym, równym rytmie.',
  },
  {
    id: 88, chapterId: 6, pack: 'polishSigns', title: 'Nie Gubię Ogonków',
    difficulty: 3, mode: 'hardSigns',
    text: 'Nie gubię ogonków, bo ogonki też są częścią sensu. Ą to nie A — to inny dźwięk, inne znaczenie. Polska litera bez ogonka wygląda jak człowiek bez kawy: niby tu jest, ale coś wyraźnie nie gra.',
  },
  {
    id: 89, chapterId: 6, pack: 'polishSigns', title: 'Czułość Do Detalu',
    difficulty: 3, mode: 'hardSigns',
    text: 'Czułość do detalu uczy mnie cierpliwości. Jeden znak może zmienić słowo, jeden przecinek może zmienić sens zdania. Tak samo jeden spokojny oddech może zmienić rundę, a jedna chwila skupienia może zmienić nawyk.',
  },
  {
    id: 90, chapterId: 6, pack: 'polishSigns', title: 'Mały Ogonek, Duża Różnica',
    difficulty: 3, mode: 'hardSigns',
    text: 'Mały ogonek robi dużą różnicę. Tak samo mały nawyk powtarzany codziennie. Tak samo jedna decyzja, żeby nie panikować przy błędzie — zamiast tego zatrzymać się, odetchnąć i pisać dalej spokojniej niż przed chwilą.',
  },

  // ── Rozdział 7 · Blind Flow ──────────────────────────────────────────────────
  {
    id: 91, chapterId: 7, pack: 'blindFlow', title: 'Piszę Z Pamięci',
    difficulty: 3, mode: 'blindFlow',
    text: 'Piszę z pamięci. Nie widzę wszystkiego, ale czuję kierunek — gdzie leży klawisz, gdzie prowadzi ręka. To ćwiczenie nie sprawdza tylko palców ani szybkości. Sprawdza zaufanie do siebie i do tego, czego się nauczyłem.',
  },
  {
    id: 92, chapterId: 7, pack: 'blindFlow', title: 'Mniej Oczu',
    difficulty: 3, mode: 'blindFlow',
    text: 'Kiedy mniej patrzę, mniej kontroluję. Kiedy mniej kontroluję, przestaję walczyć z klawiaturą i zaczynam słyszeć rytm. Blind Flow to nie ciemność ani chaos — to inny rodzaj uwagi, skupiony na tym, co czuję, a nie na tym, co widzę.',
  },
  {
    id: 93, chapterId: 7, pack: 'blindFlow', title: 'Wewnętrzna Klawiatura',
    difficulty: 3, mode: 'blindFlow',
    text: 'Wewnętrzna klawiatura buduje się powoli. Najpierw jest zgadywanie, potem rytm, a potem nagle palce wiedzą, gdzie wrócić. Tak działa każda nauka — głowa szuka drogi, a ciało zapamiętuje każdy błąd.',
  },
  {
    id: 94, chapterId: 7, pack: 'blindFlow', title: 'Nie Widzę, Ale Idę',
    difficulty: 3, mode: 'blindFlow',
    text: 'Nie widzę całego tekstu, ale idę dalej. To dobra lekcja dla pisania i całego życia, niestety życie też ma kiepski interfejs. I też nie pyta, czy jesteś gotowy — po prostu pędzi naprzód.',
  },
  {
    id: 95, chapterId: 7, pack: 'blindFlow', title: 'Cisza Ekranu',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ekran milczy, więc słyszę siebie. Palce przestają pytać o pozwolenie. Zaczynają szukać rytmu w pamięci. To jest ten rzadki moment, kiedy ciało wie więcej niż głowa.',
  },
  {
    id: 96, chapterId: 7, pack: 'blindFlow', title: 'Bez Podglądania',
    difficulty: 3, mode: 'blindFlow',
    text: 'Bez podglądania widać więcej. Widać napięcie, pośpiech i miejsca, w których głowa próbuje przejąć stery jak spanikowany kapitan. Palce mają własną inteligencję — wystarczy się odsunąć i im zaufać.',
  },
  {
    id: 97, chapterId: 7, pack: 'blindFlow', title: 'Pamiętam Zdanie',
    difficulty: 3, mode: 'blindFlow',
    text: 'Pamiętam zdanie nie jako obraz, ale jako rytm. Słowa wracają przez dłonie, jakby zawsze tam były. Nie muszę ich gonić ani szukać — wystarczy je zaprosić. Ciało wie, palce pamiętają.',
  },
  {
    id: 98, chapterId: 7, pack: 'blindFlow', title: 'Ciemność Pomaga',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ciemność pomaga, gdy oczy robią za komisję śledczą. Zamykam kontrolę, otwieram rytm i pozwalam dłoniom pracować. Nie muszę widzieć, żeby wiedzieć. Klawiatura jest mapą, którą ciało już zna.',
  },
  {
    id: 99, chapterId: 7, pack: 'blindFlow', title: 'Piszę Dalej',
    difficulty: 3, mode: 'blindFlow',
    text: 'Piszę dalej, nawet jeśli nie jestem pewien. Niepewność nie musi mnie zatrzymać — może być tylko częścią drogi. Każdy błąd to nie koniec. To tylko zakręt, za którym czeka rytm.',
  },
  {
    id: 100, chapterId: 7, pack: 'blindFlow', title: 'Ufam Dłoniom',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ufam dłoniom. Ufam rytmowi. Ufam temu, że ciało może nauczyć się rzeczy, których głowa nie musi ciągle nadzorować. To, co powtarzane, staje się ciche i pewne. Tak właśnie rośnie biegłość.',
  },

  // ── Rozdział 8 · Wizualizacja ────────────────────────────────────────────────
  {
    id: 101, chapterId: 8, pack: 'visualization', title: 'Żyję Jak Spełniony',
    difficulty: 3, mode: 'normal',
    text: 'Żyję tak, jakby moje dobre życie już zaczęło się dzisiaj. Nie czekam na idealny moment ani na lepsze warunki. Wchodzę w stan człowieka, który wraca do siebie — spokojnie, bez pośpiechu. To nie scenariusz. To wybór, który podejmuję teraz.',
  },
  {
    id: 102, chapterId: 8, pack: 'visualization', title: 'Neville Bez Peleryny',
    difficulty: 3, mode: 'normal',
    text: 'Wyobrażam sobie koniec, ale nie uciekam od działania. Czuję spełnienie — i właśnie z tego miejsca robię mały krok. Nie z lęku, nie z przymusu. Mistyka mistyką, ale palce też mają robotę. Wizja nadaje kierunek, ruch nadaje życie.',
  },
  {
    id: 103, chapterId: 8, pack: 'visualization', title: 'Stan Spełnienia',
    difficulty: 3, mode: 'normal',
    text: 'Wchodzę w stan spełnienia. Nie jako udawanie, nie jako ucieczka — jako ćwiczenie wyboru, który mogę podjąć teraz. Moje ciało uczy się nowego sposobu bycia. Palce zapamiętują to szybciej niż myśl.',
  },
  {
    id: 104, chapterId: 8, pack: 'visualization', title: 'Obraz Przyszłości',
    difficulty: 3, mode: 'normal',
    text: 'Widzę siebie spokojnego, silnego i obecnego. Nie idealnego — prawdziwego. Takiego, który siedzi z tym, co jest, i nie ucieka. Ani od życia, ani od klawiatury. Właśnie taki człowiek zaczyna pisać.',
  },
  {
    id: 105, chapterId: 8, pack: 'visualization', title: 'Już Jestem W Drodze',
    difficulty: 3, mode: 'normal',
    text: 'Już jestem w drodze. Nie muszę czekać, aż poczuję się gotowy. Gotowość często przychodzi dopiero po pierwszym ruchu. Działanie tworzy pewność siebie — nie odwrotnie. Ruszam z tym, co mam.',
  },
  {
    id: 106, chapterId: 8, pack: 'visualization', title: 'Czuję To Teraz',
    difficulty: 3, mode: 'normal',
    text: 'Czuję wdzięczność teraz, nie dopiero po wszystkim. To zmienia napięcie w ciele i sposób, w jaki patrzę na własny dzień. Wdzięczność to nie nagroda za sukces — to postawa, którą wybieram już teraz.',
  },
  {
    id: 107, chapterId: 8, pack: 'visualization', title: 'Dobre Życie',
    difficulty: 3, mode: 'normal',
    text: 'Dobre życie nie musi wejść z fanfarami. Może zacząć się od tego, że dziś nie zdradzam siebie w małych decyzjach. Każdy taki wybór to cichy krok w stronę osoby, którą chcę być.',
  },
  {
    id: 108, chapterId: 8, pack: 'visualization', title: 'Nowa Tożsamość',
    difficulty: 3, mode: 'normal',
    text: 'Staję się człowiekiem, który ćwiczy spokojnie. Człowiekiem, który kończy rundę. Człowiekiem, który nie robi z błędu religii. Tożsamość buduje się z powtórzeń — nie z perfekcji ani wielkich gestów.',
  },
  {
    id: 109, chapterId: 8, pack: 'visualization', title: 'To Już Pracuje',
    difficulty: 3, mode: 'normal',
    text: 'To już pracuje we mnie. Nawyk rośnie po cichu, bez fanfar i wielkich chwil. Nie muszę widzieć korzeni, żeby wiedzieć, że coś zaczyna się układać pod powierzchnią. Wystarczy, że tu jestem.',
  },
  {
    id: 110, chapterId: 8, pack: 'visualization', title: 'Przyszły Ja',
    difficulty: 3, mode: 'normal',
    text: 'Przyszły ja nie jest obcym człowiekiem. To ja po wielu małych powrotach, po sesjach, których nikt poza mną nie widział. Każda runda jest wiadomością wysłaną do niego — i on już ją odbiera.',
  },

  // ── Rozdział 9 · Duchowość ───────────────────────────────────────────────────
  {
    id: 111, chapterId: 9, pack: 'spirituality', title: 'Jezus Cię Kocha',
    difficulty: 2, mode: 'normal',
    text: 'Jezus cię kocha. Nie jako hasło na kubku czy dekorację na ścianie — tylko jako żywe przypomnienie, że nie jesteś sam w miejscu, którego nie umiesz jeszcze nazwać. I właśnie tam, w tym miejscu, jesteś widziany.',
  },
  {
    id: 112, chapterId: 9, pack: 'spirituality', title: 'Pokój W Ciszy',
    difficulty: 2, mode: 'normal',
    text: 'W ciszy też może być obecność. Nie każda odpowiedź przychodzi jako zdanie ani nagłe olśnienie. Czasem przychodzi jako spokój, który zostaje chwilę dłużej niż powinien — i właśnie wtedy coś głębokiego w nas wie.',
  },
  {
    id: 113, chapterId: 9, pack: 'spirituality', title: 'Nie Jestem Sam',
    difficulty: 2, mode: 'normal',
    text: 'Nie jestem sam. Nawet gdy dzień jest ciężki, mogę oprzeć się o coś większego niż mój aktualny lęk. Ta obecność trwa ciszej niż lęk – i jest tam, zanim zdążę jej poszukać.',
  },
  {
    id: 114, chapterId: 9, pack: 'spirituality', title: 'Łaska Nie Krzyczy',
    difficulty: 3, mode: 'normal',
    text: 'Łaska nie zawsze krzyczy. Czasem działa cicho, jak światło pod drzwiami – ledwo widoczne, a jednak wystarczające. Wystarczy zauważyć, że jeszcze jest droga, i pozwolić sobie zrobić krok.',
  },
  {
    id: 115, chapterId: 9, pack: 'spirituality', title: 'Modlitwa Bez Słów',
    difficulty: 3, mode: 'normal',
    text: 'Czasem modlitwa nie ma słów. Jest tylko oddech, zmęczenie i pragnienie, żeby wrócić do dobra. Nie trzeba ładnych zdań. Samo to pragnienie, choćby ledwo wypowiedziane, też może wystarczyć.',
  },
  {
    id: 116, chapterId: 9, pack: 'spirituality', title: 'Bóg Nie Jest Excelem',
    difficulty: 3, mode: 'normal',
    text: 'Bóg nie jest Excelem, który liczy moje błędy w komórkach. Nie przychodzę z raportem. Mogę wracać bez udawania, że zawsze wiem, co robię – bez maski i bez gotowych odpowiedzi.',
  },
  {
    id: 117, chapterId: 9, pack: 'spirituality', title: 'Światło W Małym Ruchu',
    difficulty: 3, mode: 'normal',
    text: 'Światło czasem pojawia się w małym ruchu. W tym, że nie rezygnuję. W tym, że robię jedną dobrą rzecz mimo zmęczenia. Nie musi to być wielki gest. Małe trwanie też jest odpowiedzią.',
  },
  {
    id: 118, chapterId: 9, pack: 'spirituality', title: 'Nie Muszę Być Gotowy',
    difficulty: 3, mode: 'normal',
    text: 'Nie muszę być gotowy, żeby zostać poprowadzony. Czasem wystarczy powiedzieć: jestem tutaj, nie wiem jak, ale chcę iść dalej. Gotowość nie zawsze poprzedza krok. Czasem rodzi się dopiero w drodze.',
  },
  {
    id: 119, chapterId: 9, pack: 'spirituality', title: 'Wdzięczność',
    difficulty: 3, mode: 'normal',
    text: 'Wdzięczność nie kasuje problemów. Ona tylko przypomina, że problemy nie są całą prawdą. Że jest coś jeszcze. Coś, na co też warto patrzeć. To już dużo.',
  },
  {
    id: 120, chapterId: 9, pack: 'spirituality', title: 'Ciche Prowadzenie',
    difficulty: 3, mode: 'normal',
    text: 'Ciche prowadzenie nie zawsze wygląda jak znak z nieba. Czasem wygląda jak decyzja, żeby nie wracać do starego chaosu. Jak wybór spokoju tam, gdzie kiedyś był tylko niepokój.',
  },

  // ── Rozdział 10 · Relacje ────────────────────────────────────────────────────
  {
    id: 121, chapterId: 10, pack: 'relationships', title: 'Ojciec Też Wraca',
    difficulty: 3, mode: 'normal',
    text: 'Ojciec też się uczy. Nie zawsze wiedziałem, jak być obecny — jak słuchać bez radzenia, jak siedzieć bez uciekania myślami. Ale mogę wracać. Mogę próbować od nowa każdego dnia. Miłość nie jest perfekcją. Miłość jest powrotem — cierpliwym, niedoskonałym, prawdziwym.',
  },
  {
    id: 122, chapterId: 10, pack: 'relationships', title: 'Dziecko Patrzy',
    difficulty: 3, mode: 'normal',
    text: 'Dziecko patrzy nie tylko na moje słowa, ale na mój rytm — na to, jak oddycham, gdy jest trudno, jak reaguję, gdy się spieszę. Jeśli uczę się spokoju, pokazuję więcej niż jedną lekcję. Pokazuję, że można.',
  },
  {
    id: 123, chapterId: 10, pack: 'relationships', title: 'Nie Naprawię Wszystkiego Naraz',
    difficulty: 3, mode: 'normal',
    text: 'Nie naprawię wszystkiego naraz. Nie cofnę chwil, które przepłynęły. Mogę jednak być dziś trochę bardziej obecny niż wczoraj — zatrzymać się dłużej, zapytać uważniej, zostać chwilę dłużej przy drzwiach. To nie jest mało.',
  },
  {
    id: 124, chapterId: 10, pack: 'relationships', title: 'Dobrze, Że Jesteś',
    difficulty: 2, mode: 'normal',
    text: 'Dobrze, że jesteś. Twoja obecność ma znaczenie, nawet gdy nie masz gotowej odpowiedzi — gdy nie wiesz, co powiedzieć, gdy milczysz. Dzieci nie potrzebują perfekcji. Potrzebują kogoś, kto zostaje. Czasem wystarczy zostać.',
  },
  {
    id: 125, chapterId: 10, pack: 'relationships', title: 'Miłość W Praktyce',
    difficulty: 3, mode: 'normal',
    text: 'Miłość w praktyce rzadko wygląda jak film. Częściej wygląda jak cierpliwość, rozmowa, herbata i nieuciekanie, gdy robi się trudno. To codzienne wybieranie obecności — nawet wtedy, gdy jest cisza, a słowa nie przychodzą łatwo.',
  },
  {
    id: 126, chapterId: 10, pack: 'relationships', title: 'Słucham',
    difficulty: 2, mode: 'normal',
    text: 'Słucham uważniej. Nie po to, żeby wygrać rozmowę, ale żeby naprawdę usłyszeć człowieka po drugiej stronie. To jeden z rzadkich darów — być tak blisko czyjejś myśli, żeby ona poczuła, że ma miejsce.',
  },
  {
    id: 127, chapterId: 10, pack: 'relationships', title: 'Nie Muszę Mieć Racji',
    difficulty: 3, mode: 'normal',
    text: 'Nie muszę zawsze mieć racji. Mogę mieć kontakt. A kontakt jest często cenniejszy niż triumfalne stanie na ruinach dyskusji. Wygrać kłótnię i stracić bliskość — to rzadko jest wymiana, na którą warto się godzić.',
  },
  {
    id: 128, chapterId: 10, pack: 'relationships', title: 'Bliskość',
    difficulty: 3, mode: 'normal',
    text: 'Bliskość nie powstaje z wielkich deklaracji. Powstaje z małych chwil, w których ktoś czuje, że nie musi udawać. Z momentów bez pozy, gdzie wystarczy być — i to wystarcza obu stronom.',
  },
  {
    id: 129, chapterId: 10, pack: 'relationships', title: 'Mniej Obrony',
    difficulty: 3, mode: 'normal',
    text: 'Mniej się bronię, więcej słucham. To trudne, bo ego lubi nosić hełm i w nim maszerować. Ale czasem można go zdjąć, usiąść i po prostu słuchać – bez kontrargumentów w głowie. I nadal przeżyć.',
  },
  {
    id: 130, chapterId: 10, pack: 'relationships', title: 'Dobre Słowo',
    difficulty: 2, mode: 'normal',
    text: 'Dobre słowo może zostać w człowieku na bardzo długo. Nie zawsze wiem, które słowo nim będzie, więc mówię ostrożniej. Może właśnie to jedno, zapomniane przeze mnie zdanie komuś zmieni dzień.',
  },

  // ── Rozdział 11 · Opowieści ──────────────────────────────────────────────────
  {
    id: 131, chapterId: 11, pack: 'stories', title: 'Kartka Od Mamy',
    difficulty: 3, mode: 'normal',
    text: 'Wróciłem późno do domu. Na stole czekała kartka od mamy i gorący garnek zupy. Nie pytała, co się działo. Pewnie wiedziała, że nie trzeba. Czasem miłość nie robi hałasu, tylko zostawia ciepło.',
  },
  {
    id: 132, chapterId: 11, pack: 'stories', title: 'Pies Przy Kaloryferze',
    difficulty: 3, mode: 'normal',
    text: 'Pies spał zwinięty przy kaloryferze i nawet nie wstał mnie przywitać. Tylko otworzył jedno oko, zerknął i zamknął z powrotem. Uznałem to za szczyt zaufania albo bezczelności. Pewnie obu naraz.',
  },
  {
    id: 133, chapterId: 11, pack: 'stories', title: 'Bieg Po Zmroku',
    difficulty: 3, mode: 'normal',
    text: 'Wybiegłem po zmroku, gdy miasto zaczynało milknąć. Po kilku minutach oddech znalazł rytm, a głowa przestała udawać centrum wszechświata. Ulice były puste, latarnie robiły swoje. Nikt nie czekał na mój raport z biegania.',
  },
  {
    id: 134, chapterId: 11, pack: 'stories', title: 'Stara Klawiatura',
    difficulty: 3, mode: 'normal',
    text: 'Stara klawiatura miała własny charakter. Niektóre klawisze działały jakby po negocjacjach, inne jakby miały osobisty żal do użytkownika. Pisanie na niej wymagało cierpliwości. I jakoś tekst wychodził lepszy niż na nowej.',
  },
  {
    id: 135, chapterId: 11, pack: 'stories', title: 'Deszcz Na Szybie',
    difficulty: 3, mode: 'normal',
    text: 'Deszcz stukał o szybę, a ja pisałem wolniej niż zwykle. Nie dlatego, że nie umiałem. Dlatego, że pierwszy raz nie musiałem uciekać. Każde zdanie leżało tam, gdzie je zostawiłem. Deszcz też nie spieszył się nigdzie.',
  },
  {
    id: 136, chapterId: 11, pack: 'stories', title: 'Nocna Iteracja',
    difficulty: 3, mode: 'normal',
    text: 'O drugiej w nocy poprawiałem kolor przycisku, jakby od tego zależał los cywilizacji. Rano okazało się, że najbardziej potrzebowałem snu. Przycisk był taki sam. Ja byłem gorszy. Następnym razem poszedłem spać o północy.',
  },
  {
    id: 137, chapterId: 11, pack: 'stories', title: 'Mały Pokój',
    difficulty: 3, mode: 'normal',
    text: 'Pokój był mały, ale spokojny. Na biurku stał kubek z herbatą, obok leżały notatki zapisane niedbale. Przez okno wpadało blade światło. I gdzieś w środku dnia, bez zapowiedzi, pojawiło się coś podobnego do nadziei.',
  },
  {
    id: 138, chapterId: 11, pack: 'stories', title: 'Powrót Z Pracy',
    difficulty: 3, mode: 'normal',
    text: 'Wróciłem z pracy zmęczony, ale nie całkiem pusty. Zdjąłem buty i usiadłem przy stole. Przez chwilę nie myślałem o niczym. Czasem wystarczy prosta rzecz: cisza, ciepła zupa i świadomość, że dzień już się kończy.',
  },
  {
    id: 139, chapterId: 11, pack: 'stories', title: 'Runda Po Biegu',
    difficulty: 3, mode: 'normal',
    text: 'Po biegu palce pisały inaczej — pewniej, spokojniej. Ciało było zmęczone, ale spokojniejsze niż przed wyjściem. Głowa milczała. Jakby napięcie zostało gdzieś między latarniami, na mokrym asfalcie.',
  },
  {
    id: 140, chapterId: 11, pack: 'stories', title: 'Zwykły Wieczór',
    difficulty: 3, mode: 'normal',
    text: 'Zwykły wieczór może być początkiem zmiany. Nie musi wyglądać imponująco ani szczególnie różnić się od innych. Wystarczy, że podejdę do niego uważnie. Że nie oddam go bezmyślnie staremu, znajomemu chaosowi.',
  },

  // ── Rozdział 12 · Mistrzostwo ────────────────────────────────────────────────
  {
    id: 141, chapterId: 12, pack: 'mastery', title: 'Mistrz Nie Krzyczy',
    difficulty: 4, mode: 'normal',
    text: 'Mistrz nie musi krzyczeć, że jest mistrzem. Po prostu wraca do podstaw, kiedy inni szukają magicznego skrótu z brokatem. Fundament nie błyszczy. Ale też nie pęka. To wystarczy, żeby rosnąć.',
  },
  {
    id: 142, chapterId: 12, pack: 'mastery', title: 'Dokładność Przed Prędkością',
    difficulty: 4, mode: 'normal',
    text: 'Dokładność przed prędkością. Najpierw czysta droga, potem tempo. Szybkość bez kontroli to tylko efektowna forma potykania się. Zwalniaj celowo. Buduj pewność. Potem pozwól sobie przyspieszyć.',
  },
  {
    id: 143, chapterId: 12, pack: 'mastery', title: 'Stabilność',
    difficulty: 4, mode: 'normal',
    text: 'Stabilność jest większym osiągnięciem niż jednorazowy rekord. Rekord robi hałas. Stabilność zmienia człowieka po cichu. Jeden dobry dzień to przypadek. Powtórzony sto razy — to charakter.',
  },
  {
    id: 144, chapterId: 12, pack: 'mastery', title: 'Nie Gonię Wyniku',
    difficulty: 4, mode: 'normal',
    text: 'Nie gonię wyniku. Buduję warunki, w których wynik sam zaczyna rosnąć. To nudniejsze, więc oczywiście skuteczniejsze. Ekscytacja mija. Nawyk zostaje. Dlatego stawiam na proces, nie na dreszczyk.',
  },
  {
    id: 145, chapterId: 12, pack: 'mastery', title: 'Mniej Dramatycznie',
    difficulty: 4, mode: 'normal',
    text: 'Mniej dramatycznie, bardziej regularnie. Tak właśnie powstaje prawdziwy postęp — cichy i nieefektowny. Bez nagłego przełomu, bez nagrody. Niestety bez fanfar, smoków i muzyki trailerowej.',
  },
  {
    id: 146, chapterId: 12, pack: 'mastery', title: 'Spokojna Moc',
    difficulty: 4, mode: 'normal',
    text: 'Spokojna moc nie wygląda jak napięcie ani przełom. Wygląda jak człowiek, który po prostu robi swoje — codziennie, metodycznie, nawet gdy jest trudno i nikt nie klaszcze.',
  },
  {
    id: 147, chapterId: 12, pack: 'mastery', title: 'Rzemiosło',
    difficulty: 4, mode: 'normal',
    text: 'Rzemiosło zaczyna się dokładnie tam, gdzie kończy się zachwyt nad nowością. Nie szukam już dreszczyku pierwszego razu. Wracam, powtarzam, poprawiam i spokojnie pozwalam, żeby jakość powoli rosła.',
  },
  {
    id: 148, chapterId: 12, pack: 'mastery', title: 'Pełna Obecność',
    difficulty: 4, mode: 'normal',
    text: 'Pełna obecność to nie napięta kontrola ani walka z rozproszeniem. To spokojne, jasne widzenie tego, co jest właśnie teraz — tekstu, ułożenia dłoni, błędu, głębokiego oddechu i następnego znaku.',
  },
  {
    id: 149, chapterId: 12, pack: 'mastery', title: 'Nie Uciekam',
    difficulty: 4, mode: 'normal',
    text: 'Nie uciekam od trudniejszej rundy. Nie muszę jej wygrać spektakularnie. Wystarczy, że przejdę przez nią uczciwie. Każdy klawisz naciśnięty z uwagą to krok naprzód. I to mi wystarczy.',
  },
  {
    id: 150, chapterId: 12, pack: 'mastery', title: '777 Flow',
    difficulty: 5, mode: 'normal',
    text: 'Na końcu nie chodzi o 777 lekcji. Chodzi o człowieka, który nauczył się wracać. Do rytmu, do spokoju, do siebie i do następnego znaku. Chodzi o kogoś, kto po złej sesji wstaje, siada z powrotem i pisze dalej.',
  },

  // ── Rozdział 13 · Jadeitowa Droga I ─────────────────────────────────────────
  {
    id: 151, chapterId: 13, pack: 'jadePath', title: 'Ciche Ostrze',
    difficulty: 2, mode: 'normal',
    text: 'Ostrze nie musi błyszczeć, żeby było ostre. Człowiek nie musi krzyczeć, żeby mieć siłę. Nie każda moc jest głośna. Nie każda gotowość widoczna. Najpierw cisza, potem skupienie, potem ruch.',
  },
  {
    id: 152, chapterId: 13, pack: 'jadePath', title: 'Droga Bambusu',
    difficulty: 2, mode: 'normal',
    text: 'Bambus ugina się na wietrze, ale nie łamie. Uczę się tego samego. Mniej oporu, więcej elastyczności, spokojniejszy powrót. Nie walczę z rytmem — płynę razem z nim, aż znajdę swoje tempo.',
  },
  {
    id: 153, chapterId: 13, pack: 'jadePath', title: 'Mistrz I Oddech',
    difficulty: 2, mode: 'normal',
    text: 'Mistrz nie patrzył na moje błędy. Patrzył na mój oddech. Gdy się urywał, odkładał rękę i czekał w milczeniu. Powiedział, że palce zdradzają tylko to, czego serce jeszcze nie uspokoiło. Cisza też jest nauką.',
  },
  {
    id: 154, chapterId: 13, pack: 'jadePath', title: 'Deszcz Na Dziedzińcu',
    difficulty: 2, mode: 'normal',
    text: 'Deszcz padał na pusty dziedziniec. Każda kropla trafiała dokładnie tam, gdzie miała spaść. Nie walczyła z powietrzem i nie spieszyła się. Tak chcę pisać: bez pośpiechu i bez walki, z pewnością każdej chwili.',
  },
  {
    id: 155, chapterId: 13, pack: 'jadePath', title: 'Pierwszy Ukłon',
    difficulty: 2, mode: 'normal',
    text: 'Zanim dotknę klawiatury, robię wewnętrzny ukłon. Chwila zatrzymania przed pierwszym słowem. Nie przed tekstem, nie przed wynikiem, ale przed własnym skupieniem. To ono poprowadzi palce.',
  },
  {
    id: 156, chapterId: 13, pack: 'jadePath', title: 'Liść Na Wodzie',
    difficulty: 2, mode: 'normal',
    text: 'Liść płynie po wodzie, bo nie próbuje wygrać z rzeką. Poddaje się jej rytmowi i właśnie dlatego dociera tam, gdzie ma dotrzeć. Ja też nie muszę walczyć z tekstem. Wystarczy, że odnajdę nurt.',
  },

  // ── Rozdział 14 · Jadeitowa Droga II ────────────────────────────────────────
  {
    id: 157, chapterId: 14, pack: 'jadePath', title: 'Dziesięć Pierścieni Spokoju',
    difficulty: 3, mode: 'normal',
    text: 'Każdy pierścień był lekcją. Jeden uczył cierpliwości, drugi odwagi, trzeci ciszy. Czwarty mówił o równowadze między działaniem a bezruchem. Ostatni przypominał, że największa moc nie potrzebuje hałasu — wystarczy tylko, że jest obecna.',
  },
  {
    id: 158, chapterId: 14, pack: 'jadePath', title: 'Dom Latających Myśli',
    difficulty: 3, mode: 'normal',
    text: 'Myśli przelatywały jak sztylety przez bambusowy las — szybkie, ostre, nieprzewidywalne. Nie próbowałem łapać wszystkich. Wiedziałem, że to niemożliwe. Wybrałem jedną i poprowadziłem ją spokojnie, krok po kroku, aż do końca.',
  },
  {
    id: 159, chapterId: 14, pack: 'jadePath', title: 'Hero Bez Publiczności',
    difficulty: 3, mode: 'normal',
    text: 'Prawdziwy bohater nie zawsze stoi na placu przed armią. Nie zawsze walczy w świetle pochodni. Czasem siedzi wieczorem przy biurku, sam na sam z własnymi słabościami, i mimo wszystko nie ucieka od treningu.',
  },
  {
    id: 160, chapterId: 14, pack: 'jadePath', title: 'Szkoła Cienia',
    difficulty: 3, mode: 'normal',
    text: 'Cień nie jest wrogiem. Pokazuje tylko, gdzie jeszcze nie dotarło światło — i tym samym wskazuje kierunek. Błąd w tekście działa podobnie: ujawnia miejsce, które domaga się uwagi i pracy. Choć mniej poetycko i zdecydowanie bardziej irytująco.',
  },
  {
    id: 161, chapterId: 14, pack: 'jadePath', title: 'Niebieski Miecz',
    difficulty: 3, mode: 'normal',
    text: 'Niebieski miecz przeciął powietrze bez gniewu. Nie ścinał — wyznaczał granicę. W tym ruchu było coś więcej niż siła. Było skupienie, które trwało dłużej niż sam gest. Była decyzja, że chaos nie będzie już dowodził.',
  },
  {
    id: 162, chapterId: 14, pack: 'jadePath', title: 'Jadeitowa Brama',
    difficulty: 3, mode: 'normal',
    text: 'Przed jadeitową bramą nie pytano o szybkość ani o talent. Pytano o coś trudniejszego: czy umiesz wrócić po błędzie. Czy potrafisz spróbować jeszcze raz. Dopiero wtedy otwierała się pierwsza lekcja.',
  },
  {
    id: 163, chapterId: 14, pack: 'jadePath', title: 'Trening O Świcie',
    difficulty: 3, mode: 'normal',
    text: 'O świcie nie było widowni. Był tylko chłód, rytm oddechu i cierpliwie powtarzany ruch. Nikt nie liczył powtórzeń. Nikt nie nagradzał wytrwałości. Tak właśnie rodzi się prawdziwa zmiana: bez świadków, bez fanfar.',
  },
  {
    id: 164, chapterId: 14, pack: 'jadePath', title: 'Czerwony Szal',
    difficulty: 3, mode: 'normal',
    text: 'Czerwony szal poruszył się na wietrze, zanim ciało zrobiło pierwszy krok. Nie był to przypadek. Tak właśnie działa uwaga — wyprzedza działanie. Czasem zamiar pojawia się wcześniej niż ruch. Trzeba go usłyszeć i nie przegapić.',
  },
  {
    id: 165, chapterId: 14, pack: 'jadePath', title: 'Lekcja Mistrza',
    difficulty: 3, mode: 'normal',
    text: 'Mistrz powiedział: jeśli chcesz pisać szybko, najpierw naucz się pisać spokojnie. Przez kilka tygodni uznawałem to za banał godny wyszytej poduszki. Więc oczywiście miał rację — a ja straciłem te tygodnie na sam dowód.',
  },
  {
    id: 166, chapterId: 14, pack: 'jadePath', title: 'Kamień I Rzeka',
    difficulty: 3, mode: 'normal',
    text: 'Kamień trwa, rzeka płynie. Człowiek potrzebuje obu. Stałości, żeby wracać — do nawyku, do rytmu, do klawiatury. I ruchu, żeby nie zamienić się w mebel z ambicjami i przepięknym planem na później.',
  },
  {
    id: 167, chapterId: 14, pack: 'jadePath', title: 'Ostrze Bez Gniewu',
    difficulty: 3, mode: 'normal',
    text: 'Ostrze prowadzone gniewem drży. Ostrze prowadzone spokojem trafia. Palce działają dokładnie tak samo. Gdy przestaję walczyć z klawiaturą jak z przeciwnikiem, zaczynam pisać czyściej — i szybciej, niż kiedy się spieszę.',
  },
  {
    id: 168, chapterId: 14, pack: 'jadePath', title: 'Sala Luster',
    difficulty: 3, mode: 'normal',
    text: 'W sali luster zobaczyłem wszystkie swoje wersje naraz. Tę niecierpliwą, tę zmęczoną, tę zbyt pewną siebie. Najbardziej spodobała mi się ta spokojna — ta, która nie panikowała po jednym błędzie.',
  },
  {
    id: 169, chapterId: 14, pack: 'jadePath', title: 'Smok Nad Dachami',
    difficulty: 3, mode: 'normal',
    text: 'Smok przeleciał nad dachami miasta i nie obejrzał się ani razu. Leciał dalej — spokojnie, równo i bez chwili wahania. Być może właśnie dlatego był smokiem, a nie człowiekiem, który wciąż się zatrzymuje i poprawia każde zdanie.',
  },
  {
    id: 170, chapterId: 14, pack: 'jadePath', title: 'Ukryta Siła',
    difficulty: 3, mode: 'normal',
    text: 'Ukryta siła nie mieszka w napięciu. Nie mieszka też w wysiłku ani w perfekcji każdego gestu. Mieszka w decyzji, że dziś znów siadam, znów ćwiczę i znów spokojnie wracam do rytmu.',
  },

  // ── Rozdział 15 · Jadeitowa Droga III ───────────────────────────────────────
  {
    id: 171, chapterId: 15, pack: 'jadePath', title: 'Most Nad Mgłą',
    difficulty: 4, mode: 'normal',
    text: 'Most nad mgłą wyglądał, jakby prowadził donikąd. Nikt nie widział, co czeka za pierwszym zakrętem. A jednak każdy krok odsłaniał następny fragment drogi, cicho i bez pośpiechu. Tak właśnie działa praktyka.',
  },
  {
    id: 172, chapterId: 15, pack: 'jadePath', title: 'Cisza Przed Ruchem',
    difficulty: 4, mode: 'normal',
    text: 'Najważniejszy moment przychodzi tuż przed ruchem. Krótka cisza, zanim palce znajdą swoje miejsce — chwila, w której ciało samo wybiera kierunek. Jeśli w tej ciszy jest spokój, a nie pośpiech, reszta ma szansę się ułożyć.',
  },
  {
    id: 173, chapterId: 15, pack: 'jadePath', title: 'Tancerz I Wojownik',
    difficulty: 4, mode: 'normal',
    text: 'Tancerz i wojownik spotkali się na pustym placu. Jeden znał lekkość, drugi dyscyplinę. Dopiero razem zrozumieli, czym jest prawdziwy rytm. Ruch potrzebuje kotwicy, a siła — przestrzeni. Dopiero razem tworzą coś żywego.',
  },
  {
    id: 174, chapterId: 15, pack: 'jadePath', title: 'Złoty Krąg',
    difficulty: 4, mode: 'normal',
    text: 'Złoty krąg zamknął się wokół dłoni, ale nie był więzieniem. Był przypomnieniem, że moc bez kierunku staje się tylko hałasem. Kierunek jest tym, co czyni siłę sztuką — a dłoń narzędziem, nie pięścią.',
  },
  {
    id: 175, chapterId: 15, pack: 'jadePath', title: 'Bambusowy Las',
    difficulty: 4, mode: 'normal',
    text: 'W bambusowym lesie każdy dźwięk wydawał się większy. Mój oddech, krok, szelest ubrania. W takim miejscu nie da się oszukać własnego napięcia. Las słyszy wszystko. Ciało wie pierwsze — umysł tylko potwierdza to, co już czujesz.',
  },
  {
    id: 176, chapterId: 15, pack: 'jadePath', title: 'Czarna Herbata',
    difficulty: 4, mode: 'normal',
    text: 'Czarna herbata parzyła się powoli. Nikt jej nie poganiał, bo każdy wiedział, że smak wymaga czasu. Trening dłoni też nie lubi desperacji. Pośpiech zubaża każdy ruch. To, co wartościowe, dojrzewa — i dłonie o tym wiedzą.',
  },
  {
    id: 177, chapterId: 15, pack: 'jadePath', title: 'Mapa Bez Atramentu',
    difficulty: 4, mode: 'normal',
    text: 'Dostałem mapę bez atramentu. Żadnych oznaczeń, żadnych strzałek. Mistrz powiedział, że droga pojawi się dopiero wtedy, gdy zacznę iść. Zrobiłem pierwszy krok. Mapa nadal była pusta. Bardzo zabawne, mistrzu, bardzo wygodne.',
  },
  {
    id: 178, chapterId: 15, pack: 'jadePath', title: 'Trzy Oddechy',
    difficulty: 4, mode: 'normal',
    text: 'Pierwszy oddech uspokaja ciało. Drugi porządkuje myśli. Trzeci cofa mnie do siebie — dalej od hałasu, bliżej rytmu. Czwarty przypomina, że nie muszę wygrać rundy, żeby ją dobrze przeżyć. I to wystarcza.',
  },
  {
    id: 179, chapterId: 15, pack: 'jadePath', title: 'Księga Bez Tytułu',
    difficulty: 4, mode: 'normal',
    text: 'Księga nie miała tytułu, bo każdy uczeń musiał nadać jej własny sens. Niektórzy szukali go latami. Moja zaczęła się od prostego zdania: wracaj do rytmu. Nie wiedziałem, że to wystarczy, żeby zacząć.',
  },
  {
    id: 180, chapterId: 15, pack: 'jadePath', title: 'Ostatnia Próba',
    difficulty: 4, mode: 'normal',
    text: 'Ostatnia próba nie sprawdzała siły. Sprawdzała coś innego: czy po porażce potrafię wstać bez teatralnego cierpienia i zrobić następny krok. Upadłem. Wstałem. Powtórzyłem. To było wszystko, czego chcieli.',
  },
  {
    id: 181, chapterId: 15, pack: 'jadePath', title: 'Czerwony Pył',
    difficulty: 4, mode: 'normal',
    text: 'Czerwony pył unosił się po walce, ale najważniejsze było to, co zostało po nim: cisza, oddech i decyzja, żeby nie wracać do chaosu. Nie zwycięstwo i nie klęska — tylko spokój, który zostaje, gdy bitwa odpływa.',
  },
  {
    id: 182, chapterId: 15, pack: 'jadePath', title: 'Mistrz Klawiatury',
    difficulty: 4, mode: 'normal',
    text: 'Mistrz klawiatury nie wali w klawisze. Dotyka ich jak ktoś, kto wie, że każdy znak jest małą bramą — i że brama nie lubi być forsowana. Za tym gestem stoi intencja i spokój. Pretensjonalne? Może. Ale działa.',
  },
  {
    id: 183, chapterId: 15, pack: 'jadePath', title: 'Siedem Bram',
    difficulty: 4, mode: 'normal',
    text: 'Przeszedłem przez siedem bram. Za każdą czekała ta sama lekcja w innym przebraniu: mniej napięcia, więcej obecności, spokojniejszy powrót. Różniły się tylko stroje i dekoracje. W środku zawsze to samo pytanie i ta sama cisza.',
  },
  {
    id: 184, chapterId: 15, pack: 'jadePath', title: 'Wojownik Nie Ucieka',
    difficulty: 4, mode: 'normal',
    text: 'Wojownik nie ucieka przed własnym błędem. Patrzy na niego, uczy się z niego i idzie dalej. Bez dramatu, bez fanfar, bez robienia miny do plakatu. Błąd to tylko informacja — nie wyrok, nie wstyd. Dostaje ją, przetwarza i wraca do ruchu.',
  },
  {
    id: 185, chapterId: 15, pack: 'jadePath', title: 'Światło Na Ostrzu',
    difficulty: 4, mode: 'normal',
    text: 'Światło zatrzymało się na ostrzu tylko przez chwilę. Nie szukało niczego. Nie starało się błyszczeć. Po prostu trwało w miejscu i to wystarczyło, żeby zobaczyć, że prawdziwa precyzja jest spokojna.',
  },
  {
    id: 186, chapterId: 15, pack: 'jadePath', title: 'Kropla Atramentu',
    difficulty: 4, mode: 'normal',
    text: 'Jedna kropla atramentu spadła na papier i zmieniła cały znak. Nikt nie planował tej chwili — a jednak wszystko wyglądało inaczej niż przed chwilą. Jedna decyzja potrafi zrobić to samo z całym dniem.',
  },
  {
    id: 187, chapterId: 15, pack: 'jadePath', title: 'Niebo Po Burzy',
    difficulty: 4, mode: 'normal',
    text: 'Niebo po burzy nie tłumaczy się z grzmotów. Po prostu robi się jasne — chmury się rozstępują i tyle. Może ja też nie muszę wracać do każdego starego chaosu i szukać w nim sensu. Czasem wystarczy poczekać.',
  },
  {
    id: 188, chapterId: 15, pack: 'jadePath', title: 'Krąg Uczniów',
    difficulty: 4, mode: 'normal',
    text: 'W kręgu uczniów każdy chciał wyglądać spokojnie. Ramiona opuszczone, oczy lekko przymrużone, poza idealna. Tylko jeden naprawdę oddychał — zwyczajnie, bez starania. I oczywiście ten jeden pisał najlepiej. Irytująca legenda.',
  },
  {
    id: 189, chapterId: 15, pack: 'jadePath', title: 'Stary Dzwon',
    difficulty: 4, mode: 'normal',
    text: 'Stary dzwon zabrzmiał raz i wszyscy zamilkli. Nie dlatego, że był głośny. Dlatego, że jego dźwięk miał środek. Taki, w którym można się zatrzymać i poczuć, że cisza też ma swoją wagę.',
  },
  {
    id: 190, chapterId: 15, pack: 'jadePath', title: 'Złoty Smok',
    difficulty: 5, mode: 'normal',
    text: 'Złoty smok nie pilnował skarbu. Pilnował wejścia do miejsca, w którym człowiek przestaje udawać, że brak cierpliwości jest charakterem. Za tym wejściem nie było złota. Było tylko to, czego pośpiech nie znosi — czas.',
  },

  // ── Rozdział 16 · Gaming Flow ────────────────────────────────────────────────
  {
    id: 191, chapterId: 16, pack: 'gaming', title: 'Pierwsza Baza',
    difficulty: 1, mode: 'normal',
    text: 'Buduję swoją bazę spokojnie. Najpierw fundament, potem ściany. Nie muszę mieć wszystkiego od razu. Każdy dzień dodaje jedną cegłę. Spokój jest moją metodą.',
  },
  {
    id: 192, chapterId: 16, pack: 'gaming', title: 'Respawn',
    difficulty: 1, mode: 'normal',
    text: 'Każdy błąd to respawn, nie koniec gry. Wracam do rundy, poprawiam rytm i gram dalej. Nie ma tu końca — jest tylko kolejna szansa.',
  },
  {
    id: 193, chapterId: 16, pack: 'gaming', title: 'Loot Cierpliwości',
    difficulty: 1, mode: 'normal',
    text: 'Najlepszy loot nie zawsze świeci od razu. Czasem kryje się w ciszy i skupieniu – w jednej dobrze podjętej decyzji. Spokój i dokładność to twój ekwipunek.',
  },
  {
    id: 194, chapterId: 16, pack: 'gaming', title: 'Tryb Kreatywny',
    difficulty: 2, mode: 'normal',
    text: 'W trybie kreatywnym nie chodzi o pośpiech. Chodzi o pomysł, rytm i odwagę, żeby zbudować coś po swojemu. Zatrzymaj się, złap flow i pozwól, żeby coś naprawdę powstało.',
  },
  {
    id: 195, chapterId: 16, pack: 'gaming', title: 'Strefa Się Zamyka',
    difficulty: 2, mode: 'normal',
    text: 'Strefa się zamyka, ale ja nie panikuję. Wybieram kierunek, oddycham spokojnie i robię następny ruch. Presja nie paraliżuje – ona tylko wyostrza moją koncentrację.',
  },
  {
    id: 196, chapterId: 16, pack: 'gaming', title: 'Checkpoint',
    difficulty: 2, mode: 'normal',
    text: 'Ten moment to checkpoint. Nie muszę zaczynać życia od zera. Wystarczy, że zrobię kolejny krok. Postęp nie musi być spektakularny – ważne, że idę do przodu.',
  },
  {
    id: 197, chapterId: 16, pack: 'gaming', title: 'Drużyna',
    difficulty: 2, mode: 'normal',
    text: 'Dobra drużyna nie krzyczy po pierwszym błędzie. Dobra drużyna mówi: spokojnie, gramy dalej. Błąd to sygnał, nie wyrok. Resety są dla mistrzów.',
  },
  {
    id: 198, chapterId: 16, pack: 'gaming', title: 'Nie Spamuj Klawiszy',
    difficulty: 2, mode: 'noBackspace',
    text: 'Nie spamuję klawiszy. Jeden ruch, jeden znak, jeden oddech. Szybkość przyjdzie, gdy ręce przestaną panikować. Spokój buduje rytm, rytm buduje tempo. Tak działają najlepsi.',
  },
  {
    id: 199, chapterId: 16, pack: 'gaming', title: 'Boss Walki',
    difficulty: 3, mode: 'normal',
    text: 'Każdy ma swojego bossa. Dla jednego to strach, dla drugiego chaos, dla mnie dzisiaj to klawiatura. Nie uciekam — siadam, patrzę w ekran i uczę się wygrywać.',
  },
  {
    id: 200, chapterId: 16, pack: 'gaming', title: 'Buduję Wyżej',
    difficulty: 3, mode: 'normal',
    text: 'Buduję wyżej, ale nie zapominam o fundamencie. Rząd domowy to moja baza. Tam wracają palce. Bez solidnego dołu górne rzędy nie mają sensu.',
  },
  {
    id: 201, chapterId: 16, pack: 'gaming', title: 'Mapa',
    difficulty: 3, mode: 'normal',
    text: 'Nie muszę widzieć całej mapy. Wystarczy najbliższy punkt, jeden dobry ruch i trochę odwagi. Reszta drogi wyłoni się sama, gdy zacznę iść naprzód.',
  },
  {
    id: 202, chapterId: 16, pack: 'gaming', title: 'Tryb Skupienia',
    difficulty: 3, mode: 'blindFlow',
    text: 'Ekran znika, ale mapa zostaje w głowie. Piszę z pamięci, spokojnie, jakbym znał tę drogę od dawna. Nie szukam klawiszy oczami – moje palce już wiedzą.',
  },
  {
    id: 203, chapterId: 16, pack: 'gaming', title: 'Bez Cofania',
    difficulty: 3, mode: 'noBackspace',
    text: 'Nie cofam każdego ruchu. Czasem trzeba zobaczyć całą trasę, zanim oceni się jeden krzywy skok. Błąd w połowie drogi bywa częścią planu, nie dowodem porażki.',
  },
  {
    id: 204, chapterId: 16, pack: 'gaming', title: 'Rzadki Skin',
    difficulty: 2, mode: 'normal',
    text: 'Najrzadszy skin to człowiek, który nie udaje. Spokojny, cierpliwy i trochę bardziej sobą każdego dnia. Nie zdobywa się go w sklepie – trzeba na niego zapracować w ciszy.',
  },
  {
    id: 205, chapterId: 16, pack: 'gaming', title: 'Crafting Spokoju',
    difficulty: 3, mode: 'normal',
    text: 'Craftuję spokój z małych rzeczy: oddechu, rytmu, cierpliwości i decyzji, żeby nie rzucać rundy po błędzie. To nie jest talent – to codzienny wybór, który robię na nowo przy każdym słowie.',
  },
  {
    id: 206, chapterId: 16, pack: 'gaming', title: 'Ostatnie Serce',
    difficulty: 3, mode: 'normal',
    text: 'Zostało ostatnie serce, ale to nie znaczy, że gra jest przegrana. Czasem wtedy człowiek gra najlepiej – presja usuwa zbędne myśli i zostaje tylko to, co naprawdę ważne.',
  },
  {
    id: 207, chapterId: 16, pack: 'gaming', title: 'Nie Rushuj',
    difficulty: 2, mode: 'normal',
    text: 'Nie rushuję bez planu. Najpierw patrzę, potem ruszam. Klawiatura lubi gracza, który myśli przed słowem, a nie po nim – bo szybkość to efekt skupienia, nie odwrotnie.',
  },
  {
    id: 208, chapterId: 16, pack: 'gaming', title: 'Level Up',
    difficulty: 2, mode: 'normal',
    text: 'Level up nie zawsze robi hałas. Czasem wygląda jak zwykła runda, w której zrobiłem o jeden błąd mniej. Cichy postęp – ale to właśnie on trzyma się najdłużej.',
  },
  {
    id: 209, chapterId: 16, pack: 'gaming', title: 'Tryb Przetrwania',
    difficulty: 3, mode: 'normal',
    text: 'Tryb przetrwania uczy prostych rzeczy: nie panikuj, zbieraj zasoby, wracaj do bazy i nie bij własnej klawiatury. Spokój i zimna krew to ekwipunek ważniejszy niż najlepszy miecz.',
  },
  {
    id: 210, chapterId: 16, pack: 'gaming', title: 'Legenda Serwera',
    difficulty: 4, mode: 'normal',
    text: 'Legenda serwera nie wygrywa dlatego, że nigdy nie przegrywa. Wygrywa, bo po każdej porażce wraca mądrzejsza i silniejsza. Przegrana to tylko kolejna lekcja do odrobienia.',
  },

  // ── Rozdział 19 · Cyfry ───────────────────────────────────────────────────────
  {
    id: 233, chapterId: 19, pack: 'numbers', title: '1 i 2',
    subtitle: 'lewy mały i pierścieniowy', difficulty: 1, mode: 'normal',
    text: '11 22 11 22 12 21 111 222 121 212 112 221 12 21 1221 2112 11 22 12 21 121 212 11 22 11 22 12 21 111 222 121 212 112 221 12 21',
    tags: ['cyfry'],
  },
  {
    id: 234, chapterId: 19, pack: 'numbers', title: '3 i 4',
    subtitle: 'środkowy i wskazujący', difficulty: 1, mode: 'normal',
    text: '33 44 33 44 34 43 333 444 343 434 334 443 34 43 3443 4334 33 44 34 43 343 434 33 44 33 44 34 43 333 444 343 434 334 443 34 43',
    tags: ['cyfry'],
  },
  {
    id: 235, chapterId: 19, pack: 'numbers', title: '5 — środek',
    subtitle: 'wskazujący sięga środka', difficulty: 1, mode: 'normal',
    text: '55 15 25 35 45 55 51 52 53 54 555 155 255 355 455 55 15 25 35 45 55 512 345 55 15 25 35 45 55 51 52 53 54 555 155 255 355',
    tags: ['cyfry'],
  },
  {
    id: 236, chapterId: 19, pack: 'numbers', title: '6 i 7',
    subtitle: 'prawa strona zaczyna', difficulty: 1, mode: 'normal',
    text: '66 77 66 77 67 76 666 777 676 767 667 776 67 76 6776 7667 66 77 67 76 676 767 66 77 66 77 67 76 666 777 676 767 667 776 67 76',
    tags: ['cyfry'],
  },
  {
    id: 237, chapterId: 19, pack: 'numbers', title: '8, 9 i 0',
    subtitle: 'prawy pierścieniowy i mały', difficulty: 1, mode: 'normal',
    text: '88 99 00 89 90 80 98 09 08 80 89 890 980 089 809 098 809 908 089 890 09 80 98 88 99 00 89 90 80 98 09 08 80 89 890 980 089 809',
    tags: ['cyfry'],
  },
  {
    id: 238, chapterId: 19, pack: 'numbers', title: 'Lewa ręka — 1 do 5',
    subtitle: 'pięć cyfr razem', difficulty: 1, mode: 'normal',
    text: '12345 54321 12345 54321 123 234 345 12 23 34 45 123 234 345 12345 54321 1234 12345 54321 12345 54321 123 234 345 12 23 34',
    tags: ['cyfry'],
  },
  {
    id: 239, chapterId: 19, pack: 'numbers', title: 'Prawa ręka — 6 do 0',
    subtitle: 'pięć cyfr razem', difficulty: 1, mode: 'normal',
    text: '67890 09876 67890 09876 678 789 890 67 78 89 90 678 789 890 67890 09876 6789 67890 09876 67890 09876 678 789 890 67 78 89',
    tags: ['cyfry'],
  },
  {
    id: 240, chapterId: 19, pack: 'numbers', title: 'Wszystkie cyfry',
    subtitle: 'cały rząd numeryczny', difficulty: 2, mode: 'normal',
    text: '1234567890 0987654321 123 456 789 0 12 34 56 78 90 1234 5678 90 12345 67890 1234567890 0987654321 123 456 789 0 12 34 56',
    tags: ['cyfry'],
  },
  {
    id: 241, chapterId: 19, pack: 'numbers', title: 'Daty',
    subtitle: 'cyfry w kontekście', difficulty: 2, mode: 'normal',
    text: '2025-06-19 2024-01-01 15-08-1945 01 02 03 04 05 06 07 08 09 10 11 12 2025 2025-06-19 2024-01-01 15-08-1945 01 02 03 04',
    tags: ['cyfry'],
  },
  {
    id: 242, chapterId: 19, pack: 'numbers', title: 'Numery i kody',
    subtitle: 'telefony, ceny, kody', difficulty: 2, mode: 'normal',
    text: '100 112 999 600-700-800 48 600 700 800 900 1234 5678 50 100 200 500 1000 2025 100 112 999 600-700-800 48 600 700 800 900 1234',
    tags: ['cyfry'],
  },

  // ── Rozdział 20 · Symbole ─────────────────────────────────────────────────────
  {
    id: 243, chapterId: 20, pack: 'symbols', title: 'Kropka i przecinek',
    subtitle: '. i , — najczęstsze symbole', difficulty: 1, mode: 'normal',
    text: 'tak. nie. jak. las, fal, dal, tak. jak, dal. fal, las. jak. sal, tak, las. tak. nie. jak. las, fal, dal, tak. jak, dal.',
    tags: ['symbole'],
  },
  {
    id: 244, chapterId: 20, pack: 'symbols', title: 'Wykrzyknik i pytajnik',
    subtitle: '! i ? — koniec zdania', difficulty: 1, mode: 'normal',
    text: 'Tak! Nie! Jak? Dal? Fal! Las? Tak! Jak? Nie! Las! Fal? Dal? Tak! Jak? Nie! Tak! Nie! Jak? Dal? Fal! Las? Tak! Jak? Nie!',
    tags: ['symbole'],
  },
  {
    id: 245, chapterId: 20, pack: 'symbols', title: 'Dwukropek i średnik',
    subtitle: ': i ; — listy i pauzy', difficulty: 1, mode: 'normal',
    text: 'tak: nie; jak: dal; fal: las; tak: jak; dal: fal; las: tak; jak: dal; fal: tak: nie; jak: dal; fal: las; tak: jak; dal:',
    tags: ['symbole'],
  },
  {
    id: 246, chapterId: 20, pack: 'symbols', title: 'Myślnik i podkreślnik',
    subtitle: '- i _ — łączenia', difficulty: 1, mode: 'normal',
    text: 'las-fal jak-dal tak-nie las_fal jak_dal tak_nie fal-las jak-dal las_fal jak-dal las-fal jak-dal tak-nie las_fal jak_dal tak_nie',
    tags: ['symbole'],
  },
  {
    id: 247, chapterId: 20, pack: 'symbols', title: 'Nawiasy',
    subtitle: '( i ) — wtrącenia', difficulty: 1, mode: 'normal',
    text: '(tak) (jak) (las) (dal) (fal) tak (las) jak (dal) (fal) jak (tak) (las dal) (tak) (jak) (las) (dal) (fal) tak (las) jak (dal)',
    tags: ['symbole'],
  },
  {
    id: 248, chapterId: 20, pack: 'symbols', title: 'Cudzysłów',
    subtitle: '" i \' — cytowanie', difficulty: 2, mode: 'normal',
    text: '"tak" "jak" "las" "dal" "fal" jak "tak" las "dal" fal "jak" tak "las" jak "dal" "tak" "jak" "las" "dal" "fal" jak "tak" las "dal"',
    tags: ['symbole'],
  },
  {
    id: 249, chapterId: 20, pack: 'symbols', title: 'Procent i małpa',
    subtitle: '% i @ — cyfry i e-mail', difficulty: 2, mode: 'normal',
    text: '50% 100% 25% 75% 10% 90% user@mail.com admin@wp.pl 50% kontakt@flowkeys.pl 25% 50% 100% 25% 75% 10% 90% user@mail.com admin@wp.pl',
    tags: ['symbole'],
  },
  {
    id: 250, chapterId: 20, pack: 'symbols', title: 'Ukośniki i hash',
    subtitle: '/ \\ # — ścieżki i tagi', difficulty: 2, mode: 'normal',
    text: 'tak/nie las/fal 100/200 a/b c/d #tak #jak #las #fal #dal tak/nie las/fal 50/100 tak/nie las/fal 100/200 a/b c/d #tak #jak #las',
    tags: ['symbole'],
  },
  {
    id: 251, chapterId: 20, pack: 'symbols', title: 'Zdanie z interpunkcją',
    subtitle: 'łączę wszystkie symbole', difficulty: 2, mode: 'normal',
    text: 'Jak tak, to tak! Las, fal i dal. Nie ma tak: jak tak. Jak? Tak! Las (fal) dal. Jak tak, to tak! Las, fal i dal. Nie ma tak: jak',
    tags: ['symbole'],
  },
  {
    id: 252, chapterId: 20, pack: 'symbols', title: 'Symbole w kontekście',
    subtitle: 'pełna runda z symbolami', difficulty: 3, mode: 'normal',
    text: 'Cena: 100 zł (50%). Zadzwoń: 600-700-800. Więcej na: flowkeys.pl/start! (2025) Cena: 100 zł (50%). Zadzwoń: 600-700-800. Więcej',
    tags: ['symbole'],
  },

  // ── Rozdział 21 · Górny Rząd ─────────────────────────────────────────────────
  {
    id: 253, chapterId: 21, pack: 'homerow', title: 'Q — mały palec lewy',
    subtitle: 'mały palec sięga w górę', difficulty: 2, mode: 'normal',
    text: 'qaq qsq qdq qfq qaq qsq qdq qfq aqa sqs dqd fqf qas qad qak qal qaj qaq qsq qdq qfq qaq qsq qdq qfq aqa sqs',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 254, chapterId: 21, pack: 'homerow', title: 'P — mały palec prawy',
    subtitle: 'prawy mały sięga w górę', difficulty: 2, mode: 'normal',
    text: 'pal pas pak pad paj paw pal pak pad jak pal las paj pak pal pas pad paw pal pas pak pad paj paw pal pak pad jak pal',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 255, chapterId: 21, pack: 'homerow', title: 'Y — wskazujący prawy góra',
    subtitle: 'prawy wskazujący sięga po y', difficulty: 2, mode: 'normal',
    text: 'yaj yal yak yas yad yaf yaj yal yak jas las jak fay say day yak yal yaj yaj yal yak yas yad yaf yaj yal yak jas las',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 256, chapterId: 21, pack: 'homerow', title: 'U — wskazujący prawy góra',
    subtitle: 'kolejny prawy w górnym rzędzie', difficulty: 2, mode: 'normal',
    text: 'uka ula udo uje ura uku juk kuk luk uka ula jak udo uje las ura uku juk uka ula udo uje ura uku juk kuk luk uka ula',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 257, chapterId: 21, pack: 'homerow', title: 'Y i U razem',
    subtitle: 'obaj wskazujący w górze', difficulty: 2, mode: 'normal',
    text: 'yak ula yas udo yaj uje yal ura day juk ray kuk say luk yak ula yas udo yak ula yas udo yaj uje yal ura day juk ray',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 258, chapterId: 21, pack: 'homerow', title: 'Q i P razem',
    subtitle: 'obaj mali palce w górze', difficulty: 2, mode: 'normal',
    text: 'qal pal qas pas qak pak qad pad pal qal jak pal pas qad jak qal pal pas qal pal qas pas qak pak qad pad pal qal jak',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 259, chapterId: 21, pack: 'homerow', title: 'Górny rząd lewy',
    subtitle: 'q w e r t — lewa pięć', difficulty: 2, mode: 'normal',
    text: 'qwer wert ertq qwer rew tew wer ret ewq qwert rew wert qwer ertq ret rew qwer wert ertq qwer rew tew wer ret ewq qwert',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 260, chapterId: 21, pack: 'homerow', title: 'Górny rząd prawy',
    subtitle: 'y u i o p — prawa pięć', difficulty: 2, mode: 'normal',
    text: 'yuio uiop poiu yup opu iop poy yoi upo piu yuio iop poiu yup opu yoi yuio uiop poiu yup opu iop poy yoi upo piu',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 261, chapterId: 21, pack: 'homerow', title: 'Górny rząd — słowa',
    subtitle: 'polskie słowa z górnego rzędu', difficulty: 3, mode: 'normal',
    text: 'ryba typy wyry przy tryb ropy pory tory rysy wiry quiz pal yak ula pory ryba typy wyry przy tryb ropy pory tory rysy',
    tags: ['podstawy', 'górny-rząd'],
  },
  {
    id: 262, chapterId: 21, pack: 'homerow', title: 'Pełny górny rząd',
    subtitle: 'cały górny rząd razem', difficulty: 3, mode: 'normal',
    text: 'qwerty yuiop ryba typy pory quiz pal wiry tryb ropy tory wyry przy yak qwerty yuiop ryba typy pory quiz pal wiry',
    tags: ['podstawy', 'górny-rząd'],
  },

  // ── Rozdział 22 · Dolny Rząd ─────────────────────────────────────────────────
  {
    id: 263, chapterId: 22, pack: 'homerow', title: 'X — lewy serdeczny dół',
    subtitle: 'serdeczny sięga w dół', difficulty: 2, mode: 'normal',
    text: 'xax xsx xdx xfx xax xsx xdx xfx axa sxs dxd fxf max mix six tax xas xax xsx xdx xfx xax xsx xdx xfx axa sxs',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 264, chapterId: 22, pack: 'homerow', title: 'V — lewy wskazujący dół',
    subtitle: 'wskazujący sięga najniżej', difficulty: 2, mode: 'normal',
    text: 'vav vsv vdv vfv vav vsv vfv fvf vas vad vaf sva dva fva vav vas vad vaf vav vsv vdv vfv vav vsv vfv fvf vas vad vaf',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 265, chapterId: 22, pack: 'homerow', title: 'B — lewy wskazujący wewnętrzny',
    subtitle: 'wskazujący sięga najdalej w dół', difficulty: 2, mode: 'normal',
    text: 'baj bal bak bad baf bas baw baj bal las jak bak bad baf bas baw baj bal baj bal bak bad baf bas baw baj bal las jak',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 266, chapterId: 22, pack: 'homerow', title: 'M — prawy wskazujący dół',
    subtitle: 'prawy wskazujący w dół', difficulty: 2, mode: 'normal',
    text: 'mam mal mak maj maf mas maw mam mal jak mak maj maf mas maw mam mal mak mam mal mak maj maf mas maw mam mal jak mak',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 267, chapterId: 22, pack: 'homerow', title: 'X i V razem',
    subtitle: 'dwa palce w dolnym rzędzie', difficulty: 2, mode: 'normal',
    text: 'vax xav vas xas vad xad vaf xaf max mix vax xav vas tax xas vad six xaf vax xav vas xas vad xad vaf xaf max mix vax',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 268, chapterId: 22, pack: 'homerow', title: 'B i M razem',
    subtitle: 'obaj wskazujący w dole', difficulty: 2, mode: 'normal',
    text: 'bam mab bas mas bad mad baf maf bam mab jak mal bal mak baj maj bam mab bam mab bas mas bad mad baf maf bam mab jak',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 269, chapterId: 22, pack: 'homerow', title: 'Dolny rząd lewy',
    subtitle: 'z x c v b — lewa pięć', difficulty: 3, mode: 'normal',
    text: 'zxc xcv cvb zxcv xcvb zxcvb cvbz vbzx bxcv zxc xcv cvb zxcv xcvb zxc zxc xcv cvb zxcv xcvb zxcvb cvbz vbzx bxcv',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 270, chapterId: 22, pack: 'homerow', title: 'Dolny rząd prawy',
    subtitle: 'n m — prawa część', difficulty: 2, mode: 'normal',
    text: 'nam man nab mab naj maj nak mak nal mal naf maf nas mas nam jak man mak nam man nab mab naj maj nak mak nal mal naf',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 271, chapterId: 22, pack: 'homerow', title: 'Dolny rząd — słowa',
    subtitle: 'polskie słowa z dolnego rzędu', difficulty: 3, mode: 'normal',
    text: 'baw veto mix box nami ceny bazy mamy max taxi mam baj mal mak bal mas baw veto mix box nami ceny bazy mamy max',
    tags: ['podstawy', 'dolny-rząd'],
  },
  {
    id: 272, chapterId: 22, pack: 'homerow', title: 'Trzy rzędy razem',
    subtitle: 'pełna klawiatura — rytm wszystkich rzędów', difficulty: 3, mode: 'normal',
    text: 'ryba mamy bazy przy tryb veto mix nami tory pory quiz pal las jak dal ryba mamy bazy przy tryb veto mix nami tory',
    tags: ['podstawy', 'trzy-rzędy'],
  },

  // ── Rozdział 23 · Tablice Szmaragdowe Thotha ──────────────────────────────
  {
    id: 273, chapterId: 23, pack: 'emeraldTablets', title: 'Ja, Thoth, Atlantyda',
    difficulty: 2, mode: 'normal',
    text: 'Ja, Thoth, Atlantyda, mistrz tajemnic, piszę te słowa dla tych, którzy szukają Światła w ciemności wieków. Niech ta mądrość będzie pochodnią na ich ścieżce ku prawdzie.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 274, chapterId: 23, pack: 'emeraldTablets', title: 'Ciało Jest Pojemnikiem',
    difficulty: 2, mode: 'normal',
    text: 'Ciało jest pojemnikiem dla duszy, nie samą duszą. Gdy ciało się starzeje i słabnie, dusza pozostaje młoda i nienaruszona. Kto to pojmie, wyzwoli się z lęku przed przemijaniem.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 275, chapterId: 23, pack: 'emeraldTablets', title: 'Komnaty Amenti',
    difficulty: 2, mode: 'normal',
    text: 'Głęboko w Ziemi leżą Komnaty Amenti, gdzie Wielcy Mistrzowie ważą dusze i mierzą Światło ukryte w każdej istocie. Tam, w ciemności bez czasu, każda ścieżka życia staje się jawna.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 276, chapterId: 23, pack: 'emeraldTablets', title: 'Śmierć Jest Iluzją',
    difficulty: 2, mode: 'normal',
    text: 'Śmierć jest tylko przejściem, nie końcem. Dusza przechodzi z formy w formę, jakby zmieniała szatę, nie siebie. Esencja trwa niezmieniona przez wszystkie wcielenia, wolna od lęku i utraty.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 277, chapterId: 23, pack: 'emeraldTablets', title: 'Klucz Do Mądrości',
    difficulty: 2, mode: 'normal',
    text: 'Mądrość nie jest gromadzona jak złoto. Jest Światłem, które zapala się w duszy, gdy umysł przestaje walczyć z ciszą. Nie zdobywa się jej — ona sama powstaje, gdy dusza staje się wolna.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 278, chapterId: 23, pack: 'emeraldTablets', title: 'Myśl Tworzy',
    difficulty: 2, mode: 'normal',
    text: 'Czego szukasz całym sercem, to przyciągasz do swojego życia. Myśl jest siłą, która kształtuje materię i zdarzenia. Strzeż więc swoich pragnień, bo stają się mostem między duchem a światem.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 279, chapterId: 23, pack: 'emeraldTablets', title: 'Starsi Bracia',
    difficulty: 2, mode: 'normal',
    text: 'Starsi Bracia istnieją w przestrzeni poza widzialnym. Ich obecność nie jest dana każdemu — tylko ten, kto szuka Drogi z czystym sercem i spokojnym umysłem, może odczuć ich ciche, nieomylne prowadzenie.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 280, chapterId: 23, pack: 'emeraldTablets', title: 'Trzy Wielkie Prawa',
    difficulty: 3, mode: 'normal',
    text: 'Trzy Wielkie Prawa rządzą wszystkim, co jest i co będzie: Prawo Wibracji, Prawo Polaryzacji i Prawo Rytmu. Nic nie wymyka się ich zasięgowi. Poznaj je, a zrozumiesz przyczynę każdego zdarzenia.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 281, chapterId: 23, pack: 'emeraldTablets', title: 'Siła Słowa',
    difficulty: 2, mode: 'normal',
    text: 'Słowo wypowiedziane z intencją ma moc przekształcania rzeczywistości. Nie mów bezwiednie — każde słowo wraca do tego, kto je rzucił. Siej słowa jak ziarno: z uwagą, pokorą i pełną świadomością.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 282, chapterId: 23, pack: 'emeraldTablets', title: 'Siedmiu Panów Czasu',
    difficulty: 3, mode: 'normal',
    text: 'Siedmiu Panów Czasu strzeże bram pomiędzy wymiarami. Nie można minąć żadnej z nich pośpiechem ani siłą. Każdy z nich naucza innej lekcji — dopóki jej nie pojmiesz, wrota pozostają zamknięte.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 283, chapterId: 23, pack: 'emeraldTablets', title: 'Klucz Do Tajemnic',
    difficulty: 2, mode: 'normal',
    text: 'W sercu tajemnic leży prostota. To, czego szukasz od tysiącleci, mieszka w ciszy twojego własnego oddechu. Prawda nie kryje się w odległych miejscach — czeka tam, gdzie zawsze byłeś.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 284, chapterId: 23, pack: 'emeraldTablets', title: 'Klucz Do Wolności',
    difficulty: 2, mode: 'normal',
    text: 'Wolność nie jest na zewnątrz. Jest stanem duszy, która nie przywiązuje się do skutków ani nie lęka się zmiany. Rodzi się w chwili, gdy przestajesz walczyć z tym, co jest, i pozwalasz życiu płynąć.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 285, chapterId: 23, pack: 'emeraldTablets', title: 'Czas Jest Spiralą',
    difficulty: 2, mode: 'normal',
    text: 'Czas nie jest linią prostą. Jest spiralą, która powraca do podobnych punktów na wyższym poziomie zrozumienia. Każdy powrót przynosi nową mądrość i głębsze widzenie tego, co dawniej wydawało się znajome.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 286, chapterId: 23, pack: 'emeraldTablets', title: 'Jak Górze, Tak I Dole',
    difficulty: 3, mode: 'normal',
    text: 'Co jest powyżej, to i poniżej. Co wewnątrz, to i na zewnątrz. Makrokosmos i mikrokosmos mają ten sam rytm i tę samą naturę. W każdym atomie drzemie obraz wszechświata, a w każdym oddechu rozbrzmiewa echo wieczności.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },
  {
    id: 287, chapterId: 23, pack: 'emeraldTablets', title: 'Nie Ma Przypadku',
    difficulty: 2, mode: 'normal',
    text: 'Każde zdarzenie ma przyczynę, a każda przyczyna rodzi skutek. Nie ma przypadku — jest tylko Prawo niewidzialne dla oczu, lecz wpisane w samą naturę bytu. Każdy czyn wraca do swego źródła jak fala do brzegu.',
    tags: ['hermetyzm', 'tablice-szmaragdowe'],
  },

  // ── Rozdział 24 · Bhagavad Gita ───────────────────────────────────────────
  {
    id: 288, chapterId: 24, pack: 'bhagavadGita', title: 'Dusza Nigdy Nie Umiera',
    difficulty: 2, mode: 'normal',
    text: 'Dusza nigdy się nie rodzi i nigdy nie umiera. Jest wieczna jak przestrzeń, w której wszystko powstaje i zanika. To, co wygląda jak śmierć, jest tylko zmianą formy — nie końcem, lecz przejściem w nową postać istnienia.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 289, chapterId: 24, pack: 'bhagavadGita', title: 'Działaj Bez Przywiązania',
    difficulty: 2, mode: 'normal',
    text: 'Wypełniaj swój obowiązek, nie przywiązując się do owoców swoich czynów. Działanie bez żądzy nagrody jest najwyższą mądrością — wtedy czyn staje się czysty, a duch pozostaje wolny i niezachwiany.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 290, chapterId: 24, pack: 'bhagavadGita', title: 'Jestem We Wszystkim',
    difficulty: 2, mode: 'normal',
    text: 'Jestem w ogniu, w wodzie, w sercu każdej istoty i w przestrzeni między gwiazdami. Kto widzi Mnie we wszystkim i wszędzie — w świetle i ciszy — ten nigdy nie jest sam.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 291, chapterId: 24, pack: 'bhagavadGita', title: 'Własna Dharma',
    difficulty: 2, mode: 'normal',
    text: 'Lepiej spełniać własną dharmę wadliwie niż cudzą doskonale. Każda dusza ma swoją niepowtarzalną ścieżkę. Twoja droga, nawet usiana potknięciami i błędami, jest jedyną prawdziwą drogą dla ciebie.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 292, chapterId: 24, pack: 'bhagavadGita', title: 'Spokojny Umysł',
    difficulty: 2, mode: 'normal',
    text: 'Spokojny umysł jest jak jezioro w bezwietrzny dzień — odbija świat wiernie i czysto. Wzburzone myśli wypaczają każdą prawdę. Tylko w ciszy, wolni od strachu i pożądania, widzimy rzeczy takimi, jakie są naprawdę.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 293, chapterId: 24, pack: 'bhagavadGita', title: 'Ponad Śmiercią I Żalem',
    difficulty: 2, mode: 'normal',
    text: 'Wznieś swój umysł ponad śmierć i żal. To, czym naprawdę jesteś, nie ginie — trwa wiecznie poza wszelką zmianą. Jesteś nieśmiertelną duszą, nie tylko ciałem, które kiedyś przeminie i powróci w nowej postaci.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 294, chapterId: 24, pack: 'bhagavadGita', title: 'Narzędzie Bożej Woli',
    difficulty: 2, mode: 'normal',
    text: 'Nie myśl o sobie jak o sprawcy. Bądź narzędziem wyższej woli. Działaj pełnią sił i z całym oddaniem, lecz wynik złóż spokojnie w ręce wyższej mądrości — tam, gdzie zawsze należał.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 295, chapterId: 24, pack: 'bhagavadGita', title: 'Wiedza I Działanie',
    difficulty: 2, mode: 'normal',
    text: 'Wiedza bez działania jest martwa. Działanie bez wiedzy jest ślepe. Dopiero gdy myśl i czyn stają się jednym, rodzi się prawdziwa mądrość. Tylko razem prowadzą do wyzwolenia.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 296, chapterId: 24, pack: 'bhagavadGita', title: 'Wolny Od Lęku',
    difficulty: 2, mode: 'normal',
    text: 'Ten, kto nie lęka się bólu i nie pożąda przyjemności, wyzwolił się z władzy zmysłów. Jest wolny od złudzeń, niezachwiany pośród burz życia i bliski prawdziwej mądrości.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 297, chapterId: 24, pack: 'bhagavadGita', title: 'Trzy Filary Wojownika',
    difficulty: 2, mode: 'normal',
    text: 'Wytrwałość, spokój i odwaga — to trzy filary wojownika ducha. Nie można ich rozdzielić — gdy jeden słabnie, pozostałe drżą. Każdy z nich wzmacnia pozostałe dwa.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 298, chapterId: 24, pack: 'bhagavadGita', title: 'Wszystkie Rzeki',
    difficulty: 2, mode: 'normal',
    text: 'Jak rzeki wpływają do morza, tak wszystkie ścieżki prowadzą do Jedności. Nie pytaj, którą drogą idziesz — pytaj, czy idziesz ku Światłu. Droga nie jest ważna — kierunek tak.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 299, chapterId: 24, pack: 'bhagavadGita', title: 'Strzeż Myśli',
    difficulty: 2, mode: 'normal',
    text: 'Gdzie jest twoja myśl, tam jest twoje życie. Strzeż umysłu jak skarbu. To twój najważniejszy ogród. Pielęgnuj go codziennie — w nim rośnie wszystko, czym jesteś.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 300, chapterId: 24, pack: 'bhagavadGita', title: 'Złóż Wszystko',
    difficulty: 2, mode: 'normal',
    text: 'Złóż wszystko u moich stóp. Zostań wolnym od obaw o przeszłość i przyszłość. Żyj pełnią tej jednej, świętej chwili. Teraz jest jedyne miejsce, gdzie można mnie znaleźć.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 301, chapterId: 24, pack: 'bhagavadGita', title: 'Wewnętrzna Walka',
    difficulty: 2, mode: 'normal',
    text: 'Prawdziwa walka nie toczy się na polu bitwy. Toczy się w umyśle, między strachem a mądrością, między ego a duszą. Zwycięstwo nad sobą jest największym ze zwycięstw. Broń jest spokój.',
    tags: ['bhagavad-gita', 'wedanta'],
  },
  {
    id: 302, chapterId: 24, pack: 'bhagavadGita', title: 'Kriszna Mówi',
    difficulty: 3, mode: 'normal',
    text: 'Jestem początkiem i końcem. Jestem śmiercią i nieśmiertelnością. Jestem jedyną drogą dla tych, którzy szukają drogi. Poza mną nie ma miejsca, do którego możesz uciec ani wrócić.',
    tags: ['bhagavad-gita', 'wedanta'],
  },

  // ── Rozdział 25 · Tao Te Ching ────────────────────────────────────────────
  {
    id: 303, chapterId: 25, pack: 'taoTeching', title: 'Tao, Które Można Nazwać',
    difficulty: 2, mode: 'normal',
    text: 'Tao, które można wyrazić słowami, nie jest wiecznym Tao. Imię, które można wymówić, nie jest wiecznym Imieniem. Słowa są palcem wskazującym księżyc — nie samym księżycem.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 304, chapterId: 25, pack: 'taoTeching', title: 'Piękno I Brzydota',
    difficulty: 2, mode: 'normal',
    text: 'Gdy wszyscy wiedzą, że piękne jest pięknem, pojawia się już brzydota. Dobro rodzi pojęcie zła. To dwa oblicza tej samej rzeczy — nierozłączne jak cień i światło.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 305, chapterId: 25, pack: 'taoTeching', title: 'Woda I Kamień',
    difficulty: 2, mode: 'normal',
    text: 'Woda jest miękka i ustępliwa, lecz drąży każdy kamień. Nie walczy, a jednak zawsze zwycięża. Tak działa Tao — przez wytrwałość i cichą cierpliwość, nie przez siłę.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 306, chapterId: 25, pack: 'taoTeching', title: 'Prostota',
    difficulty: 1, mode: 'normal',
    text: 'Powróć do prostoty. Ograniczaj pragnienia. Miej mało — pragnij mało. Kto pragnie mniej, ten zyskuje więcej. W prostocie jest wolność i spokój ducha.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 307, chapterId: 25, pack: 'taoTeching', title: 'Kto Zna Siebie',
    difficulty: 2, mode: 'normal',
    text: 'Kto zna innych, jest mądry. Kto zna siebie, jest oświecony. Kto pokona innych, jest silny. Kto pokona siebie — potężny. Kto wytrwa w dążeniu, ma wolę. Kto umiera, lecz nie ginie — żyje wiecznie.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 308, chapterId: 25, pack: 'taoTeching', title: 'Działaj Niedziałaniem',
    difficulty: 2, mode: 'normal',
    text: 'Działaj bez działania. Czyń wszystko bez wysiłku. Smakuj bez smaku. Traktuj wielkie jak małe. Trudne zacznij od tego, co łatwe. W niedziałaniu kryje się prawdziwa moc.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 309, chapterId: 25, pack: 'taoTeching', title: 'Wielki Obraz',
    difficulty: 2, mode: 'normal',
    text: 'Wielki kwadrat nie ma narożników. Wielki dźwięk jest milczeniem. Wielki obraz nie ma kształtu. Wielka mądrość jest prosta jak głupota. Tao jest ukryte, lecz wszystkiemu daje siłę.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 310, chapterId: 25, pack: 'taoTeching', title: 'Najwyższe Dobro',
    difficulty: 2, mode: 'normal',
    text: 'Najwyższe dobro jest jak woda. Woda przynosi korzyść wszystkim bez walki. Trwa w miejscach, których inni unikają. Dlatego jest bliska Tao. Nie spiera się — i nie ma sobie równej.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 311, chapterId: 25, pack: 'taoTeching', title: 'Kto Staje Na Palcach',
    difficulty: 2, mode: 'normal',
    text: 'Kto staje na palcach, traci równowagę. Kto robi wielkie kroki, nie nadąża za sobą. Kto pędzi, ten wyprzedza siebie. Spokojny krok, dzień po dniu, dociera najdalej.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 312, chapterId: 25, pack: 'taoTeching', title: 'Prawdziwe Słowa',
    difficulty: 2, mode: 'normal',
    text: 'Prawdziwe słowa nie zawsze są piękne. Piękne słowa nie zawsze są prawdziwe. Za wieloma słowami często kryje się pustka. Mędrzec mówi rzadko, lecz każde jego słowo trafia w sedno.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 313, chapterId: 25, pack: 'taoTeching', title: 'Pustka Koła',
    difficulty: 2, mode: 'normal',
    text: 'Trzydzieści szprych zbiega się w piaście. Pustka pośrodku czyni koło użytecznym. Glina daje formę naczyniu, lecz to próżnia je użytecznia. Tak i pustka w nas jest głębią i siłą.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 314, chapterId: 25, pack: 'taoTeching', title: 'Wielka Droga',
    difficulty: 2, mode: 'normal',
    text: 'Wielka droga jest prosta, lecz ludzie upodobali sobie boczne ścieżki. Mnożą prawa i nakazy tam, gdzie wystarczyłoby milczenie. Im więcej zasad, tym więcej przestępców. Wróć do prostoty.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 315, chapterId: 25, pack: 'taoTeching', title: 'Droga Nieba',
    difficulty: 2, mode: 'normal',
    text: 'Droga nieba nie walczy, a jednak zawsze zwycięża. Nie mówi, a jednak wszystkim odpowiada. Nie woła, a wszystko przychodzi. Nie pośpiesza, lecz nic jej nie wyprzedza. Nie posiadając, zawiera wszystko.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 316, chapterId: 25, pack: 'taoTeching', title: 'Im Więcej Masz',
    difficulty: 2, mode: 'normal',
    text: 'Im więcej masz, tym więcej tracisz. Im więcej chwytasz, tym mniej trzymasz. Mędrzec nie gromadzi, lecz im więcej daje innym, tym więcej sam posiada. Takie jest prawo Tao.',
    tags: ['taoizm', 'tao-te-ching'],
  },
  {
    id: 317, chapterId: 25, pack: 'taoTeching', title: 'Bądź Cichy',
    difficulty: 1, mode: 'normal',
    text: 'Bądź cichy, a Tao przemówi w tobie. Bądź pusty, a Tao napełni cię. Bądź spokojny, a Tao poruszy przez ciebie. Bądź miękki jak woda, a Tao uczyni cię niezwyciężonym.',
    tags: ['taoizm', 'tao-te-ching'],
  },
]

import type { TransformMode } from './types'

export const SYSTEM_PROMPT = `Jesteś edytorem tekstów treningowych do nauki pisania na klawiaturze. Tworzysz teksty naturalne, osobiste, płynne i łatwe do przepisywania. Nie dodawaj moralizowania. Nie zmieniaj faktów bez potrzeby. Zachowuj sens materiału użytkownika. Nie rozbudowuj przesadnie tekstu — zachowaj zwięzłość. Odpowiadaj wyłącznie gotowym tekstem — bez komentarzy, bez wstępów.`

export function getUserPrompt(text: string, mode: TransformMode): string {
  switch (mode) {
    case 'clean':
      return `Popraw poniższy tekst językowo: interpunkcję, literówki i składnię. Zachowaj styl i sens autora.\n\n${text}`
    case 'story':
      return `Zamień poniższy materiał w krótką, naturalną opowieść z początkiem, środkiem i zakończeniem. Zachowaj fakty, uporządkuj narrację. Maksymalnie 120–150 słów.\n\n${text}`
    case 'exercise':
      return `Zrób z poniższego materiału tekst do ćwiczenia pisania na klawiaturze. Krótkie zdania, naturalny rytm, 120–200 słów. Tekst ma być łatwy do przepisywania i przyjemny w czytaniu. Nie wydłużaj niepotrzebnie.\n\n${text}`
    case 'polish_chars':
      return `Zrób zwięzłą wersję treningową poniższego tekstu z więcej polskich znaków diakrytycznych (ą, ć, ę, ł, ń, ó, ś, ź, ż), ale nadal brzmiącą naturalnie. Maksymalnie 100–130 słów.\n\n${text}`
    default:
      return text
  }
}

export const EXAMPLE_TEXT = `Wczoraj wróciłem późno z pracy. Na stole leżała kartka od mamy — zostawiła zupę w garnku. Pies spał zwinięty przy kaloryferze, nawet nie wstał na przywitanie. Usiadłem w ciemności i zjadłem zupę na zimno. Było dobrze.`

import { lessonTextsEN } from '@/data/lesson-texts-en'
import { lessonTextsDE } from '@/data/lesson-texts-de'
import { lessonTextsES } from '@/data/lesson-texts-es'

const LOCALE_TEXTS: Record<string, Record<number, string>> = {
  en: lessonTextsEN,
  de: lessonTextsDE,
  es: lessonTextsES,
}

export function getLocalizedLessonText(lessonId: number, locale: string): string | undefined {
  return LOCALE_TEXTS[locale]?.[lessonId]
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import CatPawCursor from '@/components/CatPawCursor'

export async function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const t = (messages as Record<string, Record<string, string>>)

  const descriptions: Record<string, string> = {
    pl: 'Ucz się pisać na klawiaturze, przepisując własne historie.',
    en: 'Learn to type by rewriting your own stories.',
    de: 'Lerne Tippen, indem du deine eigenen Geschichten abtippst.',
    es: 'Aprende a escribir reproduciendo tus propias historias.',
  }
  const desc = descriptions[locale] ?? descriptions.pl

  return {
    metadataBase: new URL('https://flow-keys.vercel.app'),
    title: 'FlowKeys',
    description: desc,
    manifest: '/manifest.webmanifest',
    openGraph: {
      title: 'FlowKeys',
      description: desc,
      url: 'https://flow-keys.vercel.app',
      siteName: 'FlowKeys',
      type: 'website',
      images: [{ url: 'https://flow-keys.vercel.app/og.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FlowKeys',
      description: desc,
      images: ['https://flow-keys.vercel.app/og.png'],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'FlowKeys',
    },
    other: { 'mobile-web-app-capable': 'yes' },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CatPawCursor />
      {children}
    </NextIntlClientProvider>
  )
}

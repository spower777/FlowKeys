import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from 'next-intl/server'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#0d0d0d',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('flowkeys_theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');var p=localStorage.getItem('flowkeys_preset')||'classic';document.documentElement.setAttribute('data-preset',p);})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');` }} />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}

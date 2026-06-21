import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CatPawCursor from "@/components/CatPawCursor";

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

export const metadata: Metadata = {
  metadataBase: new URL('https://flow-keys.vercel.app'),
  title: 'FlowKeys',
  description: 'Ucz się pisać na klawiaturze, przepisując własne historie.',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'FlowKeys',
    description: 'Ucz się pisać na klawiaturze, przepisując własne historie.',
    url: 'https://flow-keys.vercel.app',
    siteName: 'FlowKeys',
    type: 'website',
    images: [{ url: 'https://flow-keys.vercel.app/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowKeys',
    description: 'Ucz się pisać na klawiaturze, przepisując własne historie.',
    images: ['https://flow-keys.vercel.app/og.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FlowKeys',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('flowkeys_theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');` }} />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
        <CatPawCursor />
        {children}
      </body>
    </html>
  );
}

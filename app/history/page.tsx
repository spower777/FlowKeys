import Link from 'next/link'
import SessionHistory from '@/components/SessionHistory'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Historia — FlowKeys' }

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-bold">Historia sesji</h1>
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition">
            ← Powrót
          </Link>
        </div>
        <SessionHistory />
      </div>
    </main>
  )
}

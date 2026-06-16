import Header from '@/components/Header'
import SessionHistory from '@/components/SessionHistory'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Historia — FlowKeys' }

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <Header />
        <h2 className="text-lg font-semibold mb-6">Historia sesji</h2>
        <SessionHistory />
      </div>
    </main>
  )
}

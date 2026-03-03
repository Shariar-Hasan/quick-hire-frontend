import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find Jobs — QuickHire',
  description: 'Browse thousands of open positions across all industries. Filter by job type, location, category and more.',
  openGraph: {
    title: 'Find Jobs — QuickHire',
    description: 'Browse thousands of open positions across all industries.',
    type: 'website',
  },
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children
}

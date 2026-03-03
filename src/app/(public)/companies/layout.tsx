import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Companies — QuickHire',
  description: 'Explore top companies hiring now. Discover company culture, team size, and open positions.',
  openGraph: {
    title: 'Browse Companies — QuickHire',
    description: 'Explore top companies hiring now on QuickHire.',
    type: 'website',
  },
}

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return children
}

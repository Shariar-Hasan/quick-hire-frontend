import type { Metadata } from 'next'

interface Props {
  params: Promise<{ jobId: string }>
}

async function fetchJob(jobId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    const res = await fetch(`${apiUrl}/job/slug/${jobId}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jobId } = await params
  const job = await fetchJob(jobId)

  if (!job) {
    return {
      title: 'Apply — QuickHire',
      description: 'Submit your application on QuickHire.',
    }
  }

  const company = job.company?.name ?? 'QuickHire'
  const title = `Apply for ${job.title} at ${company} — QuickHire`
  const description = `Submit your resume and cover letter for the ${job.title} position at ${company}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children
}

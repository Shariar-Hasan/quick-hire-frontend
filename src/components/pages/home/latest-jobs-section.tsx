import JobCard from '@/components/shared/JobCard'
import { Job } from '@/types/models/job.model'
import { Briefcase } from 'lucide-react'
import Link from 'next/link'

async function getLatestJobs(): Promise<Job[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'
    const res = await fetch(
      `${apiUrl}/job?page=1&limit=8&status=PUBLISHED&sortBy=created_at&sortOrder=DESC`,
      { cache: 'no-store' }
    )
    const json = await res.json()
    return json.data?.data ?? []
  } catch {
    return []
  }
}

export default async function LatestJobs() {
  const jobs = await getLatestJobs()

  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Latest jobs open</h2>
          <Link href="/jobs" className="text-sm font-medium text-primary hover:underline">
            View all jobs →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No jobs available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} isLatest />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
import JobCard from '@/components/shared/JobCard'
import { Job } from '@/types/models/job.model'
import Link from 'next/link'

async function getFeaturedJobs(): Promise<Job[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'
    const res = await fetch(
      `${apiUrl}/job?page=1&limit=8&status=PUBLISHED&is_featured=true`,
      { cache: 'no-store' }
    )
    const json = await res.json()
    return json.data?.data ?? []
  } catch {
    return []
  }
}

export default async function FeaturedJobs() {
  const jobs = await getFeaturedJobs()
  if (jobs.length === 0) return null

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured jobs</h2>
          <Link href="/jobs" className="text-sm font-medium text-primary hover:underline">
            View all jobs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
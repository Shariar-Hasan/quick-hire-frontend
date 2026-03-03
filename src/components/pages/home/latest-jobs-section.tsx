'use client'

import JobCard from '@/components/shared/JobCard'
import { jobService } from '@/services/job.service'
import { Job } from '@/types/models/job.model'
import { Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LatestJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobService
      .findAll({ page: 1, limit: 8, status: 'PUBLISHED' })
      .then(({ data, error }) => {
        if (!error) setJobs(data?.data.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Latest jobs open</h2>
          <Link href="/jobs" className="text-sm font-medium text-primary hover:underline">
            View all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-5 animate-pulse h-48" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No jobs available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
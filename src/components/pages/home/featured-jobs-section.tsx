'use client'

import JobCard from '@/components/shared/JobCard'
import { jobService } from '@/services/job.service'
import { Job } from '@/types/models/job.model'
import { Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobService
      .findAll({ page: 1, limit: 6, status: 'PUBLISHED', is_featured: true })
      .then(({ data, error }) => {
        if (!error) setJobs(data?.data.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (!loading && jobs.length === 0) return null

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured jobs</h2>
          <Link href="/jobs" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-5 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
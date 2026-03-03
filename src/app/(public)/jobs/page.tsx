'use client'

import { AppTable } from '@/components/dashboard/AppTable'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Asset } from '@/lib/asset'
import Str from '@/lib/str'
import { categoryService } from '@/services/category.service'
import { jobService } from '@/services/job.service'
import { locationService } from '@/services/location.service'
import { Job } from '@/types/models/job.model'
import { JobType, RemoteType } from '@/types/models/enum'
import { DropDownType } from '@/types/table-types'
import { Briefcase, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const jobTypeLabel: Record<JobType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
}

const remoteTypeLabel: Record<RemoteType, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
}

const jobTypeOptions = Object.entries(jobTypeLabel).map(([value, label]) => ({ value, label }))
const remoteTypeOptions = Object.entries(remoteTypeLabel).map(([value, label]) => ({ value, label }))

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  const sym = currency === 'USD' ? '$' : '৳'
  if (min && max) return `${sym}${min.toLocaleString()} – ${sym}${max.toLocaleString()}`
  if (!min && max) return `Up to ${sym}${max.toLocaleString()}`
  if (min && !max) return `From ${sym}${min.toLocaleString()}`
  return null
}

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState('')
  const [jobType, setJobType] = useState('')
  const [remoteTypes, setRemoteTypes] = useState<string[]>([])
  const [locationId, setLocationId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [locationOptions, setLocationOptions] = useState<{ value: string; label: string }[]>([])
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 12

  useEffect(() => {
    Promise.all([
      locationService.findAllForDropDown(),
      categoryService.findAllForDropDown(),
    ]).then(([locRes, catRes]) => {
      if (!locRes.error)
        setLocationOptions((locRes.data?.data ?? []).map((d: DropDownType) => ({ value: String(d.id), label: d.label })))
      if (!catRes.error)
        setCategoryOptions((catRes.data?.data ?? []).map((d: DropDownType) => ({ value: String(d.id), label: d.label })))
    })
  }, [])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await jobService.findAll({
        page,
        limit,
        search: search || undefined,
        status: 'PUBLISHED',
        job_type: jobType || undefined,
        remote_type: remoteTypes.length === 1 ? remoteTypes[0] : undefined,
        location_id: locationId || undefined,
        category_id: categoryId || undefined,
      })
      if (!error) {
        setJobs(data?.data.data ?? [])
        setTotal(data?.data.meta.total ?? 0)
      }
    } finally {
      setLoading(false)
    }
  }, [page, search, jobType, remoteTypes, locationId, categoryId])

  useEffect(() => { fetchJobs() }, [fetchJobs])
  useEffect(() => { setPage(1) }, [search, jobType, remoteTypes, locationId, categoryId])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Find Your Next Job</h1>
        <p className="text-muted-foreground text-lg">Browse {total} open positions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <AppTable.FilterItem
          type="text"
          placeholder="Search jobs by title..."
          value={search}
          debounce
          delay={400}
          clearable
          className="min-w-60 flex-1"
          onChange={(val) => setSearch(val)}
          onClear={() => setSearch('')}
        />
        <AppTable.FilterItem
          type="select"
          placeholder="Job Type"
          value={jobType}
          options={jobTypeOptions}
          clearable
          className="min-w-40"
          onChange={(val) => setJobType(val)}
          onClear={() => setJobType('')}
        />
        <AppTable.FilterItem
          type="multi-select"
          placeholder="Work Mode"
          value={remoteTypes}
          options={remoteTypeOptions}
          clearable
          className="min-w-40"
          onChange={(val) => setRemoteTypes(val)}
          onClear={() => setRemoteTypes([])}
        />
        {locationOptions.length > 0 && (
          <AppTable.FilterItem
            type="select"
            placeholder="Location"
            value={locationId}
            options={locationOptions}
            clearable
            className="min-w-40"
            onChange={(val) => setLocationId(val)}
            onClear={() => setLocationId('')}
          />
        )}
        {categoryOptions.length > 0 && (
          <AppTable.FilterItem
            type="select"
            placeholder="Category"
            value={categoryId}
            options={categoryOptions}
            clearable
            className="min-w-40"
            onChange={(val) => setCategoryId(val)}
            onClear={() => setCategoryId('')}
          />
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-5 animate-pulse h-52" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => {
            const salary = formatSalary(job.salary_min, job.salary_max, job.currency)
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.job_id}`}
                className="group rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-md border">
                    <AvatarImage src={Asset.logoUrl(job.company?.logo_url)} />
                    <AvatarFallback className="rounded-md text-xs font-semibold">
                      {Str.initials(job.company?.name ?? job.employer?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{job.company?.name ?? job.employer?.name ?? '—'}</p>
                    {job.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {job.location.city}{job.location.country ? `, ${job.location.country}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  <Badge variant="secondary" className="text-xs">{jobTypeLabel[job.job_type]}</Badge>
                  {job.remote_type && (
                    <Badge variant="outline" className="text-xs">{remoteTypeLabel[job.remote_type]}</Badge>
                  )}
                  {job.is_featured && (
                    <Badge className="text-xs bg-amber-500 hover:bg-amber-600">Featured</Badge>
                  )}
                </div>

                {salary && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{salary}</p>
                )}
              </Link>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

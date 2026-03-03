'use client'

import JobCard from '@/components/shared/JobCard'
import { Button } from '@/components/ui/button'
import { categoryService } from '@/services/category.service'
import { jobService } from '@/services/job.service'
import { locationService } from '@/services/location.service'
import { Job } from '@/types/models/job.model'
import { JobType, RemoteType } from '@/types/models/enum'
import { DropDownType } from '@/types/table-types'
import { Briefcase, Search, SlidersHorizontal, X } from 'lucide-react'
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
  const [searchInput, setSearchInput] = useState('')
  const [jobType, setJobType] = useState('')
  const [remoteType, setRemoteType] = useState('')
  const [locationId, setLocationId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [locationOptions, setLocationOptions] = useState<DropDownType[]>([])
  const [categoryOptions, setCategoryOptions] = useState<DropDownType[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    Promise.all([
      locationService.findAllForDropDown(),
      categoryService.findAllForDropDown(),
    ]).then(([locRes, catRes]) => {
      if (!locRes.error) setLocationOptions(locRes.data?.data ?? [])
      if (!catRes.error) setCategoryOptions(catRes.data?.data ?? [])
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
        remote_type: remoteType || undefined,
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
  }, [page, search, jobType, remoteType, locationId, categoryId])

  useEffect(() => { fetchJobs() }, [fetchJobs])
  useEffect(() => { setPage(1) }, [search, jobType, remoteType, locationId, categoryId])

  const totalPages = Math.ceil(total / limit)

  const hasFilters = !!(jobType || remoteType || locationId || categoryId || search)
  const clearAll = () => {
    setJobType(''); setRemoteType(''); setLocationId(''); setCategoryId('')
    setSearch(''); setSearchInput('')
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Find Your Next Job</h1>
        <p className="text-muted-foreground">{total} open positions</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchInput}
          placeholder="Search jobs by title..."
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1) } }}
          className="w-full pl-9 pr-4 h-11 rounded-lg border border-input bg-background text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {searchInput && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => { setSearchInput(''); setSearch('') }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main layout: jobs left, filters right */}
      <div className="flex gap-8 items-start">
        {/* Job list */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-5 animate-pulse h-52" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No jobs found</p>
              {hasFilters && (
                <button className="mt-3 text-sm text-primary hover:underline" onClick={clearAll}>
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Filter sidebar */}
        <div className="w-64 shrink-0 space-y-6 sticky top-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            {hasFilters && (
              <button className="text-xs text-primary hover:underline" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>

          {/* Job Type */}
          <FilterGroup
            label="Job Type"
            options={Object.entries(jobTypeLabel).map(([v, l]) => ({ value: v, label: l }))}
            selected={jobType}
            onSelect={(v) => setJobType(prev => prev === v ? '' : v)}
          />

          {/* Work Mode */}
          <FilterGroup
            label="Work Mode"
            options={Object.entries(remoteTypeLabel).map(([v, l]) => ({ value: v, label: l }))}
            selected={remoteType}
            onSelect={(v) => setRemoteType(prev => prev === v ? '' : v)}
          />

          {/* Location */}
          {locationOptions.length > 0 && (
            <FilterGroup
              label="Location"
              options={locationOptions.map(d => ({ value: String(d.id), label: d.label }))}
              selected={locationId}
              onSelect={(v) => setLocationId(prev => prev === v ? '' : v)}
            />
          )}

          {/* Category */}
          {categoryOptions.length > 0 && (
            <FilterGroup
              label="Category"
              options={categoryOptions.map(d => ({ value: String(d.id), label: d.label }))}
              selected={categoryId}
              onSelect={(v) => setCategoryId(prev => prev === v ? '' : v)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Filter group component ─────────────────────────────────────────────────
function FilterGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: { value: string; label: string }[]
  selected: string
  onSelect: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="space-y-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
              selected === opt.value
                ? 'bg-primary text-primary-foreground font-medium'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

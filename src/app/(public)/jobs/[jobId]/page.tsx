'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Asset } from '@/lib/asset'
import { Parser } from '@/lib/htmlParser'
import Str from '@/lib/str'
import { jobService } from '@/services/job.service'
import { Job } from '@/types/models/job.model'
import { JobType, RemoteType } from '@/types/models/enum'
import {
  Banknote,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Wifi,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  return 'Not specified'
}

function SidebarItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    jobService.findByJobId(jobId).then(({ data, error }) => {
      if (error || !data?.data) setNotFound(true)
      else setJob(data.data)
      setLoading(false)
    })
  }, [jobId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notFound || !job) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <h2 className="text-xl font-semibold mb-1">Job not found</h2>
        <p className="text-sm mb-4">This listing may have been removed or expired.</p>
        <Button asChild variant="outline">
          <Link href="/jobs">Back to Jobs</Link>
        </Button>
      </div>
    )
  }

  const salary = formatSalary(job.salary_min, job.salary_max, job.currency)
  const companyName = job.company?.name ?? job.employer?.name ?? 'Unknown Company'
  const expires = job.expires_at ? new Date(job.expires_at).toLocaleDateString() : null

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/jobs" className="hover:underline">Jobs</Link>
        <span className="mx-2">/</span>
        <span>{job.title}</span>
      </div>

      <div className="grid grid-cols-4 gap-8 items-start">
        {/* ── Main (3 cols) ── */}
        <div className="col-span-4 md:col-span-3 space-y-6">
          {/* Header card */}
          <div className="rounded-xl border bg-card p-6 flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-xl border shrink-0">
              <AvatarImage src={Asset.logoUrl(job.company?.logo_url)} />
              <AvatarFallback className="rounded-xl text-lg font-bold">
                {Str.initials(companyName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-tight mb-1">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> {companyName}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location.city}{job.location.country ? `, ${job.location.country}` : ''}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{jobTypeLabel[job.job_type]}</Badge>
                {job.remote_type && <Badge variant="outline">{remoteTypeLabel[job.remote_type]}</Badge>}
                {job.is_featured && <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Job Description</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {Parser.string2ui(job.description ?? '')}
            </div>
          </div>

          {/* Company info */}
          {job.company?.description && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-lg font-semibold mb-2">About {companyName}</h2>
              <p className="text-sm text-muted-foreground">{job.company.description}</p>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" /> Visit website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar (1 col) ── */}
        <div className="col-span-4 md:col-span-1 space-y-4">
          <div className="rounded-xl border bg-card p-5 space-y-4 sticky top-24">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Job Overview</h3>
            <Separator />

            <SidebarItem
              icon={<Banknote className="h-4 w-4" />}
              label="Salary"
              value={salary}
            />
            <SidebarItem
              icon={<Briefcase className="h-4 w-4" />}
              label="Job Type"
              value={jobTypeLabel[job.job_type]}
            />
            {job.remote_type && (
              <SidebarItem
                icon={<Wifi className="h-4 w-4" />}
                label="Work Mode"
                value={remoteTypeLabel[job.remote_type]}
              />
            )}
            {job.location && (
              <SidebarItem
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={`${job.location.city ?? ''}${job.location.country ? ', ' + job.location.country : ''}`}
              />
            )}
            {expires && (
              <SidebarItem
                icon={<Calendar className="h-4 w-4" />}
                label="Deadline"
                value={expires}
              />
            )}

            <Separator />

            <Button asChild className="w-full" size="lg" disabled={job.status !== 'PUBLISHED'}>
              <Link href={`/jobs/${job.job_id}/apply`}>Apply Now</Link>
            </Button>

            <Button asChild variant="outline" className="w-full" size="sm">
              <Link href="/jobs">← Back to Jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

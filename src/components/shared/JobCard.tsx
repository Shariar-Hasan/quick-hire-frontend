import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Asset } from '@/lib/asset'
import Str from '@/lib/str'
import { Job } from '@/types/models/job.model'
import { JobType, RemoteType } from '@/types/models/enum'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

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

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const salary = formatSalary(job.salary_min, job.salary_max, job.currency)
  const tags = Array.isArray(job.tags) ? job.tags : []
  const visibleTags = tags.slice(0, 3)

  return (
    <Link
      href={`/jobs/${job.job_id}`}
      className="group rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 rounded-md border shrink-0">
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
        {job.category && (
          <p className="text-xs text-muted-foreground mt-0.5">{job.category.name}</p>
        )}
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

      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{tags.length - 3} more</span>
          )}
        </div>
      )}

      {salary && (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{salary}</p>
      )}
    </Link>
  )
}

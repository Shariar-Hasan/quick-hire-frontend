import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Asset } from '@/lib/asset'
import { Parser } from '@/lib/htmlParser'
import Str from '@/lib/str'
import { Job } from '@/types/models/job.model'
import { JobType } from '@/types/models/enum'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const jobTypeLabel: Record<JobType, string> = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
}

const TAG_COLORS = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700',
    'bg-amber-100 text-amber-700',
    'bg-indigo-100 text-indigo-700',
]

function tagColorClass(tag: string) {
    let hash = 0
    for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) & 0xffff
    return TAG_COLORS[hash % TAG_COLORS.length]
}

interface JobCardProps {
    job: Job;
    isLatest?: boolean;
}

export default function JobCard({ job, isLatest }: JobCardProps) {
    const tags = Array.isArray(job.tags) ? job.tags : []
    const visibleTags = tags.slice(0, 2)
    const companyName = job.company?.name ?? job.employer?.name ?? '—'
    const description = job.description
        ? Parser.htmlString2text(job.description, { wordCount: 10 })
        : null

    return (
        <Link
            href={`/jobs/${job.job_id}`}
            className={cn(` gap-3 border border-border/70 bg-card p-4 hover:border-border hover:bg-primary/10 hover:backdrop-blur  flex flex-col duration-150 transition-all`, {
                "sm:flex-row": isLatest
            })}
        >
            {/* Left: company logo */}
            <div className='flex justify-between items-start'>
                <Avatar className="h-10 w-10 rounded-none shrink-0 border border-border/40">
                    <AvatarImage src={Asset.logoUrl(job.company?.logo_url)} className="object-cover" />
                    <AvatarFallback className="rounded-none text-xs font-semibold bg-muted">
                        {Str.initials(companyName)}
                    </AvatarFallback>
                </Avatar>
                {/* Job type badge */}
                {!isLatest && <div>
                    <span className="text-xs border border-primary/50 text-primary px-2 py-0.5  font-medium inline-block">
                        {jobTypeLabel[job.job_type]}
                    </span>
                </div>}
            </div>

            {/* Right: content */}
            <div className=" flex-1 min-w-0 flex flex-col gap-1.5">
                {/* Title */}
                <h3 className="font-bold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors truncate">
                    {job.title}
                </h3>

                {/* Company & location */}
                <p className="text-xs text-muted-foreground font-medium truncate">
                    {companyName}
                    {job.location && (
                        <span className="inline-flex items-center gap-0.5 ml-1">
                            · <MapPin className="h-2.5 w-2.5 inline" /> {job.location.city}
                        </span>
                    )}
                </p>

                {/* Description */}
                {description && !isLatest && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
                )}

                {/* Tags */}
                {visibleTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5 line-clamp-1 items-center">
                        {isLatest && <span className="border-r flex items-center justify-center"><span className='text-xs text-primary font-medium mr-1 py-0.5  bg-primary/10 px-1'>{jobTypeLabel[job.job_type]}</span> </span>}
                        {visibleTags.map((tag) => (
                            <span
                                key={tag}
                                className={`text-xs px-1.5 py-0.5 rounded-sm font-medium capitalize ${tagColorClass(tag)}`}
                            >
                                {tag}
                            </span>
                        ))}
                        {tags.length > 2 && (
                            <span className="text-xs text-muted-foreground self-center">
                                +{tags.length - 2}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    )
}

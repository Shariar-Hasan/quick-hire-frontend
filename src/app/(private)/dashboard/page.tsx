'use client'

import { jobService, DashboardAnalytics } from '@/services/job.service'
import { useEffect, useState } from 'react'
import { Briefcase, Users, CheckCircle2, Star, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  APPLIED:     { label: 'Applied',     color: 'text-blue-600',   bg: 'bg-blue-50'   },
  SHORTLISTED: { label: 'Shortlisted', color: 'text-amber-600',  bg: 'bg-amber-50'  },
  HIRED:       { label: 'Hired',       color: 'text-green-600',  bg: 'bg-green-50'  },
  REJECTED:    { label: 'Rejected',    color: 'text-red-500',    bg: 'bg-red-50'    },
}

const jobStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PUBLISHED: { label: 'Published', color: 'text-green-600', bg: 'bg-green-50'  },
  DRAFT:     { label: 'Draft',     color: 'text-amber-600', bg: 'bg-amber-50'  },
  CLOSED:    { label: 'Closed',    color: 'text-red-500',   bg: 'bg-red-50'    },
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobService.getAnalytics().then(({ data: res, error }) => {
      if (!error && res?.data) setData(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-8">

      {/* ── Page header ────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your hiring activity at a glance</p>
      </div>

      {/* ── Top stat cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          loading={loading}
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          label="Total Jobs"
          value={data?.jobs.total}
          sub={`${data?.jobs.published ?? 0} published`}
          iconBg="bg-primary/10"
        />
        <StatCard
          loading={loading}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          label="Applications"
          value={data?.applications.total}
          sub={`${data?.applications.applied ?? 0} pending review`}
          iconBg="bg-blue-100"
        />
        <StatCard
          loading={loading}
          icon={<Star className="h-5 w-5 text-amber-500" />}
          label="Shortlisted"
          value={data?.applications.shortlisted}
          sub="candidates"
          iconBg="bg-amber-100"
        />
        <StatCard
          loading={loading}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          label="Hired"
          value={data?.applications.hired}
          sub="successful hires"
          iconBg="bg-green-100"
        />
      </div>

      {/* ── Middle row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Application status breakdown */}
        <div className="border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Application Pipeline</h2>
            <Link href="/dashboard/applications" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {(['applied', 'shortlisted', 'hired', 'rejected'] as const).map((key) => {
                const cfg = statusConfig[key.toUpperCase()]
                const val = data?.applications[key] ?? 0
                const total = data?.applications.total || 1
                const pct = Math.round((val / total) * 100)
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-muted-foreground">{val} <span className="text-xs">({pct}%)</span></span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.color.replace('text-', 'bg-')}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Job status breakdown */}
        <div className="border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Job Status</h2>
            <Link href="/dashboard/jobs" className="text-xs text-primary hover:underline">Manage →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="space-y-2">
              {(['published', 'draft', 'closed'] as const).map((key) => {
                const cfg = jobStatusConfig[key.toUpperCase()]
                const val = data?.jobs[key] ?? 0
                const total = data?.jobs.total || 1
                const pct = Math.round((val / total) * 100)
                return (
                  <div key={key} className={`flex items-center justify-between px-4 py-3 ${statusConfig[key.toUpperCase()]?.bg ?? 'bg-muted'}`}>
                    <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${cfg.color}`}>{val}</p>
                      <p className="text-xs text-muted-foreground">{pct}% of total</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top jobs by applications */}
        <div className="border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Top Jobs</h2>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : !data?.topJobs.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">No jobs yet</p>
          ) : (
            <div className="space-y-0 divide-y">
              {data.topJobs.map((job, i) => (
                <div key={job.id} className="flex items-center gap-3 py-2.5">
                  <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{job.company?.name ?? '—'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{job.applications_count}</p>
                    <p className="text-xs text-muted-foreground">apps</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Applications ────────────────────────────── */}
      <div className="border bg-card">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Recent Applications</h2>
          </div>
          <Link href="/dashboard/applications" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : !data?.recentApplications.length ? (
          <p className="text-sm text-muted-foreground text-center py-12">No applications yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Applicant</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Job</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Applied</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.recentApplications.map((app) => {
                  const cfg = statusConfig[app.status]
                  const date = new Date(app.applied_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })
                  return (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-medium">{app.applicant_name}</td>
                      <td className="px-5 py-3 text-muted-foreground truncate max-w-[180px]">
                        {app.job?.title ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{app.applicant_email}</td>
                      <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">{date}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm ${cfg?.bg} ${cfg?.color}`}>
                          {cfg?.label ?? app.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────
function StatCard({
  loading, icon, label, value, sub, iconBg,
}: {
  loading: boolean
  icon: React.ReactNode
  label: string
  value?: number
  sub: string
  iconBg: string
}) {
  return (
    <div className="border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={`p-2 rounded-sm ${iconBg}`}>{icon}</div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <p className="text-3xl font-bold tracking-tight">{value ?? 0}</p>
      )}
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}


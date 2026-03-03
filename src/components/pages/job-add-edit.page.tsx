'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import TipTapEditor from '@/components/ui/tiptap-editor'
import CompanyAddEditDialog from '@/modals/company-add-edit.dialog'
import LocationAddEditDialog from '@/modals/location-add-edit.dialog'
import { categoryService } from '@/services/category.service'
import { companyService } from '@/services/company.service'
import { jobService } from '@/services/job.service'
import { locationService } from '@/services/location.service'
import { JobStatus, JobType, RemoteType } from '@/types/models/enum'
import { DropDownType } from '@/types/table-types'
import { Job } from '@/types/models/job.model'
import { format } from 'date-fns'
import { createRoute } from '@/lib/createRoute'
import { JOB_TAGS } from '@/constants/job-tags.constant'

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const jobSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    job_type: z.nativeEnum(JobType, { error: 'Job type is required' }),
    remote_type: z.nativeEnum(RemoteType).optional(),
    status: z.nativeEnum(JobStatus),
    company_id: z.coerce.number().optional(),
    location_id: z.coerce.number().optional(),
    category_id: z.coerce.number().optional(),
    tags: z.array(z.string()).default([]),
    salary_min: z.preprocess(
      (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
      z.number().positive('Must be positive').optional()
    ),
    salary_max: z.preprocess(
      (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
      z.number().positive('Must be positive').optional()
    ),
    currency: z.enum(['USD', 'BDT']).optional(),
    expires_at: z.string().optional(),
    is_featured: z.boolean().default(false),
  })
  .refine(
    (d) =>
      d.salary_min == null ||
      d.salary_max == null ||
      d.salary_max >= d.salary_min,
    { message: 'Max salary must be ≥ min salary', path: ['salary_max'] }
  )

type JobFormValues = z.infer<typeof jobSchema>

// ─── Label helpers ────────────────────────────────────────────────────────────

const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
}

const remoteTypeLabels: Record<RemoteType, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
}

const statusLabels: Record<JobStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CLOSED: 'Closed',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JobAddEditPage({ job }: { job?: Job }) {
  const router = useRouter()

  const [companies, setCompanies] = useState<DropDownType[]>([])
  const [locations, setLocations] = useState<DropDownType[]>([])
  const [categories, setCategories] = useState<DropDownType[]>([])
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false)
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([])
  const tagInputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!job?.id

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title ?? '',
      description: job?.description ?? '',
      job_type: job?.job_type ?? undefined,
      remote_type: job?.remote_type ?? undefined,
      status: job?.status ?? JobStatus.DRAFT,
      company_id: job?.company_id ?? undefined,
      location_id: job?.location_id ?? undefined,
      category_id: job?.category_id ?? undefined,
      tags: (job?.tags as string[]) ?? [],
      salary_min: job?.salary_min ?? '',
      salary_max: job?.salary_max ?? '',
      currency: (job?.currency as 'USD' | 'BDT') ?? 'BDT',
      expires_at: job?.expires_at ? format(new Date(job.expires_at), 'yyyy-MM-dd') : '',
      is_featured: job?.is_featured ?? false,
    },
  })

  useEffect(() => {
    Promise.all([
      companyService.findAllForDropDown(),
      locationService.findAllForDropDown(),
      categoryService.findAllForDropDown(),
    ]).then(([compRes, locRes, catRes]) => {
      if (!compRes.error) setCompanies(compRes.data?.data ?? [])
      if (!locRes.error) setLocations(locRes.data?.data ?? [])
      if (!catRes.error) setCategories(catRes.data?.data ?? [])
    })
  }, [])

  const onSubmit = async (values: JobFormValues) => {
    const payload = {
      ...values,
      expires_at: values.expires_at ? new Date(values.expires_at) : undefined,
      company_id: values.company_id || undefined,
      location_id: values.location_id || undefined,
      category_id: values.category_id || undefined,
      remote_type: values.remote_type || undefined,
      currency: values.currency || undefined,
    }

    const { error } = isEdit
      ? await jobService.update(job!.id, payload)
      : await jobService.create(payload)

    if (error) {
      toast.error(isEdit ? 'Failed to update job. Please try again.' : 'Failed to post job. Please try again.')
      return
    }
    toast.success(isEdit ? 'Job updated successfully!' : 'Job posted successfully!')
    router.push(createRoute('/dashboard/jobs'))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Job' : 'Post a New Job'}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isEdit ? 'Update the details of your job listing.' : 'Fill in the details below to create a new job listing.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Basic Info ──────────────────────────────────────────────── */}
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-base">Basic Information</h2>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Job Title *</label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. Senior Frontend Developer"
                  aria-invalid={!!errors.title}
                />
              )}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Description *</label>
            <div className={errors.description ? 'rounded-md ring-1 ring-destructive' : ''}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TipTapEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    minHeight="220px"
                  />
                )}
              />
            </div>
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
        </section>

        {/* ── Job Details ──────────────────────────────────────────────── */}
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-base">Job Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Job Type */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Job Type *</label>
              <Controller
                name="job_type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full" aria-invalid={!!errors.job_type}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(JobType).map((t) => (
                        <SelectItem key={t} value={t}>
                          {jobTypeLabels[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.job_type && (
                <p className="text-xs text-destructive">{errors.job_type.message}</p>
              )}
            </div>

            {/* Remote Type */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Work Mode</label>
              <Controller
                name="remote_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(v) => field.onChange(v || undefined)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RemoteType).map((t) => (
                        <SelectItem key={t} value={t}>
                          {remoteTypeLabels[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Status *</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(JobStatus).map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusLabels[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Company</label>
              <div className="flex gap-1">
                <Controller
                  name="company_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() ?? ''}
                      onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setCompanyDialogOpen(true)}
                  title="Add new company"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Location</label>
              <div className="flex gap-1">
                <Controller
                  name="location_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() ?? ''}
                      onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((l) => (
                          <SelectItem key={l.id} value={l.id.toString()}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setLocationDialogOpen(true)}
                  title="Add new location"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() ?? ''}
                  onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tags</label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => {
                const addTag = (tag: string) => {
                  const trimmed = tag.trim()
                  if (trimmed && !field.value.includes(trimmed)) {
                    field.onChange([...field.value, trimmed])
                  }
                  setTagInput('')
                  setTagSuggestions([])
                }
                const removeTag = (tag: string) => {
                  field.onChange(field.value.filter((t: string) => t !== tag))
                }
                return (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {field.value.map((tag: string) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        ref={tagInputRef}
                        type="text"
                        value={tagInput}
                        placeholder="Type a tag and press Enter or comma…"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        onChange={(e) => {
                          const val = e.target.value
                          setTagInput(val)
                          if (val.trim().length >= 1) {
                            const lower = val.toLowerCase()
                            setTagSuggestions(
                              JOB_TAGS.filter(
                                (t) =>
                                  t.toLowerCase().includes(lower) &&
                                  !field.value.includes(t)
                              ).slice(0, 8)
                            )
                          } else {
                            setTagSuggestions([])
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault()
                            addTag(tagInput)
                          } else if (e.key === 'Backspace' && !tagInput && field.value.length > 0) {
                            removeTag(field.value[field.value.length - 1])
                          }
                        }}
                        onBlur={() => setTimeout(() => setTagSuggestions([]), 150)}
                      />
                      {tagSuggestions.length > 0 && (
                        <div className="absolute z-10 top-full mt-1 w-full bg-popover border rounded-md shadow-md overflow-hidden">
                          {tagSuggestions.map((s) => (
                            <button
                              key={s}
                              type="button"
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                addTag(s)
                                tagInputRef.current?.focus()
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Press Enter or comma to add a tag. Start typing to see suggestions.</p>
                  </div>
                )
              }}
            />
          </div>
        </section>

        {/* ── Compensation ─────────────────────────────────────────────── */}
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-base">Compensation</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Min Salary</label>
              <Controller
                name="salary_min"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 50000"
                    value={field.value as string || ''}
                    onChange={field.onChange}
                    aria-invalid={!!errors.salary_min}
                  />
                )}
              />
              {errors.salary_min && (
                <p className="text-xs text-destructive">{errors.salary_min.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Max Salary</label>
              <Controller
                name="salary_max"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 80000"
                    value={field.value as string || ''}
                    onChange={field.onChange}
                    aria-invalid={!!errors.salary_max}
                  />
                )}
              />
              {errors.salary_max && (
                <p className="text-xs text-destructive">{errors.salary_max.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Currency</label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v || undefined)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">BDT (Bangladeshi Taka)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </section>

        {/* ── Extra ────────────────────────────────────────────────────── */}
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-base">Additional Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Expires At</label>
              <Controller
                name="expires_at"
                control={control}
                render={({ field }) => (
                  <Input type="date" {...field} value={field.value ?? ''} />
                )}
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Controller
                name="is_featured"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="is_featured"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label htmlFor="is_featured" className="text-sm font-medium cursor-pointer">
                Feature this job listing
              </label>
            </div>
          </div>
        </section>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/jobs')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEdit ? 'Updating...' : 'Posting...') : (isEdit ? 'Update Job' : 'Post Job')}
          </Button>
        </div>
      </form>

      {/* ── Dialogs ──────────────────────────────────────────────────── */}
      <CompanyAddEditDialog
        open={companyDialogOpen}
        onOpenChange={setCompanyDialogOpen}
        onSuccess={(item) => {
          setCompanies((prev) => [...prev, item])
          setValue('company_id', Number(item.id))
        }}
      />

      <LocationAddEditDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onSuccess={(item) => {
          setLocations((prev) => [...prev, item])
          setValue('location_id', Number(item.id))
        }}
      />
    </div>
  )
}

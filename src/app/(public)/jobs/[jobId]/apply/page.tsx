'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, FileText, Loader2, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { applicationService } from '@/services/application.service'
import { jobService } from '@/services/job.service'
import { uploadService } from '@/services/upload.service'
import { Job } from '@/types/models/job.model'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

const applySchema = z.object({
  applicant_name: z.string().min(1, 'Name is required'),
  applicant_email: z.string().email('Enter a valid email'),
  cover_letter: z.string().optional(),
})

type ApplyFormValues = z.infer<typeof applySchema>

export default function JobApplyPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [jobLoading, setJobLoading] = useState(true)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState('')
  const [resumeUploading, setResumeUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: { applicant_name: '', applicant_email: '', cover_letter: '' },
  })

  useEffect(() => {
    jobService.findByJobId(jobId).then(({ data }) => {
      setJob(data?.data ?? null)
      setJobLoading(false)
    })
  }, [jobId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setResumeError('')
    if (!file) return
    if (file.type !== 'application/pdf') {
      setResumeError('Only PDF files are allowed.')
      setResumeFile(null)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setResumeError('File size must not exceed 50 MB.')
      setResumeFile(null)
      return
    }
    setResumeFile(file)
  }

  const onSubmit = async (values: ApplyFormValues) => {
    if (!resumeFile) {
      setResumeError('Please upload your resume (PDF).')
      return
    }
    if (!job) return

    setResumeUploading(true)
    const { data: uploadData, error: uploadError } = await uploadService.uploadResume(resumeFile)
    setResumeUploading(false)

    if (uploadError || !uploadData?.data?.url) {
      toast.error('Resume upload failed. Please try again.')
      return
    }

    const { error } = await applicationService.create({
      job_id: job.id,
      applicant_name: values.applicant_name,
      applicant_email: values.applicant_email,
      resume_url: uploadData.data.url,
      cover_letter: values.cover_letter || undefined,
    })

    if (error) {
      toast.error('Failed to submit application. Please try again.')
      return
    }

    setSubmitted(true)
  }

  if (jobLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p className="text-lg mb-4">Job not found.</p>
        <Button asChild variant="outline"><Link href="/jobs">Back to Jobs</Link></Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h2 className="text-2xl font-bold">Application Submitted!</h2>
        <p className="text-muted-foreground max-w-md">
          Thank you for applying to <strong>{job.title}</strong>. We will review your application and get back to you.
        </p>
        <div className="flex gap-3 mt-2">
          <Button asChild variant="outline"><Link href="/jobs">Browse More Jobs</Link></Button>
          <Button asChild><Link href={"/jobs/" + job.job_id}>Back to Job</Link></Button>
        </div>
      </div>
    )
  }

  const isBusy = isSubmitting || resumeUploading

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/jobs" className="hover:underline">Jobs</Link>
        <span className="mx-2">/</span>
        <Link href={"/jobs/" + job.job_id} className="hover:underline">{job.title}</Link>
        <span className="mx-2">/</span>
        <span>Apply</span>
      </div>

      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Apply for {job.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {job.company?.name ?? job.employer?.name ?? 'Unknown Company'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name *</label>
            <Controller
              name="applicant_name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="John Doe" disabled={isBusy} aria-invalid={!!errors.applicant_name} />
              )}
            />
            {errors.applicant_name && (
              <p className="text-xs text-destructive">{errors.applicant_name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email Address *</label>
            <Controller
              name="applicant_email"
              control={control}
              render={({ field }) => (
                <Input {...field} type="email" placeholder="john@example.com" disabled={isBusy} aria-invalid={!!errors.applicant_email} />
              )}
            />
            {errors.applicant_email && (
              <p className="text-xs text-destructive">{errors.applicant_email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Resume (PDF) * <span className="text-muted-foreground font-normal">— max 50 MB</span>
            </label>
            <div
              onClick={() => !isBusy && fileInputRef.current?.click()}
              className={"flex items-center gap-3 rounded-lg border-2 border-dashed p-4 cursor-pointer transition-colors " +
                (resumeError ? "border-destructive bg-destructive/5 " : "border-border hover:border-primary/60 hover:bg-muted/50 ") +
                (isBusy ? "opacity-60 pointer-events-none" : "")}
            >
              {resumeFile ? (
                <>
                  <FileText className="h-8 w-8 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{resumeFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); setResumeError('') }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Click to upload your resume</p>
                    <p className="text-xs text-muted-foreground">PDF only, up to 50 MB</p>
                  </div>
                </>
              )}
            </div>
            {resumeError && <p className="text-xs text-destructive">{resumeError}</p>}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Cover Letter <span className="text-muted-foreground font-normal">— optional</span>
            </label>
            <Controller
              name="cover_letter"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={5}
                  placeholder="Tell us why you are a great fit for this role..."
                  disabled={isBusy}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 resize-none"
                />
              )}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isBusy} className="flex-1">
              {resumeUploading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading resume...</>
              ) : isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</>
              ) : (
                'Submit Application'
              )}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={"/jobs/" + job.job_id}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

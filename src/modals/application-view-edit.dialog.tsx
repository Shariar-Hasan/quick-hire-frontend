'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applicationService } from '@/services/application.service'
import { ApplicationStatus } from '@/types/models/enum'
import { Application } from '@/types/models/application.model'
import { Asset } from '@/lib/asset'
import Str from '@/lib/str'
import { Download, ExternalLink, FileText } from 'lucide-react'

const statusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  cover_letter: z.string().optional(),
})
type StatusFormValues = z.infer<typeof statusSchema>

const statusVariant: Record<ApplicationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  APPLIED:     'secondary',
  SHORTLISTED: 'default',
  REJECTED:    'destructive',
  HIRED:       'outline',
}

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED:     'Applied',
  SHORTLISTED: 'Shortlisted',
  REJECTED:    'Rejected',
  HIRED:       'Hired',
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: Application | null
  onSuccess?: (updated: Application) => void
}

export default function ApplicationViewEditDialog({ open, onOpenChange, application, onSuccess }: Props) {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: ApplicationStatus.APPLIED, cover_letter: '' },
  })

  useEffect(() => {
    if (open && application) {
      reset({
        status: application.status,
        cover_letter: application.cover_letter ?? '',
      })
    }
  }, [open, application, reset])

  const onSubmit = async (values: StatusFormValues) => {
    if (!application) return
    const { data, error } = await applicationService.updateStatus(application.id, values.status)
    if (error) return
    if (data?.data) onSuccess?.(data.data)
    onOpenChange(false)
  }

  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Job info */}
          {application.job && (
            <div className="rounded-md bg-muted px-4 py-3 space-y-0.5">
              <p className="text-xs text-muted-foreground">Job</p>
              <p className="font-semibold text-sm">{application.job.title}</p>
              <p className="text-xs text-muted-foreground">
                {Str.caseConverter(application.job.job_type, { from: 'snake', to: 'normal' })}
                {application.job.remote_type ? ` · ${Str.caseConverter(application.job.remote_type, { from: 'snake', to: 'normal' })}` : ''}
              </p>
            </div>
          )}

          {/* Applicant info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Applicant</p>
              <p className="font-medium">{application.applicant_name}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium break-all">{application.applicant_email}</p>
            </div>
            <div className="col-span-2 space-y-1.5">
              <p className="text-xs text-muted-foreground">Resume</p>
              {application.resume_url ? (() => {
                const fullUrl = Asset.resumeUrl(application.resume_url)
                const fileName = application.resume_url.split('/').pop() ?? 'resume.pdf'
                return (
                  <div className="flex items-center gap-3 border rounded-md px-3 py-2.5 bg-muted/40">
                    {/* PDF icon */}
                    <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded bg-red-100 text-red-600">
                      <FileText className="h-5 w-5" />
                    </div>

                    {/* Filename */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{decodeURIComponent(fileName)}</p>
                      <p className="text-xs text-muted-foreground">PDF Document</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open in new tab"
                      >
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                      <a
                        href={fullUrl}
                        download={decodeURIComponent(fileName)}
                        title="Download"
                      >
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                )
              })() : (
                <p className="text-sm text-muted-foreground italic">No resume uploaded</p>
              )}
            </div>
            {application.cover_letter && (
              <div className="col-span-2 space-y-0.5">
                <p className="text-xs text-muted-foreground">Cover Letter</p>
                <p className="text-sm whitespace-pre-line leading-relaxed">{application.cover_letter}</p>
              </div>
            )}
          </div>

          <hr />

          {/* Status update */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Update Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ApplicationStatus).map((s) => (
                        <SelectItem key={s} value={s}>
                          <Badge variant={statusVariant[s]} className="text-xs">{statusLabels[s]}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Update Status'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

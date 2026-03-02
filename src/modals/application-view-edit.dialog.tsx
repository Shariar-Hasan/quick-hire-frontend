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
import Str from '@/lib/str'

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
            <div className="space-y-0.5 col-span-2">
              <p className="text-xs text-muted-foreground">Resume</p>
              <a
                href={application.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2 text-sm break-all"
              >
                {application.resume_url}
              </a>
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

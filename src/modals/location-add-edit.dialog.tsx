'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { locationService } from '@/services/location.service'
import { Location } from '@/types/models/location.model'
import { DropDownType } from '@/types/table-types'

const locationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional(),
  zip_code: z.string().optional(),
})

type LocationFormValues = z.infer<typeof locationSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Location | null
  onSuccess?: (item: DropDownType) => void
}

export default function LocationAddEditDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: Props) {
  const isEdit = !!initialData

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { city: '', country: '', state: '', zip_code: '' },
  })

  useEffect(() => {
    if (open) {
      reset({
        city: initialData?.city ?? '',
        country: initialData?.country ?? '',
        state: initialData?.state ?? '',
        zip_code: initialData?.zip_code ?? '',
      })
    }
  }, [open, initialData, reset])

  const onSubmit = async (values: LocationFormValues) => {
    const payload = {
      city: values.city,
      country: values.country,
      state: values.state || undefined,
      zip_code: values.zip_code || undefined,
    }

    const { data, error } = isEdit
      ? await locationService.update(initialData!.id, payload)
      : await locationService.create(payload)

    if (error) return

    const saved = data?.data
    if (saved) {
      onSuccess?.({ id: saved.id, label: `${saved.city}, ${saved.country}` })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Location' : 'Add Location'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">City *</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Dhaka" aria-invalid={!!errors.city} />
                )}
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Country *</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Bangladesh" aria-invalid={!!errors.country} />
                )}
              />
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">State</label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Dhaka Division" />
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Zip Code</label>
              <Controller
                name="zip_code"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="1200" />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
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
import { categoryService } from '@/services/category.service'
import { Category } from '@/types/models/category.model'
import { DropDownType } from '@/types/table-types'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Category | null
  onSuccess?: (item: DropDownType) => void
}

export default function CategoryAddEditDialog({
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
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '' },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
      })
    }
  }, [open, initialData, reset])

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
    }

    const { data, error } = isEdit
      ? await categoryService.update(initialData!.id, payload)
      : await categoryService.create(payload)

    if (error) return

    const saved = data?.data
    if (saved) {
      onSuccess?.({ id: saved.id, label: saved.name })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name *</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g. Software Engineering" aria-invalid={!!errors.name} />
              )}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Short description (optional)"
                    rows={3}
                    className="flex min-h-18 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

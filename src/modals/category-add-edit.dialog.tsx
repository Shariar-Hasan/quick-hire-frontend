'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, Loader2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Asset } from '@/lib/asset'
import { categoryService } from '@/services/category.service'
import { uploadService } from '@/services/upload.service'
import { Category } from '@/types/models/category.model'
import { DropDownType } from '@/types/table-types'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  is_featured: z.boolean(),
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
  const [logoPreview, setLogoPreview] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', logo_url: '', is_featured: false },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        logo_url: initialData?.logo_url ?? '',
        is_featured: initialData?.is_featured ?? false,
      })
      setLogoPreview(initialData?.logo_url ?? '')
    }
  }, [open, initialData, reset])

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoPreview(URL.createObjectURL(file))
    setLogoUploading(true)
    const { data, error } = await uploadService.uploadLogo(file)
    setLogoUploading(false)
    if (error || !data?.data?.url) { setLogoPreview(''); return }
    setValue('logo_url', data.data.url)
  }

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      logo_url: values.logo_url || undefined,
      is_featured: values.is_featured,
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
          {/* Logo Upload */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Category Image</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={Asset.logoUrl(logoPreview)} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Button type="button" variant="outline" size="sm" disabled={logoUploading} onClick={() => fileInputRef.current?.click()}>
                  {logoUploading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</> : <><Upload className="h-4 w-4 mr-2" />Upload Image</>}
                </Button>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 3 MB</p>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
          </div>

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

          <div className="flex items-center gap-3 pt-1">
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
              Feature this category
            </label>
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

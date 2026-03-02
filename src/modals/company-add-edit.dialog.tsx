'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, Loader2, Plus, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { companyService } from '@/services/company.service'
import { locationService } from '@/services/location.service'
import { uploadService } from '@/services/upload.service'
import { Company, CompanySize } from '@/types/models/company.model'
import { DropDownType } from '@/types/table-types'
import LocationAddEditDialog from './location-add-edit.dialog'
import { Env } from '@/constants/env.constant'

const API_BASE = Env.API_URL.replace('/api', '')

const companySizeLabels: Record<CompanySize, string> = {
  STARTUP: 'Startup (1–10)',
  SMALL: 'Small (11–50)',
  MEDIUM: 'Medium (51–200)',
  LARGE: 'Large (201–1000)',
  ENTERPRISE: 'Enterprise (1000+)',
}

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  description: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logo_url: z.string().optional(),
  industry: z.string().optional(),
  size: z.nativeEnum(CompanySize).optional(),
  location_id: z.number().optional(),
})

type CompanyFormValues = z.infer<typeof companySchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Company | null
  onSuccess?: (item: DropDownType) => void
}

export default function CompanyAddEditDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: Props) {
  const isEdit = !!initialData
  const [locations, setLocations] = useState<DropDownType[]>([])
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [logoUploading, setLogoUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      description: '',
      website: '',
      logo_url: '',
      industry: '',
      size: undefined,
      location_id: undefined,
    },
  })

  useEffect(() => {
    locationService.findAllForDropDown().then(({ data }) => {
      setLocations(data?.data ?? [])
    })
  }, [])

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        website: initialData?.website ?? '',
        logo_url: initialData?.logo_url ?? '',
        industry: initialData?.industry ?? '',
        size: initialData?.size ?? undefined,
        location_id: initialData?.location_id ?? undefined,
      })
      setLogoPreview(initialData?.logo_url ?? '')
    }
  }, [open, initialData, reset])

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Show local preview immediately
    setLogoPreview(URL.createObjectURL(file))
    setLogoUploading(true)
    const { data, error } = await uploadService.uploadLogo(file)
    setLogoUploading(false)
    if (error || !data?.data?.url) {
      setLogoPreview('')
      return
    }
    setValue('logo_url', data.data.url)
  }

  const onSubmit = async (values: CompanyFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      website: values.website || undefined,
      logo_url: values.logo_url || undefined,
      industry: values.industry || undefined,
      size: values.size || undefined,
      location_id: values.location_id || undefined,
    }

    const { data, error } = isEdit
      ? await companyService.update(initialData!.id, payload)
      : await companyService.create(payload)

    if (error) return

    const saved = data?.data
    if (saved) {
      onSuccess?.({ id: saved.id, label: saved.name })
    }
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Company' : 'Add Company'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Logo Upload */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Company Logo</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoPreview.startsWith('blob:') ? logoPreview : `${API_BASE}${logoPreview}`} alt="Logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={logoUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {logoUploading ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</>
                    ) : (
                      <><Upload className="h-4 w-4 mr-2" />Upload Logo</>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 3 MB</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoFile}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Company Name *</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Acme Corp" aria-invalid={!!errors.name} />
                )}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    placeholder="About the company..."
                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] resize-none"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Website */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Website</label>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="https://example.com" aria-invalid={!!errors.website} />
                  )}
                />
                {errors.website && (
                  <p className="text-xs text-destructive">{errors.website.message}</p>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Industry</label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Software, Finance..." />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Size */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Company Size</label>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v || undefined)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CompanySize).map((s) => (
                          <SelectItem key={s} value={s}>
                            {companySizeLabels[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
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

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <LocationAddEditDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onSuccess={(item) => {
          setLocations((prev) => [...prev, item])
          setValue('location_id', Number(item.id))
        }}
      />
    </>
  )
}
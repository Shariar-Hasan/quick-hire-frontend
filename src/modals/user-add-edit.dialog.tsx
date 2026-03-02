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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { userService } from '@/services/user.service'
import { UserRole } from '@/types/models/enum'
import { User } from '@/types/models/user.model'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  password_hash: z.string().optional(),
  role: z.nativeEnum(UserRole),
})

type UserFormValues = z.infer<typeof userSchema>

const roleLabels: Record<UserRole, string> = {
  EMPLOYER: 'Employer',
  ADMIN: 'Admin',
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: User | null
  onSuccess?: (user: User) => void
}

export default function UserAddEditDialog({ open, onOpenChange, initialData, onSuccess }: Props) {
  const isEdit = !!initialData

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', password_hash: '', role: UserRole.EMPLOYER },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? '',
        email: initialData?.email ?? '',
        password_hash: '',
        role: initialData?.role ?? UserRole.EMPLOYER,
      })
    }
  }, [open, initialData, reset])

  const onSubmit = async (values: UserFormValues) => {
    const payload: Partial<User> = {
      name: values.name,
      email: values.email,
      role: values.role,
    }
    if (values.password_hash) payload.password_hash = values.password_hash

    const { data, error } = isEdit
      ? await userService.update(initialData!.id, payload)
      : await userService.create(payload)

    if (error) return

    if (data?.data) onSuccess?.(data.data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name *</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="John Doe" aria-invalid={!!errors.name} />}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email *</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} type="email" placeholder="john@example.com" aria-invalid={!!errors.email} />}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Password {isEdit ? '(leave blank to keep)' : '*'}</label>
            <Controller
              name="password_hash"
              control={control}
              render={({ field }) => <Input {...field} type="password" placeholder="••••••••" />}
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Role *</label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map((r) => (
                      <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

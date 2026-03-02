'use client'

import AppTable from '@/components/dashboard/AppTable'
import { useConfirm } from '@/components/providers/confirm-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useQueryParams } from '@/hooks/use-query-params'
import Str from '@/lib/str'
import { userService } from '@/services/user.service'
import { UserRole } from '@/types/models/enum'
import { User } from '@/types/models/user.model'
import { AppTableColumn } from '@/types/table-types'
import { Pencil, Trash } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import UserAddEditDialog from '@/modals/user-add-edit.dialog'

export default function UsersPage() {
  const confirm = useConfirm()
  const { queryParams, setOptions, options } = useQueryParams<User>({
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'id',
    sortOrder: 'ASC' as 'ASC' | 'DESC',
    filters: {},
  })

  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<User | null>(null)

  const getData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await userService.findAll(queryParams)
    if (!error) {
      setUsers(data?.data.data ?? [])
      setTotal(data?.data.meta.total ?? 0)
    }
    setLoading(false)
  }, [queryParams])

  useEffect(() => { getData() }, [getData])

  const openAdd = () => { setSelected(null); setDialogOpen(true) }
  const openEdit = (u: User) => { setSelected(u); setDialogOpen(true) }

  const handleDelete = async (u: User) => {
    if (!await confirm({
      title: 'Delete User',
      description: `Are you sure you want to delete "${u.name}"?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    })) return
    await userService.remove(u.id)
    getData()
  }

  const columns: AppTableColumn<User>[] = [
    {
      label: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {Str.initials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-tight">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Role',
      cellClass: 'text-center',
      render: (row) => (
        <Badge variant={row.role === UserRole.ADMIN ? 'default' : 'secondary'}>
          {row.role === UserRole.ADMIN ? 'Admin' : 'Employer'}
        </Badge>
      ),
    },
    {
      label: 'Actions',
      labelClass: 'text-right',
      cellClass: 'text-right',
      render: (row) => (
        <AppTable.RowAction
          type="inline"
          menuItems={[
            { label: 'Edit', icon: <Pencil className="h-4 w-4 text-cyan-900" />, onClick: () => openEdit(row) },
            { label: 'Delete', icon: <Trash className="h-4 w-4 text-red-500" />, onClick: () => handleDelete(row) },
          ]}
        />
      ),
    },
  ]

  return (
    <>
      <AppTable>
        <div className="sm:flex justify-between px-6 mb-3 w-full">
          <AppTable.FilterItem
            type="text"
            debounce
            delay={600}
            onChange={(val) => setOptions((p) => ({ ...p, search: val, page: 1 }))}
            placeholder="Search users..."
            className="w-60"
            clearable
            onClear={() => setOptions((p) => ({ ...p, search: '', page: 1 }))}
          />
          <div className="flex items-center gap-2">
            <AppTable.Button type="add" title="Add User" onClick={openAdd} />
            <AppTable.Button type="refresh" title="Refresh" onClick={getData} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 px-6 w-full">
          <AppTable.PaginationDetail page={options.page} limit={options.limit} total={total}>
            {({ itemStart, itemEnd, total }) => (
              <span className="text-sm text-muted-foreground">Showing {itemStart} – {itemEnd} of {total} users</span>
            )}
          </AppTable.PaginationDetail>
          <div className="flex items-center gap-2">
            <AppTable.Limit limit={options.limit} onLimitChange={(l) => setOptions((p) => ({ ...p, limit: l, page: 1 }))} limitOptions={[5, 10, 20, 50]} />
            <AppTable.Pagination limit={options.limit} total={total} page={options.page} onPageChange={(p) => setOptions((prev) => ({ ...prev, page: p }))} />
          </div>
        </div>

        <AppTable.Body
          columns={columns}
          datalist={users}
          loading={loading}
          onRowClick={(row) => openEdit(row)}
        />
      </AppTable>

      <UserAddEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected}
        onSuccess={() => getData()}
      />
    </>
  )
}

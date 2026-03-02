'use client'

import AppTable from '@/components/dashboard/AppTable'
import { useConfirm } from '@/components/providers/confirm-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useQueryParams } from '@/hooks/use-query-params'
import { logoUrl } from '@/lib/logo-url'
import Str from '@/lib/str'
import { companyService } from '@/services/company.service'
import { Company, CompanySize } from '@/types/models/company.model'
import { AppTableColumn } from '@/types/table-types'
import { Building2, Pencil, Trash } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import CompanyAddEditDialog from '@/modals/company-add-edit.dialog'

const sizeLabels: Record<CompanySize, string> = {
  STARTUP: 'Startup',
  SMALL: 'Small',
  MEDIUM: 'Medium',
  LARGE: 'Large',
  ENTERPRISE: 'Enterprise',
}

export default function CompaniesPage() {
  const confirm = useConfirm()
  const { queryParams, setOptions, options } = useQueryParams<Company>({
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'id',
    sortOrder: 'ASC' as 'ASC' | 'DESC',
    filters: {},
  })

  const [companies, setCompanies] = useState<Company[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Company | null>(null)

  const getData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await companyService.findAll(queryParams)
    if (!error) {
      setCompanies(data?.data.data ?? [])
      setTotal(data?.data.meta.total ?? 0)
    }
    setLoading(false)
  }, [queryParams])

  useEffect(() => { getData() }, [getData])

  const openAdd = () => { setSelected(null); setDialogOpen(true) }
  const openEdit = (c: Company) => { setSelected(c); setDialogOpen(true) }

  const handleDelete = async (c: Company) => {
    if (!await confirm({
      title: 'Delete Company',
      description: `Are you sure you want to delete "${c.name}"?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    })) return
    await companyService.remove(c.id)
    getData()
  }

  const columns: AppTableColumn<Company>[] = [
    {
      label: 'Company',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src={logoUrl(row.logo_url)} alt={row.name} className="object-cover" />
            <AvatarFallback className="rounded-lg bg-muted">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-tight">{row.name}</p>
            {row.industry && <p className="text-xs text-muted-foreground">{row.industry}</p>}
          </div>
        </div>
      ),
    },
    {
      label: 'Location',
      render: (row) =>
        row.location
          ? `${row.location.city}, ${row.location.country}`
          : <span className="text-muted-foreground text-sm">—</span>,
    },
    {
      label: 'Size',
      cellClass: 'text-center',
      render: (row) => row.size ? sizeLabels[row.size] : <span className="text-muted-foreground">—</span>,
    },
    {
      label: 'Website',
      render: (row) =>
        row.website
          ? <a href={row.website} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2 text-sm">{row.website.replace(/^https?:\/\//, '')}</a>
          : <span className="text-muted-foreground text-sm">—</span>,
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
            placeholder="Search companies..."
            className="w-60"
            clearable
            onClear={() => setOptions((p) => ({ ...p, search: '', page: 1 }))}
          />
          <div className="flex items-center gap-2">
            <AppTable.Button type="add" title="Add Company" onClick={openAdd} />
            <AppTable.Button type="refresh" title="Refresh" onClick={getData} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 px-6 w-full">
          <AppTable.PaginationDetail page={options.page} limit={options.limit} total={total}>
            {({ itemStart, itemEnd, total }) => (
              <span className="text-sm text-muted-foreground">Showing {itemStart} – {itemEnd} of {total} companies</span>
            )}
          </AppTable.PaginationDetail>
          <div className="flex items-center gap-2">
            <AppTable.Limit limit={options.limit} onLimitChange={(l) => setOptions((p) => ({ ...p, limit: l, page: 1 }))} limitOptions={[5, 10, 20, 50]} />
            <AppTable.Pagination limit={options.limit} total={total} page={options.page} onPageChange={(p) => setOptions((prev) => ({ ...prev, page: p }))} />
          </div>
        </div>

        <AppTable.Body
          columns={columns}
          datalist={companies}
          loading={loading}
          onRowClick={(row) => openEdit(row)}
        />
      </AppTable>

      <CompanyAddEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected}
        onSuccess={() => getData()}
      />
    </>
  )
}

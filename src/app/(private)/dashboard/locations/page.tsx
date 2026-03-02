'use client'

import AppTable from '@/components/dashboard/AppTable'
import { useConfirm } from '@/components/providers/confirm-provider'
import { useQueryParams } from '@/hooks/use-query-params'
import { locationService } from '@/services/location.service'
import { Location } from '@/types/models/location.model'
import { AppTableColumn } from '@/types/table-types'
import { MapPin, Pencil, Trash } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import LocationAddEditDialog from '@/modals/location-add-edit.dialog'

export default function LocationsPage() {
  const confirm = useConfirm()
  const { queryParams, setOptions, options } = useQueryParams<Location>({
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'id',
    sortOrder: 'ASC' as 'ASC' | 'DESC',
    filters: {},
  })

  const [locations, setLocations] = useState<Location[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Location | null>(null)

  const getData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await locationService.findAll(queryParams)
    if (!error) {
      setLocations(data?.data.data ?? [])
      setTotal(data?.data.meta.total ?? 0)
    }
    setLoading(false)
  }, [queryParams])

  useEffect(() => { getData() }, [getData])

  const openAdd = () => { setSelected(null); setDialogOpen(true) }
  const openEdit = (l: Location) => { setSelected(l); setDialogOpen(true) }

  const handleDelete = async (l: Location) => {
    if (!await confirm({
      title: 'Delete Location',
      description: `Are you sure you want to delete "${l.city}, ${l.country}"?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    })) return
    await locationService.remove(l.id)
    getData()
  }

  const columns: AppTableColumn<Location>[] = [
    {
      label: 'Location',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium leading-tight">{row.city}</p>
            <p className="text-xs text-muted-foreground">{row.country}</p>
          </div>
        </div>
      ),
    },
    { label: 'State', render: (row) => row.state ?? <span className="text-muted-foreground">—</span> },
    { label: 'ZIP Code', render: (row) => row.zip_code ?? <span className="text-muted-foreground">—</span> },
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
            placeholder="Search locations..."
            className="w-60"
            clearable
            onClear={() => setOptions((p) => ({ ...p, search: '', page: 1 }))}
          />
          <div className="flex items-center gap-2">
            <AppTable.Button type="add" title="Add Location" onClick={openAdd} />
            <AppTable.Button type="refresh" title="Refresh" onClick={getData} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 px-6 w-full">
          <AppTable.PaginationDetail page={options.page} limit={options.limit} total={total}>
            {({ itemStart, itemEnd, total }) => (
              <span className="text-sm text-muted-foreground">Showing {itemStart} – {itemEnd} of {total} locations</span>
            )}
          </AppTable.PaginationDetail>
          <div className="flex items-center gap-2">
            <AppTable.Limit limit={options.limit} onLimitChange={(l) => setOptions((p) => ({ ...p, limit: l, page: 1 }))} limitOptions={[5, 10, 20, 50]} />
            <AppTable.Pagination limit={options.limit} total={total} page={options.page} onPageChange={(p) => setOptions((prev) => ({ ...prev, page: p }))} />
          </div>
        </div>

        <AppTable.Body
          columns={columns}
          datalist={locations}
          loading={loading}
          onRowClick={(row) => openEdit(row)}
        />
      </AppTable>

      <LocationAddEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected}
        onSuccess={() => getData()}
      />
    </>
  )
}

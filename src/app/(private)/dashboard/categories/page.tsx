'use client'

import AppTable from '@/components/dashboard/AppTable'
import { useConfirm } from '@/components/providers/confirm-provider'
import { useQueryParams } from '@/hooks/use-query-params'
import CategoryAddEditDialog from '@/modals/category-add-edit.dialog'
import { categoryService } from '@/services/category.service'
import { Category } from '@/types/models/category.model'
import { AppTableColumn } from '@/types/table-types'
import { Asset } from '@/lib/asset'
import { Tag, Pencil, Trash } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export default function CategoriesPage() {
  const confirm = useConfirm()
  const { queryParams, setOptions, options } = useQueryParams<Category>({
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'id',
    sortOrder: 'ASC' as 'ASC' | 'DESC',
    filters: {},
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Category | null>(null)

  const getData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await categoryService.findAll(queryParams)
    if (!error) {
      setCategories(data?.data.data ?? [])
      setTotal(data?.data.meta.total ?? 0)
    }
    setLoading(false)
  }, [queryParams])

  useEffect(() => { getData() }, [getData])

  const openAdd = () => { setSelected(null); setDialogOpen(true) }
  const openEdit = (c: Category) => { setSelected(c); setDialogOpen(true) }

  const handleDelete = async (c: Category) => {
    if (!await confirm({
      title: 'Delete Category',
      description: `Are you sure you want to delete "${c.name}"?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    })) return
    await categoryService.remove(c.id)
    getData()
  }

  const columns: AppTableColumn<Category>[] = [
    {
      label: 'Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
            {row.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={Asset.logoUrl(row.logo_url)} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <Tag className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium leading-tight">{row.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Description',
      render: (row) =>
        row.description
          ? <span className="text-sm text-muted-foreground line-clamp-1">{row.description}</span>
          : <span className="text-muted-foreground">—</span>,
    },
    {
      label: 'Featured',
      render: (row) => row.is_featured
        ? <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>
        : <span className="text-muted-foreground text-xs">—</span>,
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
            placeholder="Search categories..."
            className="w-60"
            clearable
            onClear={() => setOptions((p) => ({ ...p, search: '', page: 1 }))}
          />
          <div className="flex items-center gap-2">
            <AppTable.Button type="add" title="Add Category" onClick={openAdd} />
            <AppTable.Button type="refresh" title="Refresh" onClick={getData} />
          </div>
        </div>


        <div className="flex justify-between items-center mb-4 px-6 w-full flex-col sm:flex-row gap-2">
          <AppTable.PaginationDetail
            page={options.page}
            limit={options.limit}
            total={total}
          >
            {({ itemStart, itemEnd, total }) => (
              <span className="text-sm text-muted-foreground">
                Showing {itemStart} - {itemEnd} of {total} categories
              </span>
            )}
          </AppTable.PaginationDetail>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <AppTable.Limit
              limit={options.limit}
              onLimitChange={(limit) =>
                setOptions((prev) => ({ ...prev, limit, page: 1 }))
              }
              limitOptions={[5, 10, 20, 50, 100]}
            />
            <AppTable.Pagination
              limit={options.limit}
              total={total}
              page={options.page}
              onPageChange={(page) => setOptions((prev) => ({ ...prev, page }))}
            />
          </div>
        </div>

        <AppTable.Body
          columns={columns}
          datalist={categories}
          loading={loading}
          onRowClick={(row) => openEdit(row)}
        />
      </AppTable>
      <div className="flex justify-between items-center mb-4 px-6 w-full flex-col sm:flex-row gap-2">
        <AppTable.PaginationDetail
          page={options.page}
          limit={options.limit}
          total={total}
        >
          {({ itemStart, itemEnd, total }) => (
            <span className="text-sm text-muted-foreground">
              Showing {itemStart} - {itemEnd} of {total} categories
            </span>
          )}
        </AppTable.PaginationDetail>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <AppTable.Limit
            limit={options.limit}
            onLimitChange={(limit) =>
              setOptions((prev) => ({ ...prev, limit, page: 1 }))
            }
            limitOptions={[5, 10, 20, 50, 100]}
          />
          <AppTable.Pagination
            limit={options.limit}
            total={total}
            page={options.page}
            onPageChange={(page) => setOptions((prev) => ({ ...prev, page }))}
          />
        </div>
      </div>
      <CategoryAddEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected}
        onSuccess={() => getData()}
      />
    </>
  )
}

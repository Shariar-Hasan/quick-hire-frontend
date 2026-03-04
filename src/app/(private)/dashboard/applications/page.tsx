'use client'

import AppTable from '@/components/dashboard/AppTable'
import { useQueryParams } from '@/hooks/use-query-params'
import { applicationService } from '@/services/application.service'
import { ApplicationStatus } from '@/types/models/enum'
import { Application } from '@/types/models/application.model'
import { AppTableColumn } from '@/types/table-types'
import { Badge } from '@/components/ui/badge'
import Str from '@/lib/str'
import { useCallback, useEffect, useState } from 'react'
import ApplicationViewEditDialog from '@/modals/application-view-edit.dialog'
import { Eye } from 'lucide-react'

const statusVariant: Record<ApplicationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  APPLIED: 'secondary',
  SHORTLISTED: 'default',
  REJECTED: 'destructive',
  HIRED: 'outline',
}

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  REJECTED: 'Rejected',
  HIRED: 'Hired',
}

export default function ApplicationsPage() {
  const { queryParams, setOptions, options } = useQueryParams<Application>({
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'id',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    filters: {},
  })

  const [applications, setApplications] = useState<Application[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Application | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const getData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await applicationService.findAll(queryParams)
    if (!error) {
      setApplications(data?.data.data ?? [])
      setTotal(data?.data.meta.total ?? 0)
    }
    setLoading(false)
  }, [queryParams])

  useEffect(() => { getData() }, [getData])

  const openView = (a: Application) => { setSelected(a); setDialogOpen(true) }

  const columns: AppTableColumn<Application>[] = [
    {
      label: 'Applicant',
      render: (row) => (
        <div>
          <p className="font-medium leading-tight">{row.applicant_name}</p>
          <p className="text-xs text-muted-foreground">{row.applicant_email}</p>
        </div>
      ),
    },
    {
      label: 'Job',
      render: (row) =>
        row.job
          ? <div>
            <p className="font-medium text-sm leading-tight">{row.job.title}</p>
            <p className="text-xs text-muted-foreground">{Str.caseConverter(row.job.job_type || '', { from: 'snake', to: 'normal' })}</p>
          </div>
          : <span className="text-muted-foreground">—</span>,
    },
    {
      label: 'Status',
      cellClass: 'text-center',
      render: (row) => (
        <Badge variant={statusVariant[row.status]}>{statusLabels[row.status]}</Badge>
      ),
    },
    {
      label: 'Applied At',
      render: (row) =>
        new Date(row.applied_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      label: 'Actions',
      labelClass: 'text-right',
      cellClass: 'text-right',
      render: (row) => (
        <AppTable.RowAction
          type="inline"
          menuItems={[
            { label: 'View / Update', icon: <Eye className="h-4 w-4 text-cyan-900" />, onClick: () => openView(row) },
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
            placeholder="Search applicants..."
            className="w-60"
            clearable
            onClear={() => setOptions((p) => ({ ...p, search: '', page: 1 }))}
          />
          <div className="flex items-center gap-2">
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
                Showing {itemStart} - {itemEnd} of {total} applications
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
          datalist={applications}
          loading={loading}
          onRowClick={(row) => openView(row)}
        />

        <div className="flex justify-between items-center mb-4 px-6 w-full flex-col sm:flex-row gap-2">
          <AppTable.PaginationDetail
            page={options.page}
            limit={options.limit}
            total={total}
          >
            {({ itemStart, itemEnd, total }) => (
              <span className="text-sm text-muted-foreground">
                Showing {itemStart} - {itemEnd} of {total} applications
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
      </AppTable>

      <ApplicationViewEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={selected}
        onSuccess={() => getData()}
      />
    </>
  )
}
